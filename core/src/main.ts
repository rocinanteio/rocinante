import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    allowedHeaders: '*',
  });

  const config = new DocumentBuilder()
    .setTitle('Rocinante')
    .setDescription('Rocinante Core API description with')
    .setContact(
      'kadergenc,ibrahimdagdelen,furkanemmezoglu',
      'https://www.linkedin.com/in/kadergenc/, https://www.linkedin.com/in/idalavye/',
      'kadergen1@gmal.com,ibrahimdagdelentr@gmail.com',
    )
    .setVersion('1.0')
    .addTag('roci')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
