package object_utils

import (
	v1 "k8s.io/api/apps/v1"
	v1core "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

func MergeDeployments(base, override *v1.Deployment) *v1.Deployment {
	result := base.DeepCopy()

	// Merge metadata
	result.ObjectMeta = mergeObjectMeta(base.ObjectMeta, override.ObjectMeta)

	// Merge spec
	result.Spec = mergeDeploymentSpec(base.Spec, override.Spec)
	return result
}

func mergeObjectMeta(base, override metav1.ObjectMeta) metav1.ObjectMeta {

	result := base.DeepCopy()
	// Merge labels
	if result.Labels == nil {
		result.Labels = make(map[string]string)
	}
	for key, value := range override.Labels {
		result.Labels[key] = value
	}
	// Merge annotations
	for key, value := range override.Annotations {
		if result.Annotations == nil {
			result.Annotations = map[string]string{}
		}
		result.Annotations[key] = value
	}
	return *result
}

func mergeDeploymentSpec(base, override v1.DeploymentSpec) v1.DeploymentSpec {
	result := base.DeepCopy()
	// Merge replicas
	if override.Replicas != nil {
		result.Replicas = override.Replicas
	}
	// Merge selector
	if override.Selector != nil {
		result.Selector = override.Selector
	}
	// Merge template
	result.Template = mergePodTemplateSpec(base.Template, override.Template)
	return *result
}

func mergePodTemplateSpec(base, override v1core.PodTemplateSpec) v1core.PodTemplateSpec {
	result := base.DeepCopy()
	// Merge metadata
	result.ObjectMeta = mergeObjectMeta(base.ObjectMeta, override.ObjectMeta)
	// Merge spec
	result.Spec = mergePodSpec(base.Spec, override.Spec)
	return *result
}

func mergePodSpec(base, override v1core.PodSpec) v1core.PodSpec {
	result := base.DeepCopy()
	// Merge service account name
	if override.ServiceAccountName != "" {
		result.ServiceAccountName = override.ServiceAccountName
	}
	// Merge containers
	result.Containers = mergeContainers(base.Containers, override.Containers)
	// Merge volumes
	result.Volumes = append(base.Volumes, override.Volumes...)
	return *result
}

func mergeContainers(base, override []v1core.Container) []v1core.Container {
	result := make([]v1core.Container, len(base))
	copy(result, base)

ContainerLoop:
	for _, overrideContainer := range override {
		for i, baseContainer := range result {
			if baseContainer.Name == overrideContainer.Name {
				// Merge the container
				result[i] = mergeContainer(baseContainer, overrideContainer)
				continue ContainerLoop
			}
		}
		// If the container doesn't exist in the base, add it
		result = append(result, overrideContainer)
	}

	return result
}

func mergeContainer(base, override v1core.Container) v1core.Container {
	result := base.DeepCopy()
	// Merge container fields
	result.Image = override.Image
	result.Ports = append(base.Ports, override.Ports...)
	result.Env = append(base.Env, override.Env...)

	// Add any other fields you want to merge here
	return *result
}
