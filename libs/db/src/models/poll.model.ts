import { prop, modelOptions } from '@typegoose/typegoose';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';


@modelOptions({
  schemaOptions: {
    timestamps: true
  }
})
export class Poll {
  @ApiProperty({
      
  })
  @prop({required: true})
  title: string

  @prop({required: true})
  description: string

  @prop()
  poll: number

}
