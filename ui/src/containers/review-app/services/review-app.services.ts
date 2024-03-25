import axios from 'axios';
import { ProjectModel } from '../models/project.model';
import { StopImageModel } from '../models/stop-image.model';

export async function getPipelineProjects(apiUrl: string = '') {
  return axios.get<ProjectModel[]>(`${apiUrl}/projects/pipeline`);
}

export async function stopPipelineProject(
  apiUrl: string = '',
  data: StopImageModel,
) {
  return axios.post(`${apiUrl}/projects/stop/image`, null, { params: data });
}
