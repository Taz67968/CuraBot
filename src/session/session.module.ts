import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { SessionService } from './session.service';

@Module({
  imports: [
    RedisModule.forRoot({
      config: {
        url: process.env.REDIS_URL || 'redis://localhost:6379',
      },
    }),
  ],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}
