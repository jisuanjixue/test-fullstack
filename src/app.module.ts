import { Module } from '@nestjs/common';
import { NestNextModule } from 'nest-next-module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PollsModule } from './polls/polls.module';
import { DbModule } from '@libs/db';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    DbModule,
    PollsModule,
    NestNextModule.forRoot({ dev: true }),
    EventsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
