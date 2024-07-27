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
	"github.com/idalavye/rocinante/internal/resources"
	v1 "k8s.io/api/apps/v1"
	v1core "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/api/resource"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
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

type ApplicationReconciler struct {
	client.Client
	Scheme *runtime.Scheme
}

//+kubebuilder:rbac:groups=*,resources=applications;pods;deployments;serviceaccounts;services;clusterroles;clusterrolebindings;apps,verbs=get;list;watch;create;update;patch;delete
//+kubebuilder:rbac:groups=*,resources=applications/status;pods;deployments;serviceaccounts;services;clusterroles;clusterrolebindings;apps,verbs=get;update;patch
//+kubebuilder:rbac:groups=*,resources=applications/finalizers;pods;deployments;serviceaccounts;services;clusterroles;clusterrolebindings;apps,verbs=update

func (r *ApplicationReconciler) Reconcile(ctx context.Context, req ctrl.Request) (ctrl.Result, error) {
	_ = log.FromContext(ctx)

	applicationClient := r.Client
	applicationSchema := r.Scheme

	// Fetch the ProjectX instance
	application := &rociiov1beta1.Application{}
	err := r.Get(ctx, req.NamespacedName, application)
	if err != nil {
		return ctrl.Result{}, client.IgnoreNotFound(err)
	}

	// Create Service Account
	account := resources.ServiceAccount{
		Name:        constants.GetServiceAccountName(application),
		NameSpace:   application.Namespace,
		Client:      applicationClient,
		Schema:      applicationSchema,
		Ctx:         &ctx,
		Req:         &req,
		Application: application,
	}
	_, err = account.Get()
	if err != nil {
		fmt.Println("an error occurred while getting account")
		//return reconcile.Result{}, err
	}

	// Create Core Service
	coreService := resources.Service{
		Name:        constants.GetCoreServiceName(application),
		NameSpace:   application.Namespace,
		Port:        int32(constants.GetCoreServicePort(application)),
		NodePort:    int32(constants.GetCoreServiceNodePort(application)),
		AppName:     constants.GetAppName(application),
		Override:    &application.Spec.CoreService,
		Client:      applicationClient,
		Schema:      applicationSchema,
		Ctx:         &ctx,
		Req:         &req,
		Application: application,
	}
	_, err = coreService.Get()
	if err != nil {
		fmt.Println("an error occurred while creating core service")
		//return reconcile.Result{}, err
	}

	// Create Core Socket Service
	coreSocketService := resources.Service{
		Name:        constants.GetCoreSocketServiceName(application),
		NameSpace:   application.Namespace,
		Port:        int32(constants.GetCoreServiceSocketPort(application)),
		NodePort:    int32(constants.GetCoreServiceSocketNodePort(application)),
		AppName:     constants.GetAppName(application),
		Override:    &application.Spec.CoreService,
		Client:      applicationClient,
		Schema:      applicationSchema,
		Ctx:         &ctx,
		Req:         &req,
		Application: application,
	}
	_, err = coreSocketService.Get()
	if err != nil {
		fmt.Println("an error occurred while creating core socket service")
		//return reconcile.Result{}, err
	}

	// Create Ui Service
	coreUiService := resources.Service{
		Name:        constants.GetUiServiceName(application),
		NameSpace:   application.Namespace,
		Port:        int32(constants.GetUiServicePort(application)),
		NodePort:    int32(constants.GetUiServiceNodePort(application)),
		AppName:     constants.GetAppName(application),
		Override:    &application.Spec.UiService,
		Client:      applicationClient,
		Schema:      applicationSchema,
		Ctx:         &ctx,
		Req:         &req,
		Application: application,
	}
	_, err = coreUiService.Get()
	if err != nil {
		fmt.Println("an error occurred while creating core ui service")
		//return reconcile.Result{}, err
	}

	// Create Cluster Role
	clusterRole := resources.ClusterRole{
		Name:        constants.GetClusterRoleName(application),
		NameSpace:   application.Namespace,
		Client:      applicationClient,
		Schema:      applicationSchema,
		Ctx:         &ctx,
		Req:         &req,
		Application: application,
	}

	_, err = clusterRole.Get()
	if err != nil {
		//return reconcile.Result{}, err
	}

	// Create Cluster Role Binding
	clusterRoleBinding := resources.ClusterRoleBinding{
		Name:               constants.GetClusterRoleBindingName(application),
		NameSpace:          application.Namespace,
		ServiceAccountName: constants.GetServiceAccountName(application),
		ClusterRoleName:    constants.GetClusterRoleName(application),
		Client:             applicationClient,
		Schema:             applicationSchema,
		Ctx:                &ctx,
		Req:                &req,
		Application:        application,
	}
	_, err = clusterRoleBinding.Get()
	if err != nil {
		//return reconcile.Result{}, err
	}

	// Create Deployment
	deployment := &v1.Deployment{}
	err = r.Get(ctx, client.ObjectKey{
		Namespace: application.Namespace,
		Name:      constants.GetDeploymentName(application),
	}, deployment)
	if err != nil {
		deployment := newDeployment(application)

		if err := controllerutil.SetControllerReference(application, deployment, r.Scheme); err != nil {
			return reconcile.Result{}, err
		}

		err := r.Create(ctx, deployment)
		if err != nil {
			return reconcile.Result{}, err
		}
	} else if err == nil {
		// Deployment exists, update it
		updatedDeployment := updateDeployment(newDeployment(application))
		if err := r.Update(ctx, updatedDeployment); err != nil {
			return reconcile.Result{}, err
		}
	}

	return ctrl.Result{}, nil
}

func updateDeployment(existingDeployment *v1.Deployment) *v1.Deployment {
	deployment := existingDeployment.DeepCopy()
	return deployment
}

func newDeployment(app *rociiov1beta1.Application) *v1.Deployment {
	matchers := make(map[string]string)
	matchers["app"] = constants.GetAppName(app)

	replica := int32(1)

	coreImageName := strings.Join([]string{"rocinanteio/core", app.Spec.Version.Core}, ":")

	if app.Spec.Registry.Core != "" {
		coreImageName = strings.Join([]string{app.Spec.Registry.Core, app.Spec.Version.Core}, ":")
	}

	uiImageName := strings.Join([]string{"rocinanteio/ui", app.Spec.Version.Core}, ":")
	if app.Spec.Registry.Ui != "" {
		uiImageName = strings.Join([]string{app.Spec.Registry.Ui, app.Spec.Version.Core}, ":")
	}

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
			Name:  "ROCINANTE_NAMESPACE",
			Value: app.Namespace,
		},
		{
			Name:  "K8S_HOST",
			Value: app.Spec.Variables.HostUrl,
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

	// Add Image Pull Secrets
	for _, secret := range app.Spec.Registry.ImagePullSecrets {
		defaultDeployment.Spec.Template.Spec.ImagePullSecrets = append(defaultDeployment.Spec.Template.Spec.ImagePullSecrets, v1core.LocalObjectReference{Name: secret})
	}

	return object_utils.MergeDeployments(defaultDeployment, &app.Spec.CoreDeployment)
}

// SetupWithManager sets up the controller with the Manager.
func (r *ApplicationReconciler) SetupWithManager(mgr ctrl.Manager) error {
	return ctrl.NewControllerManagedBy(mgr).
		For(&rociiov1beta1.Application{}).
		Complete(r)
}
