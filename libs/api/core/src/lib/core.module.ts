import { Module, Global } from '@nestjs/common';
import { AppConfigModule } from './config/config.module';
import { AuthModule } from './auth/auth.module';
import { ErrorLoggerService } from './logging/error-logger.service';

@Global()
@Module({
  imports: [AppConfigModule, AuthModule],
  providers: [ErrorLoggerService],
  exports: [AuthModule, ErrorLoggerService],
})
export class CoreModule {}
