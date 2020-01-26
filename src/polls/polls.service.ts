import { Injectable } from '@nestjs/common';
import {InjectModel} from 'nestjs-typegoose';
import {ReturnModelType} from '@typegoose/typegoose';
import { Poll } from '@libs/db/models/poll.model';

@Injectable()
export class PollsService {
	constructor(
		@InjectModel(Poll) private readonly model: ReturnModelType<typeof Poll>,
	) {

	}
}
