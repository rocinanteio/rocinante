import {
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import * as k8s from '@kubernetes/client-node';
import * as yaml from 'js-yaml';
import { promises as fs } from 'fs';

@Injectable()
export class K8sAdapter implements OnModuleInit {
  k8sApi: k8s.CoreV1Api;
  server: string;

  onModuleInit() {
    const kc = new k8s.KubeConfig();
    kc.loadFromDefault();
    const [protocol, ip] = kc.getCurrentCluster().server.split(':');
    this.server = `${protocol}:${ip}`;
    this.k8sApi = kc.makeApiClient(k8s.CoreV1Api);
  }

  async apply(specPath: string): Promise<k8s.KubernetesObject[]> {
    const kc = new k8s.KubeConfig();
    kc.loadFromDefault();

    const client = k8s.KubernetesObjectApi.makeApiClient(kc);

    const specString = await fs.readFile(specPath, 'utf8');
    const specs: k8s.KubernetesObject[] = yaml.loadAll(specString);
    const validSpecs = specs.filter((s) => s && s.kind && s.metadata);
    const created: k8s.KubernetesObject[] = [];
    for (const spec of validSpecs) {
      spec.metadata = spec.metadata || {};
      spec.metadata.annotations = spec.metadata.annotations || {};
      delete spec.metadata.annotations[
        'kubectl.kubernetes.io/last-applied-configuration'
      ];
      spec.metadata.annotations[
        'kubectl.kubernetes.io/last-applied-configuration'
      ] = JSON.stringify(spec);
      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        await client.read(spec);
        const response = await client.patch(spec);
        created.push(response.body);
      } catch (e) {
        const response = await client.create(spec);
        created.push(response.body);
      }
    }

    return created;
  }

  getServerIp(): string {
    return this.server;
  }

  async getAvailableNodePorts() {
    const kc = new k8s.KubeConfig();
    kc.loadFromDefault();

    const client = kc.makeApiClient(k8s.CoreV1Api);
    try {
      const result = await client.listServiceForAllNamespaces();
      const nodePorts: number[] = [];
      result.body.items.forEach((i) =>
        i.spec.ports.forEach((port) => {
          if (port.nodePort) {
            nodePorts.push(port.nodePort);
          }
        }),
      );

      return nodePorts;
    } catch (e) {
      console.error('Error occurred when getting nodePort');
      throw new InternalServerErrorException(
        'error occurred when getting available node ports , e',
        e,
      );
    }
  }
}
