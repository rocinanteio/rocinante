package resources

import (
	"fmt"
	rociiov1beta1 "github.com/idalavye/rocinante/api/v1beta1"
	"golang.org/x/net/context"
	v1core "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime"
	ctrl "sigs.k8s.io/controller-runtime"
	"sigs.k8s.io/controller-runtime/pkg/client"
	"sigs.k8s.io/controller-runtime/pkg/controller/controllerutil"
)

type ServiceAccount struct {
	Name      string
	NameSpace string
	instance  *v1core.ServiceAccount
	Client    client.Client
	Schema    *runtime.Scheme
	Ctx       *context.Context
	Req       *ctrl.Request
	ReviewApp *rociiov1beta1.ReviewApp
}

func (receiver *ServiceAccount) Create() {
	receiver.instance = &v1core.ServiceAccount{
		ObjectMeta: metav1.ObjectMeta{
			Name:      receiver.Name,
			Namespace: receiver.NameSpace,
		},
	}
}

func (receiver *ServiceAccount) Update() error {
	err := receiver.Client.Update(*receiver.Ctx, receiver.instance.DeepCopy())
	if err != nil {
		return err
	}
	return nil
}

func (receiver *ServiceAccount) Get() (*v1core.ServiceAccount, error) {
	receiver.Create()

	err := receiver.Client.Get(*receiver.Ctx, client.ObjectKey{
		Name:      receiver.Name,
		Namespace: receiver.NameSpace,
	}, receiver.instance)

	if err != nil {
		fmt.Println("err", err.Error())
		if err := controllerutil.SetControllerReference(receiver.ReviewApp, receiver.instance, receiver.Schema); err != nil {
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
