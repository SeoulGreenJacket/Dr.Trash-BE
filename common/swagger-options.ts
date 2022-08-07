import { DocumentBuilder, SwaggerCustomOptions } from '@nestjs/swagger';

export const options: SwaggerCustomOptions = {
  swaggerOptions: {
    persistAuthorization: true,
  },
};

export const config = new DocumentBuilder()
  .setTitle('Dr.Trash')
  .setDescription('Dr.Trash API description')
  .setVersion('1.0')
  .addTag('Dr.Trash')
  .build();
