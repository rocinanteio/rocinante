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

type ClusterRoleBinding struct {
	Name               string
	NameSpace          string
	ServiceAccountName string
	ClusterRoleName    string
	instance           *v1rbca.ClusterRoleBinding
	Client             client.Client
	Schema             *runtime.Scheme
	Ctx                *context.Context
	Req                *ctrl.Request
	Application        *rociiov1beta1.Application
}

func (receiver *ClusterRoleBinding) Create() {
	receiver.instance = &v1rbca.ClusterRoleBinding{
		ObjectMeta: metav1.ObjectMeta{
			Name:      receiver.Name,
			Namespace: receiver.NameSpace,
		},
		Subjects: []v1rbca.Subject{
			{
				Kind:      "ServiceAccount",
				Name:      receiver.ServiceAccountName,
				Namespace: receiver.NameSpace,
			},
		},
		RoleRef: v1rbca.RoleRef{
			APIGroup: "rbac.authorization.k8s.io",
			Kind:     "ClusterRole",
			Name:     receiver.ClusterRoleName,
		},
	}
}

func (receiver *ClusterRoleBinding) Update() error {
	err := receiver.Client.Update(*receiver.Ctx, receiver.instance)
	if err != nil {
		return err
	}
	return nil
}

func (receiver *ClusterRoleBinding) Get() (*v1rbca.ClusterRoleBinding, error) {
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
