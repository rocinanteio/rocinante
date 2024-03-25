import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { GeneratorModule } from './generator/generator.module';
import { ProjectsModule } from './projects/projects.module';
import { GithubModule } from 'src/repository/github/github.modelu';
import { K8sModule } from './k8s/k8s.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from './logger.module';
import { ConfigModule } from '@nestjs/config';
import { ConfigurationModule } from './configuration.module';
import { GitlabModule } from './repository/gitlab/gitlab.module';

@Module({
  imports: [
    HealthModule,
    GeneratorModule,
    ProjectsModule,
    LoggerModule,
    GithubModule,
    K8sModule,
    ConfigurationModule,
    GitlabModule,
    ConfigModule.forRoot({
      envFilePath: '.development.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
  ],
})
export class AppModule {}
