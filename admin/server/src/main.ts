import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs'

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('/etc/letsencrypt/live/alexserver.sytes.net/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/alexserver.sytes.net/fullchain.pem'),
  };
  const app = await NestFactory.create(AppModule, {
    httpsOptions: httpsOptions
  });
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  await app.listen(8002, '0.0.0.0');
}
bootstrap();
