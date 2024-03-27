package resources

import (
	rociiov1beta1 "github.com/idalavye/rocinante/api/v1beta1"
	object_utils "github.com/idalavye/rocinante/internal/object-utils"
	"golang.org/x/net/context"
	v1core "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/apimachinery/pkg/util/intstr"
	ctrl "sigs.k8s.io/controller-runtime"
	"sigs.k8s.io/controller-runtime/pkg/client"
	"sigs.k8s.io/controller-runtime/pkg/controller/controllerutil"
)

type Service struct {
	Name      string
	NameSpace string
	Port      int32
	NodePort  int32
	AppName   string
	Override  *v1core.Service
	instance  *v1core.Service
	Client    client.Client
	Schema    *runtime.Scheme
	Ctx       *context.Context
	Req       *ctrl.Request
	ReviewApp *rociiov1beta1.ReviewApp
}

func (receiver *Service) Create() {
	baseService := &v1core.Service{
		ObjectMeta: metav1.ObjectMeta{
			Name:      receiver.Name,
			Namespace: receiver.NameSpace,
		},
		Spec: v1core.ServiceSpec{
			Ports: []v1core.ServicePort{
				{
					Protocol:   "TCP",
					Port:       receiver.Port,
					TargetPort: intstr.FromInt32(receiver.Port),
					NodePort:   receiver.NodePort,
				},
			},
			Selector: map[string]string{"app": receiver.AppName},
			Type:     "NodePort",
		},
	}

	receiver.instance = object_utils.MergeServices(baseService, receiver.Override)
}

func (receiver *Service) Update() error {
	err := receiver.Client.Update(*receiver.Ctx, receiver.instance)
	if err != nil {
		return err
	}
	return nil
}

func (receiver *Service) Get() (*v1core.Service, error) {
	receiver.Create()

	err := receiver.Client.Get(*receiver.Ctx, client.ObjectKey{
		Name:      receiver.Name,
		Namespace: receiver.ReviewApp.Namespace,
	}, receiver.instance)

	if err != nil {
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
