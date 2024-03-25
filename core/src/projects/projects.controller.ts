import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { StartProjectDto } from './dtos/start-project.dto';
import { ProjectsService } from './projects.service';
import { CreateProjectsDto } from './dtos/create-project.dto';
import { StartProjectWithImageDto } from './dtos/start-project-with-image.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('/projects')
@ApiTags('projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Post('/start')
  async start(@Body() body: StartProjectDto) {
    await this.projectsService.startApp(body.name, body.version);
  }

  @Post('/start/image')
  async startWithPreparedImage(@Query() body: StartProjectWithImageDto) {
    return await this.projectsService.startAppWithImage(body);
  }

  @Get('/pipeline')
  async getAllProjectsBuildedWithPipeline() {
    return await this.projectsService.getAllPipelineProjects();
  }

  @Post('/stop/image')
  async stopPreparedImage(@Query() body: StartProjectWithImageDto) {
    return await this.projectsService.stopAppWithImage(body);
  }

  @Post('/create')
  async create(@Body() body: CreateProjectsDto) {
    await this.projectsService.create(body);
  }

  @Get()
  getAllProjects() {
    return this.projectsService.getAll();
  }
}
