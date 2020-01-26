import { Controller, Get, Param, Body, Post } from '@nestjs/common';
import {InjectModel} from 'nestjs-typegoose';
import {ReturnModelType} from '@typegoose/typegoose';
import { Crud } from '@libs/crud';
import { ApiTags } from '@nestjs/swagger';
import { Poll } from '@libs/db/models/poll.model';
import { PollsService } from './polls.service';

@Crud({
  model: Crud
})
@Controller('polls')
@ApiTags('polls')
export class PollsController {
  constructor(
    @InjectModel(Poll) private readonly model: ReturnModelType<typeof Poll>,
    private pollsService : PollsService
  ){
  }

}
