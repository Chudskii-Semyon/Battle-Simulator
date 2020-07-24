import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalPipes(
    new ValidationPipe({ transform: true, transformOptions: { excludeExtraneousValues: true } }),
  );
  app.enableCors({ origin: 'http://localhost:3001', credentials: true });
  await app.listen(3000);
}

bootstrap();
