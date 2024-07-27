package constants

import (
	rociiov1beta1 "github.com/idalavye/rocinante/api/v1beta1"
	"strings"
)

const (
	serviceAccountName     = "rocinante-sa"
	appName                = "rocinante"
	deploymentName         = "rocinante-deployment"
	coreServiceName        = "rocinante-core-service"
	coreSocketServiceName  = "rocinante-core-socket-service"
	coreServicePort        = 3000
	coreServiceSocketPort  = 4002
	coreServiceNodePort    = 30001
	uiServiceName          = "rocinante-ui-service"
	uiServicePort          = 4001
	uiServiceNodePort      = 30002
	clusterRoleName        = "roci-reviewapp-pod-reader"
	clusterRoleBindingName = "roci-reviewapp-cluster-pod-reader"
)

func GetServiceAccountName(app *rociiov1beta1.Application) string {
	return strings.Join([]string{serviceAccountName, app.Name}, "-")
}

func GetAppName(app *rociiov1beta1.Application) string {
	return strings.Join([]string{appName, app.Name}, "-")
}

func GetDeploymentName(app *rociiov1beta1.Application) string {
	return strings.Join([]string{deploymentName, app.Name}, "-")
}

func GetClusterRoleName(app *rociiov1beta1.Application) string {
	return strings.Join([]string{clusterRoleName, app.Name}, "-")
}

func GetClusterRoleBindingName(app *rociiov1beta1.Application) string {
	return strings.Join([]string{clusterRoleBindingName, app.Name}, "-")
}

func GetCoreServiceName(app *rociiov1beta1.Application) string {
	return strings.Join([]string{coreServiceName, app.Name}, "-")
}

func GetCoreSocketServiceName(app *rociiov1beta1.Application) string {
	return strings.Join([]string{coreSocketServiceName, app.Name}, "-")
}

func GetUiServiceName(app *rociiov1beta1.Application) string {
	return strings.Join([]string{uiServiceName, app.Name}, "-")
}

func GetCoreServicePort(app *rociiov1beta1.Application) int {
	return coreServicePort
}

func GetCoreServiceSocketPort(app *rociiov1beta1.Application) int {
	return coreServiceSocketPort
}

func GetCoreServiceNodePort(app *rociiov1beta1.Application) int {
	return int(app.Spec.Variables.CoreApiPort)
}
func GetCoreServiceSocketNodePort(app *rociiov1beta1.Application) int {
	return int(app.Spec.Variables.CoreApiSocketPort)
}

func GetUiServicePort(app *rociiov1beta1.Application) int {
	return uiServicePort
}

func GetUiServiceNodePort(app *rociiov1beta1.Application) int {
	return int(app.Spec.Variables.UiPort)
}
