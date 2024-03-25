/*
Copyright 2023.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

package controller

import (
	"context"
	"fmt"
	"github.com/idalavye/rocinante/internal/constants"
	"github.com/idalavye/rocinante/internal/object-utils"
	v1 "k8s.io/api/apps/v1"
	v1core "k8s.io/api/core/v1"
	v1rbca "k8s.io/api/rbac/v1"
	"k8s.io/apimachinery/pkg/api/resource"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/util/intstr"
	"k8s.io/apimachinery/pkg/util/json"
	"sigs.k8s.io/controller-runtime/pkg/controller/controllerutil"
	"sigs.k8s.io/controller-runtime/pkg/reconcile"
	"strings"

	"k8s.io/apimachinery/pkg/runtime"
	ctrl "sigs.k8s.io/controller-runtime"
	"sigs.k8s.io/controller-runtime/pkg/client"
	"sigs.k8s.io/controller-runtime/pkg/log"

	rociiov1beta1 "github.com/idalavye/rocinante/api/v1beta1"
)

type ReviewAppReconciler struct {
	client.Client
	Scheme *runtime.Scheme
}

//+kubebuilder:rbac:groups=*,resources=reviewapps;pods;deployments;serviceaccounts;services;clusterroles;clusterrolebindings;apps,verbs=get;list;watch;create;update;patch;delete
//+kubebuilder:rbac:groups=*,resources=reviewapps/status;pods;deployments;serviceaccounts;services;clusterroles;clusterrolebindings;apps,verbs=get;update;patch
//+kubebuilder:rbac:groups=*,resources=reviewapps/finalizers;pods;deployments;serviceaccounts;services;clusterroles;clusterrolebindings;apps,verbs=update

func (r *ReviewAppReconciler) Reconcile(ctx context.Context, req ctrl.Request) (ctrl.Result, error) {
	_ = log.FromContext(ctx)

	// Fetch the ProjectX instance
	reviewApp := &rociiov1beta1.ReviewApp{}
	err := r.Get(ctx, req.NamespacedName, reviewApp)
	if err != nil {
		return ctrl.Result{}, client.IgnoreNotFound(err)
	}

	// Create Service Account
	serviceAccount := &v1core.ServiceAccount{}
	err = r.Get(ctx, client.ObjectKey{
		Name:      constants.GetServiceAccountName(reviewApp),
		Namespace: reviewApp.Namespace,
	}, serviceAccount)
	if err != nil {
		fmt.Println("Creating service account")
		serviceAccount := newServiceAccount(reviewApp)

		if err := controllerutil.SetControllerReference(reviewApp, serviceAccount, r.Scheme); err != nil {
			fmt.Println("An error occurred here", err.Error())
			return reconcile.Result{}, err
		}

		err := r.Create(ctx, serviceAccount)
		fmt.Println("Created service account")
		if err != nil {
			return reconcile.Result{}, err
		}

	} else if err == nil {
		updatedServiceAccount := serviceAccount.DeepCopy()
		if err := r.Update(ctx, updatedServiceAccount); err != nil {
			return reconcile.Result{}, err
		}
	}

	// Create Service For Core
	service := &v1core.Service{}
	err = r.Get(ctx, client.ObjectKey{
		Name:      constants.GetCoreServiceName(reviewApp),
		Namespace: reviewApp.Namespace,
	}, service)
	if err != nil {
		service := newServiceForCore(reviewApp)

		if err := controllerutil.SetControllerReference(reviewApp, service, r.Scheme); err != nil {
			return reconcile.Result{}, err
		}

		err := r.Create(ctx, service)
		if err != nil {
			return reconcile.Result{}, err
		}

	} else if err == nil {
		if err := r.Update(ctx, newServiceForCore(reviewApp)); err != nil {
			return reconcile.Result{}, err
		}
	}

	// Create Service For Core Socket
	serviceForSocket := &v1core.Service{}
	err = r.Get(ctx, client.ObjectKey{
		Name:      constants.GetCoreSocketServiceName(reviewApp),
		Namespace: reviewApp.Namespace,
	}, serviceForSocket)
	if err != nil {
		serviceForSocket := newServiceForCoreSocket(reviewApp)

		if err := controllerutil.SetControllerReference(reviewApp, service, r.Scheme); err != nil {
			return reconcile.Result{}, err
		}

		err := r.Create(ctx, serviceForSocket)
		if err != nil {
			return reconcile.Result{}, err
		}

	} else if err == nil {
		if err := r.Update(ctx, newServiceForCoreSocket(reviewApp)); err != nil {
			return reconcile.Result{}, err
		}
	}

	// Create Service For Ui
	serviceUi := &v1core.Service{}
	err = r.Get(ctx, client.ObjectKey{
		Name:      constants.GetUiServiceName(reviewApp),
		Namespace: reviewApp.Namespace,
	}, serviceUi)
	if err != nil {
		serviceUi := newServiceForUi(reviewApp)

		if err := controllerutil.SetControllerReference(reviewApp, serviceUi, r.Scheme); err != nil {
			return reconcile.Result{}, err
		}

		err := r.Create(ctx, serviceUi)
		if err != nil {
			return reconcile.Result{}, err
		}

	} else if err == nil {
		if err := r.Update(ctx, newServiceForUi(reviewApp)); err != nil {
			return reconcile.Result{}, err
		}
	}

	// Create Cluster Role
	clusterRole := &v1rbca.ClusterRole{}
	err = r.Get(ctx, client.ObjectKey{
		Name:      constants.GetClusterRoleName(reviewApp),
		Namespace: reviewApp.Namespace,
	}, clusterRole)
	if err != nil {
		clusterRole := newClusterRole(reviewApp)

		if err := controllerutil.SetControllerReference(reviewApp, clusterRole, r.Scheme); err != nil {
			return reconcile.Result{}, err
		}

		err := r.Create(ctx, clusterRole)
		if err != nil {
			return reconcile.Result{}, err
		}

	} else if err == nil {
		updatedClusterRole := clusterRole.DeepCopy()
		if err := r.Update(ctx, updatedClusterRole); err != nil {
			return reconcile.Result{}, err
		}
	}

	clusterRoleBinding := &v1rbca.ClusterRoleBinding{}
	err = r.Get(ctx, client.ObjectKey{
		Namespace: reviewApp.Namespace,
		Name:      constants.GetClusterRoleBindingName(reviewApp),
	}, clusterRoleBinding)
	if err != nil {
		clusterRoleBinding := newClusterRoleBinding(reviewApp)

		if err := controllerutil.SetControllerReference(reviewApp, clusterRoleBinding, r.Scheme); err != nil {
			return reconcile.Result{}, err
		}

		err := r.Create(ctx, clusterRoleBinding)
		if err != nil {
			return reconcile.Result{}, err
		}

	} else if err == nil {
		updatedClusterRoleBinding := clusterRoleBinding.DeepCopy()
		if err := r.Update(ctx, updatedClusterRoleBinding); err != nil {
			return reconcile.Result{}, err
		}
	}

	// Create Deployment
	deployment := &v1.Deployment{}
	err = r.Get(ctx, client.ObjectKey{
		Namespace: reviewApp.Namespace,
		Name:      constants.GetDeploymentName(reviewApp),
	}, deployment)
	if err != nil {
		deployment := newDeployment(reviewApp)

		if err := controllerutil.SetControllerReference(reviewApp, deployment, r.Scheme); err != nil {
			return reconcile.Result{}, err
		}

		err := r.Create(ctx, deployment)
		if err != nil {
			return reconcile.Result{}, err
		}
	} else if err == nil {
		// Deployment exists, update it
		updatedDeployment := updateDeployment(newDeployment(reviewApp), reviewApp)
		if err := r.Update(ctx, updatedDeployment); err != nil {
			return reconcile.Result{}, err
		}
	}

	return ctrl.Result{}, nil
}

func newServiceForCore(app *rociiov1beta1.ReviewApp) *v1core.Service {
	service := &v1core.Service{
		ObjectMeta: metav1.ObjectMeta{
			Name:      constants.GetCoreServiceName(app),
			Namespace: app.Namespace,
		},
		Spec: v1core.ServiceSpec{
			Ports: []v1core.ServicePort{
				{
					Protocol:   "TCP",
					Port:       int32(constants.GetCoreServicePort(app)),
					TargetPort: intstr.FromInt(constants.GetCoreServicePort(app)),
					NodePort:   int32(constants.GetCoreServiceNodePort(app)),
				},
			},
			Selector: map[string]string{"app": constants.GetAppName(app)},
			Type:     "NodePort",
		},
	}

	return object_utils.MergeServices(service, &app.Spec.CoreService)
}

func newServiceForCoreSocket(app *rociiov1beta1.ReviewApp) *v1core.Service {
	service := &v1core.Service{
		ObjectMeta: metav1.ObjectMeta{
			Name:      constants.GetCoreSocketServiceName(app),
			Namespace: app.Namespace,
		},
		Spec: v1core.ServiceSpec{
			Ports: []v1core.ServicePort{
				{
					Protocol:   "TCP",
					Port:       int32(constants.GetCoreServiceSocketPort(app)),
					TargetPort: intstr.FromInt(constants.GetCoreServiceSocketPort(app)),
					NodePort:   int32(constants.GetCoreServiceSocketNodePort(app)),
				},
			},
			Selector: map[string]string{"app": constants.GetAppName(app)},
			Type:     "NodePort",
		},
	}

	return object_utils.MergeServices(service, &app.Spec.CoreService)
}

func newServiceForUi(app *rociiov1beta1.ReviewApp) *v1core.Service {
	service := &v1core.Service{
		ObjectMeta: metav1.ObjectMeta{
			Name:      constants.GetUiServiceName(app),
			Namespace: app.Namespace,
		},
		Spec: v1core.ServiceSpec{
			Ports: []v1core.ServicePort{
				{
					Protocol:   "TCP",
					Port:       int32(constants.GetUiServicePort(app)),
					TargetPort: intstr.FromInt(constants.GetUiServicePort(app)),
					NodePort:   int32(constants.GetUiServiceNodePort(app)),
				},
			},
			Selector: map[string]string{"app": constants.GetAppName(app)},
			Type:     "NodePort",
		},
	}

	return object_utils.MergeServices(service, &app.Spec.UiService)
}

func newServiceAccount(app *rociiov1beta1.ReviewApp) *v1core.ServiceAccount {
	serviceAccount := &v1core.ServiceAccount{
		ObjectMeta: metav1.ObjectMeta{
			Name:      constants.GetServiceAccountName(app),
			Namespace: app.Namespace,
		},
	}

	return serviceAccount
}

func newClusterRoleBinding(app *rociiov1beta1.ReviewApp) *v1rbca.ClusterRoleBinding {
	clusterRoleBinding := &v1rbca.ClusterRoleBinding{
		ObjectMeta: metav1.ObjectMeta{
			Name:      constants.GetClusterRoleBindingName(app),
			Namespace: app.Namespace,
		},
		Subjects: []v1rbca.Subject{
			{
				Kind:      "ServiceAccount",
				Name:      constants.GetServiceAccountName(app),
				Namespace: app.Namespace,
			},
		},
		RoleRef: v1rbca.RoleRef{
			APIGroup: "rbac.authorization.k8s.io",
			Kind:     "ClusterRole",
			Name:     constants.GetClusterRoleName(app),
		},
	}

	return clusterRoleBinding
}

func newClusterRole(app *rociiov1beta1.ReviewApp) *v1rbca.ClusterRole {
	clusterRole := &v1rbca.ClusterRole{
		TypeMeta: metav1.TypeMeta{
			Kind:       "ClusterRole",
			APIVersion: "rbac.authorization.k8s.io/v1",
		},
		ObjectMeta: metav1.ObjectMeta{
			Name:      constants.GetClusterRoleName(app),
			Namespace: app.Namespace,
		},
		Rules: []v1rbca.PolicyRule{
			{
				Verbs:     []string{"get", "list", "watch", "create", "update", "patch", "delete"},
				APIGroups: []string{""},
				Resources: []string{"pods", "services"},
			},
			{
				Verbs:     []string{"get", "list", "create", "update", "patch", "delete"},
				APIGroups: []string{"apps"},
				Resources: []string{"deployments"},
			},
		},
	}

	return clusterRole
}

func updateDeployment(existingDeployment *v1.Deployment, app *rociiov1beta1.ReviewApp) *v1.Deployment {
	deployment := existingDeployment.DeepCopy()
	return deployment
}

func newDeployment(app *rociiov1beta1.ReviewApp) *v1.Deployment {
	matchers := make(map[string]string)
	matchers["app"] = constants.GetAppName(app)

	replica := int32(1)

	coreImageName := strings.Join([]string{"idalavye/rocinante-core", app.Version}, ":")
	uiImageName := strings.Join([]string{"idalavye/rocinante-ui", app.Version}, ":")

	coreEnvs := []v1core.EnvVar{
		{
			Name:  "DOCKER_HOST",
			Value: "localhost:2375",
		},
		{
			Name:  "DOCKER_TLS_CERTDIR",
			Value: "",
		},
		{
			Name:  "REVIEWAPP_NAMESPACE",
			Value: app.Namespace,
		},
	}

	uiEnvs := []v1core.EnvVar{
		{
			Name:  "API_URL",
			Value: app.Spec.Variables.ApiUrl,
		},
	}

	for _, envVar := range app.Spec.Env {
		coreEnvs = append(coreEnvs, envVar)
	}

	overrideDeployment := app.Spec.Override.Deployment
	if overrideDeploymentJson, err := json.Marshal(overrideDeployment); err != nil {
		fmt.Println(err.Error())
	} else {
		coreEnvs = append(coreEnvs, v1core.EnvVar{
			Name:  "K8S_DEPLOYMENT_OVERRIDE",
			Value: string(overrideDeploymentJson),
		})
	}

	overrideService := app.Spec.Override.Service
	if overrideServiceJson, err := json.Marshal(overrideService); err != nil {
		fmt.Println(err.Error())
	} else {
		coreEnvs = append(coreEnvs, v1core.EnvVar{
			Name:  "K8S_SERVICE_OVERRIDE",
			Value: string(overrideServiceJson),
		})
	}

	var privilegedRef *bool
	privileged := true
	privilegedRef = &privileged

	defaultDeployment := &v1.Deployment{
		ObjectMeta: metav1.ObjectMeta{
			Name:      constants.GetDeploymentName(app),
			Namespace: app.Namespace,
		},
		Spec: v1.DeploymentSpec{
			Replicas: &replica,
			Selector: &metav1.LabelSelector{
				MatchLabels: matchers,
			},
			Template: v1core.PodTemplateSpec{
				ObjectMeta: metav1.ObjectMeta{
					Labels:      map[string]string{"app": constants.GetAppName(app)},
					Annotations: map[string]string{},
				},
				Spec: v1core.PodSpec{
					ServiceAccountName: constants.GetServiceAccountName(app),
					Containers: []v1core.Container{
						{
							Name:  "rocinante-core",
							Image: coreImageName,
							Ports: []v1core.ContainerPort{
								{
									ContainerPort: int32(constants.GetCoreServicePort(app)),
								},
							},
							Env: coreEnvs,
							VolumeMounts: []v1core.VolumeMount{
								{
									Name:      "docker-graph-storage",
									MountPath: "/var/lib/docker",
								},
							},
						},
						{
							Name:  "rocinante-ui",
							Image: uiImageName,
							Env:   uiEnvs,
							Ports: []v1core.ContainerPort{
								{
									ContainerPort: int32(constants.GetUiServicePort(app)),
								},
							},
							Args: []string{""},
						},
						{
							Name:  "dind-daemon",
							Image: "docker:dind",
							Env: []v1core.EnvVar{
								{
									Name:  "DOCKER_TLS_CERTDIR",
									Value: "",
								},
							},
							Resources: v1core.ResourceRequirements{
								Requests: v1core.ResourceList{
									v1core.ResourceCPU:    resource.MustParse("20m"),
									v1core.ResourceMemory: resource.MustParse("512Mi"),
								},
							},
							SecurityContext: &v1core.SecurityContext{
								Privileged: privilegedRef,
							},
							VolumeMounts: []v1core.VolumeMount{
								{
									Name:      "docker-graph-storage",
									MountPath: "/var/lib/docker",
								},
							},
						},
					},
					Volumes: []v1core.Volume{
						{
							Name: "docker-graph-storage",
						},
					},
				},
			},
		},
	}

	return object_utils.MergeDeployments(defaultDeployment, &app.Spec.CoreDeployment)
}

// SetupWithManager sets up the controller with the Manager.
func (r *ReviewAppReconciler) SetupWithManager(mgr ctrl.Manager) error {
	return ctrl.NewControllerManagedBy(mgr).
		For(&rociiov1beta1.ReviewApp{}).
		Complete(r)
}
