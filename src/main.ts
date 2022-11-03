import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './exception.filter';
async function bootstrap() {
  console.log(process.env.PORT);
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      /*exceptionFactory: (errors) => {
        const errorsForResp = [];
        errors.forEach((err) => {
          const keys = Object.keys(err.constraints);
          keys.forEach((k) => {
            errorsForResp.push({
              message: err.constraints[k],
              field: err.property,
            });
          });
        });
      },*/
    }),
  );
  app.enableCors();
  //app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(process.env.PORT || 7000);
}
bootstrap();
