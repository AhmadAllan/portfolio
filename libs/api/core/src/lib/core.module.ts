import { Module, Global } from '@nestjs/common';
import { AppConfigModule } from './config/config.module';

@Global()
@Module({
  imports: [AppConfigModule],
  providers: [],
  exports: [],
})
export class CoreModule {}
