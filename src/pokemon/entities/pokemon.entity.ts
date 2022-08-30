import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema() //decorador para delcarar que esta entidad es un esquema 
export class Pokemon extends Document {

    // id : string // mongo me da el id
    @Prop({
        unique: true,
        index: true
    })
    name: string;
    
    @Prop({
        unique: true,
        index: true
    })
    no:number;
}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon);