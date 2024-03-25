import { K8sObject } from './k8s-object';
import { readFile, writeFile } from '../../../shared/utils/fs.utils';
import { K8sConfig } from '../configs/k8s.config';
import * as yaml from 'js-yaml';
import { KubernetesObject } from '@kubernetes/client-node';
import { mergeK8sObject } from '../helpers/merge-k8s-object.helper';

export class K8sDeploymentObject {
  private readonly projectName = '<project-name>';
  private readonly projectImage = '<project-image>';
  private readonly projectPort = '<project-port>';
  private readonly projectNamespace = '<project-namespace>';

  public filePath = '';

  generateFromTemplate(
    object: K8sObject,
    targetLocation: string,
    config: K8sConfig,
  ) {
    const _static = readFile('/static/k8s/deployment.yaml').toString();

    const _base = _static
      .replaceAll(this.projectName, object.projectName)
      .replaceAll(this.projectImage, object.projectImage)
      .replaceAll(this.projectNamespace, object.projectNamespace)
      .replaceAll(this.projectPort, object.projectPort.toString());

    const _baseYaml: KubernetesObject = yaml.load(_base);
    const _finalYaml = mergeK8sObject(_baseYaml, config.overrideDeployment);

    this.filePath = `/static/_generated/k8s/${targetLocation}/deployment.yaml`;
    writeFile(this.filePath, yaml.dump(_finalYaml));
  }
}
