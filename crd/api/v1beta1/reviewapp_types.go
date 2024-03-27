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

// ReviewAppSpec defines the desired state of ReviewApp

type Override struct {
	// +kubebuilder:pruning:PreserveUnknownFields
	// +kubebuilder:validation:Schemaless
	Deployment v1.Deployment `json:"deployment,omitempty"`
	// +kubebuilder:pruning:PreserveUnknownFields
	// +kubebuilder:validation:Schemaless
	Service v1core.Service `json:"service,omitempty"`
}
type ReviewAppSpec struct {
	Env      []v1core.EnvVar   `json:"env,omitempty"`
	Override Override          `json:"override,omitempty"`
	Registry ReviewAppRegistry `json:"registry,omitempty"`
	// +kubebuilder:pruning:PreserveUnknownFields
	// +kubebuilder:validation:Schemaless
	CoreDeployment v1.Deployment `json:"coreDeployment,omitempty"`
	// +kubebuilder:pruning:PreserveUnknownFields
	// +kubebuilder:validation:Schemaless
	UiService v1core.Service `json:"uiService,omitempty"`
	// +kubebuilder:pruning:PreserveUnknownFields
	// +kubebuilder:validation:Schemaless
	CoreService v1core.Service     `json:"coreService,omitempty"`
	Variables   ReviewAppVariables `json:"variables"`
}

type ReviewAppRegistry struct {
	Ui               string   `json:"ui,omitempty"`
	Core             string   `json:"core,omitempty"`
	ImagePullSecrets []string `json:"imagePullSecrets,omitempty"`
}

// ReviewAppStatus defines the observed state of ReviewApp
type ReviewAppStatus struct {
	// INSERT ADDITIONAL STATUS FIELD - define observed state of cluster
	// Important: Run "make" to regenerate code after modifying this file
}

//+kubebuilder:object:root=true
//+kubebuilder:subresource:status

// ReviewApp is the Schema for the reviewapps API
type ReviewApp struct {
	metav1.TypeMeta   `json:",inline"`
	metav1.ObjectMeta `json:"metadata,omitempty"`

	Version string          `json:"version"`
	Spec    ReviewAppSpec   `json:"spec,omitempty"`
	Status  ReviewAppStatus `json:"status,omitempty"`
}

//+kubebuilder:object:root=true

// ReviewAppList contains a list of ReviewApp
type ReviewAppList struct {
	metav1.TypeMeta `json:",inline"`
	metav1.ListMeta `json:"metadata,omitempty"`
	Items           []ReviewApp `json:"items"`
}

type ReviewAppVariables struct {
	CoreApiPort       int64  `json:"coreApiPort"`
	CoreApiSocketPort int64  `json:"coreApiSocketPort"`
	UiPort            int64  `json:"uiPort"`
	ApiUrl            string `json:"apiUrl"`
}

func init() {
	SchemeBuilder.Register(&ReviewApp{}, &ReviewAppList{})
}
