import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { isMongoId } from 'class-validator';

@Injectable()
export class PokemonService {

  constructor( 
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ){}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
      
    } catch (error) {
      // Error de registros parecido
      this.handleExeptions(error);
    }

    //return 'This action adds a new pokemon';
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(termino: string) {
    
    let pokemon:Pokemon;

    //buscar por no
    if(!isNaN(+termino)){
      pokemon = await this.pokemonModel.findOne({no:termino});
    }

    //MongoID
    if(isMongoId(termino)){
      pokemon = await this.pokemonModel.findById(termino);
    }

    // buscar por el nombre
    if(!pokemon){
      pokemon = await this.pokemonModel.findOne({name:termino});
    }
    // si no hay un pokemon
    if(!pokemon) throw new NotFoundException(`Pokemon whih id or no "${termino}" not found`);
 
    return pokemon;
  }

  async update(termino: string, updatePokemonDto: UpdatePokemonDto) {

    const pokemon = await this.findOne(termino);
    if( updatePokemonDto.name ){
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    }

    try {
      await pokemon.updateOne(updatePokemonDto, {new:true}); // salvamos en la BD los cambios
      return {...pokemon.toJSON(), ...updatePokemonDto};
      
    } catch (error) {
     this.handleExeptions(error);
    }

  }

  async remove(id: string) {

    //const pokemon = await this.findOne(id);
    //await pokemon.deleteOne();
    //const result = await this.pokemonModel.findByIdAndDelete(id); // eliminar un registro definitivamente
    const {deletedCount} = await this.pokemonModel.deleteOne({_id: id});
    if(deletedCount === 0){
      throw new BadRequestException(`Pokemon with id "${id}" not found`);
    }
    return;
  }

  private handleExeptions(error: any){
    if(error.code === 11000){
      throw new BadRequestException(`Pokemon exist in db ${JSON.stringify(error.keyValue)}`);
    }
    console.log(error);
    throw new InternalServerErrorException(`Can't create Pokemon - Check server logs` );
  }
}
