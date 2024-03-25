import { K8sObject } from './k8s-object';
import { readFile, writeFile } from '../../../shared/utils/fs.utils';
import { KubernetesObject } from '@kubernetes/client-node';
import * as yaml from 'js-yaml';
import { mergeK8sObject } from '../helpers/merge-k8s-object.helper';
import { K8sConfig } from '../configs/k8s.config';

export class K8sServiceObject {
  private readonly projectName = '<project-name>';
  private readonly projectAppPort = '<app-port>';
  private readonly projectNodePort = '<node-port>';
  private readonly projectNamespace = '<project-namespace>';

  public nodePort = 0;
  public filePath = '';

  generateFromTemplate(
    object: K8sObject,
    targetLocation: string,
    nodePort: number,
    config: K8sConfig,
  ) {
    const _static = readFile('/static/k8s/service.yaml').toString();

    this.nodePort = nodePort;

    const _base = _static
      .replaceAll(this.projectName, object.projectName)
      .replaceAll(this.projectAppPort, object.projectPort.toString())
      .replaceAll(this.projectNamespace, object.projectNamespace)
      .replaceAll(this.projectNodePort, nodePort.toString());

    const _baseYaml: KubernetesObject = yaml.load(_base);
    const _finalYaml = mergeK8sObject(_baseYaml, config.overrideService);

    this.filePath = `/static/_generated/k8s/${targetLocation}/service.yaml`;
    writeFile(this.filePath, yaml.dump(_finalYaml));
  }
}
