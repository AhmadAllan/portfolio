import { Module, Global } from '@nestjs/common';
import { AppConfigModule } from './config/config.module';
import { AuthModule } from './auth/auth.module';

@Global()
@Module({
  imports: [AppConfigModule, AuthModule],
  providers: [],
  exports: [AuthModule],
})
export class CoreModule {}
