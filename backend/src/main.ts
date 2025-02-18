import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { config } from 'dotenv';

config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api/v1');
  const isProd = process.env.NODE_ENV === 'production';
  app.enableCors({
    credentials: true,
    // origin: isProd ? 'https://techmasta.uz' : true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  const port = process.env.PORT || 3030;
  await app.listen(+port);
  return port;
}

bootstrap()
  .then((port) => {
    Logger.log(`Server is running on host: http://localhost:${port}`);
    console.log(`Server running on port ${port}`);
  })
  .catch((e) => {
    console.log(e);
    Logger.error('Server rejected');
  });
