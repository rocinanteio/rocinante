import { Global, Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { GeneratorModule } from '../generator/generator.module';
import { ProjectsController } from './projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectEntity } from './entities/project.entity';
import { ProjectsRepository } from './projects.repository';
import { ProjectsGateway } from './projects.gateway';
import { ProjectImageEntity } from './entities/project-image.entity';

@Global()
@Module({
  controllers: [ProjectsController],
  providers: [ProjectsGateway, ProjectsService, ProjectsRepository],
  imports: [
    GeneratorModule,
    TypeOrmModule.forFeature([ProjectEntity, ProjectImageEntity]),
  ],
  exports: [ProjectsService],
})
export class ProjectsModule {}
