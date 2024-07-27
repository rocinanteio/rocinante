package resources

import (
	rociiov1beta1 "github.com/idalavye/rocinante/api/v1beta1"
	"golang.org/x/net/context"
	v1rbca "k8s.io/api/rbac/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime"
	ctrl "sigs.k8s.io/controller-runtime"
	"sigs.k8s.io/controller-runtime/pkg/client"
	"sigs.k8s.io/controller-runtime/pkg/controller/controllerutil"
)

type ClusterRole struct {
	Name        string
	NameSpace   string
	instance    *v1rbca.ClusterRole
	Client      client.Client
	Schema      *runtime.Scheme
	Ctx         *context.Context
	Req         *ctrl.Request
	Application *rociiov1beta1.Application
}

func (receiver *ClusterRole) Create() {
	receiver.instance = &v1rbca.ClusterRole{
		TypeMeta: metav1.TypeMeta{
			Kind:       "ClusterRole",
			APIVersion: "rbac.authorization.k8s.io/v1",
		},
		ObjectMeta: metav1.ObjectMeta{
			Name:      receiver.Name,
			Namespace: receiver.NameSpace,
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
}

func (receiver *ClusterRole) Update() error {
	err := receiver.Client.Update(*receiver.Ctx, receiver.instance)
	if err != nil {
		return err
	}
	return nil
}

func (receiver *ClusterRole) Get() (*v1rbca.ClusterRole, error) {
	receiver.Create()

	err := receiver.Client.Get(*receiver.Ctx, client.ObjectKey{
		Name:      receiver.Name,
		Namespace: receiver.Application.Namespace,
	}, receiver.instance)

	if err != nil {
		if err := controllerutil.SetControllerReference(receiver.Application, receiver.instance, receiver.Schema); err != nil {
			return nil, err
		}

		err := receiver.Client.Create(*receiver.Ctx, receiver.instance)
		if err != nil {
			return nil, err
		}
	} else if err == nil {
		err := receiver.Update()
		if err != nil {
			return nil, err
		}
	}

	return receiver.instance, nil
}
