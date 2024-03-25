import { K8sObjectsEnum } from '../models/k8s-objects.enum';

export const K8SCommands = {
  DELETE: (kind: K8sObjectsEnum, name: string, namespace: string) =>
    `kubectl delete ${kind} ${name} -n ${namespace}`,
};
