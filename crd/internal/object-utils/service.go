package object_utils

import (
	v1core "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/util/intstr"
)

func MergeServices(base, override *v1core.Service) *v1core.Service {
	result := base.DeepCopy()
	// Merge metadata
	result.ObjectMeta = mergeObjectMeta(base.ObjectMeta, override.ObjectMeta)
	// Merge spec
	result.Spec = mergeServiceSpec(base.Spec, override.Spec)
	return result
}

func mergeServiceSpec(base, override v1core.ServiceSpec) v1core.ServiceSpec {
	result := base.DeepCopy()
	// Merge ports
	result.Ports = mergeServicePorts(base.Ports, override.Ports)
	// Merge selector
	if override.Selector != nil {
		result.Selector = override.Selector
	}
	// Add any other fields you want to merge here

	return *result
}

func mergeServicePorts(base, override []v1core.ServicePort) []v1core.ServicePort {
	result := make([]v1core.ServicePort, len(base))
	copy(result, base)

PortLoop:
	for _, overridePort := range override {
		for i, basePort := range result {
			if basePort.Port == overridePort.Port {
				// Merge the service port
				result[i] = mergeServicePort(basePort, overridePort)
				continue PortLoop
			}
		}
		// If the port doesn't exist in the base, add it
		result = append(result, overridePort)
	}

	return result
}

func mergeServicePort(base, override v1core.ServicePort) v1core.ServicePort {
	result := base
	// Merge service port fields
	result.Protocol = override.Protocol
	result.TargetPort = intstr.FromInt(int(override.TargetPort.IntValue()))
	// Add any other fields you want to merge here

	return result
}
