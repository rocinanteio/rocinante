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

package v1beta1

import (
	v1 "k8s.io/api/apps/v1"
	v1core "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

// ApplicationSpec defines the desired state of Application

type Override struct {
	// +kubebuilder:pruning:PreserveUnknownFields
	// +kubebuilder:validation:Schemaless
	Deployment v1.Deployment `json:"deployment,omitempty"`
	// +kubebuilder:pruning:PreserveUnknownFields
	// +kubebuilder:validation:Schemaless
	Service v1core.Service `json:"service,omitempty"`
}
type ApplicationSpec struct {
	Env      []v1core.EnvVar     `json:"env,omitempty"`
	Override Override            `json:"override,omitempty"`
	Registry ApplicationRegistry `json:"registry,omitempty"`
	// +kubebuilder:pruning:PreserveUnknownFields
	// +kubebuilder:validation:Schemaless
	CoreDeployment v1.Deployment `json:"coreDeployment,omitempty"`
	// +kubebuilder:pruning:PreserveUnknownFields
	// +kubebuilder:validation:Schemaless
	UiService v1core.Service `json:"uiService,omitempty"`
	// +kubebuilder:pruning:PreserveUnknownFields
	// +kubebuilder:validation:Schemaless
	CoreService v1core.Service       `json:"coreService,omitempty"`
	Variables   ApplicationVariables `json:"variables"`
	Version     Version              `json:"version"`
}

type ApplicationRegistry struct {
	Ui               string   `json:"ui,omitempty"`
	Core             string   `json:"core,omitempty"`
	ImagePullSecrets []string `json:"imagePullSecrets,omitempty"`
}

// ApplicationStatus defines the observed state of Application
type ApplicationStatus struct {
	// INSERT ADDITIONAL STATUS FIELD - define observed state of cluster
	// Important: Run "make" to regenerate code after modifying this file
}

//+kubebuilder:object:root=true
//+kubebuilder:subresource:status

// Application is the Schema for the rocinante API
type Application struct {
	metav1.TypeMeta   `json:",inline"`
	metav1.ObjectMeta `json:"metadata,omitempty"`

	Spec   ApplicationSpec   `json:"spec,omitempty"`
	Status ApplicationStatus `json:"status,omitempty"`
}

type Version struct {
	UI   string `json:"ui,omitempty"`
	Core string `json:"core,omitempty"`
}

//+kubebuilder:object:root=true

// ApplicationList contains a list of Application
type ApplicationList struct {
	metav1.TypeMeta `json:",inline"`
	metav1.ListMeta `json:"metadata,omitempty"`
	Items           []Application `json:"items"`
}

type ApplicationVariables struct {
	CoreApiPort       int64  `json:"coreApiPort"`
	CoreApiSocketPort int64  `json:"coreApiSocketPort"`
	UiPort            int64  `json:"uiPort"`
	ApiUrl            string `json:"apiUrl"`
	HostUrl           string `json:"hostUrl"`
}

func init() {
	SchemeBuilder.Register(&Application{}, &ApplicationList{})
}
