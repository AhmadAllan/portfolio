import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        // Environment
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'staging')
          .default('development'),

        // Server Configuration
        PORT: Joi.number().default(3000),
        API_PREFIX: Joi.string().default('api/v1'),
        FRONTEND_URL: Joi.string().uri().required(),

        // Database
        DATABASE_URL: Joi.string()
          .pattern(/^postgresql:\/\/.+/)
          .required()
          .messages({
            'string.pattern.base': 'DATABASE_URL must be a valid PostgreSQL connection string (postgresql://...)',
          }),

        // JWT Configuration
        JWT_SECRET: Joi.string().min(32).required(),
        JWT_REFRESH_SECRET: Joi.string().min(32).required(),
        JWT_ACCESS_EXPIRATION: Joi.string().default('15m'),
        JWT_REFRESH_EXPIRATION: Joi.string().default('7d'),

        // CORS Configuration
        CORS_ORIGIN: Joi.string().uri().required(),
        COOKIE_DOMAIN: Joi.string().default('localhost'),

        // File Upload
        UPLOAD_DIR: Joi.string().default('./uploads'),
        MAX_FILE_SIZE: Joi.number().default(10485760), // 10MB
      }),
      validationOptions: {
        abortEarly: false,
        allowUnknown: true,
      },
    }),
  ],
})
export class AppConfigModule {}
