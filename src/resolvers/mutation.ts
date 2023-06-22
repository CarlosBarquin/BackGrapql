
import { ObjectId } from "mongo";
import { Car, User } from "../types.ts";
import { carsCollection, UsersCollection } from "../db/dbconnection.ts";
import { CarSchema, UserSchema } from "../db/schema.ts";
import { createJWT, verifyJWT } from "../libs/jwt.ts";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";

export const Mutation = {
  register: async (
    _: unknown,
    args: {
      username: string;
      email: string;
      password: string;
      name: string;
      surname: string;
      admin : boolean
    }
  ): Promise<UserSchema & { token : String}> => {
    try {
      const user: UserSchema | undefined = await UsersCollection.findOne({
        username: args.username,
      });
      if (user) {
        throw new Error("User already exists");
      }
      const hashedPassword = await bcrypt.hash(args.password);
      const _id = new ObjectId();
      const token = await createJWT(
        {
          username: args.username,
          email: args.email,
          name: args.name,
          surname: args.surname,
          admin : args.admin,
          id: _id.toString(),
          cars : []
        },
        Deno.env.get("JWT_SECRET")!
      );
      const newUser: UserSchema = {
        _id,
        username: args.username,
        email: args.email,
        password: hashedPassword,
        name: args.name,
        admin : args.admin,
        surname: args.surname,
        //cars : []
      };
      await UsersCollection.insertOne(newUser);
      return {
        ...newUser,
        token,
      };
    } catch (e) {
      throw new Error(e);
    }
  },
  login: async (
    _: unknown,
    args: {
      username: string;
      password: string;
    }
  ): Promise<string> => {
    try {
      const user: UserSchema | undefined = await UsersCollection.findOne({
        username: args.username,
      });
      if (!user) {
        throw new Error("User does not exist");
      }
      const pass = user.password as string
      const validPassword = await bcrypt.compare(args.password, pass);
      if (!validPassword) {
        throw new Error("Invalid password");
      }
      const token = await createJWT(
        {
          username: user.username,
          email: user.email,
          name: user.name,
          surname: user.surname,
          id: user._id.toString(),
          admin : user.admin,
          cars : []
        },
        Deno.env.get("JWT_SECRET")!
      );
      return token;
    } catch (e) {
      throw new Error(e);
    }
  },
  createCar: async ( _: unknown,
    args: {
      plate : string,
      brand : string,
      seats : number,
      token : string
    }) : Promise<CarSchema> => {
      try{
       const Found = await carsCollection.findOne({plate : args.plate}) 

       if(args.plate === "" || args.brand === "" || args.seats === 0){
        throw new Error("FALTAN DATOS")
        }

       if(Found){
        throw new Error("YA EXISTE ESA MATRICULA")
       }else{
        
        const user: User = (await verifyJWT(
          args.token,
          Deno.env.get("JWT_SECRET")!
        )) as User;
        if(user.id === undefined){
          throw new Error("token invalido")
        }
        
        if(user.admin === false){
          throw new Error("no eres administrador")
        }

        const id = new ObjectId()

        const car : CarSchema = {
          _id : id,
          plate: args.plate,
          brand : args.brand,
          seats : args.seats,
          driver : new ObjectId(user.id)
        }
        await carsCollection.insertOne(car)
        //await UsersCollection.updateOne({_id : new ObjectId(user.id)}, {$push :{ cars: { $each: [id] } }})
        return car
       }
  }catch(e){
    throw new Error(e);
  }
    },
    deleteCar: async(_: unknown,
      args : {id : string, token : string}
    ) : Promise<CarSchema> =>{
      try{

        const user: User = (await verifyJWT(
          args.token,
          Deno.env.get("JWT_SECRET")!
        )) as User;
        if(user.id === undefined){
          throw new Error("token invalido")
        }
        
        if(user.admin === false){
          throw new Error("no eres administrador")
        }

          const ID = new ObjectId(args.id)
          const found = await carsCollection.findOne({_id : ID})
          if(!found){
             throw new Error("no existe")
          }
          
          //await UsersCollection.updateOne({_id : found.driver}, {$pull : {cars : ID}})
          await carsCollection.deleteOne({_id : ID})
          
          return found
      }catch(e){
        throw new Error(e);
      }
    },
    updateCar: async(_: unknown,
      args : {id : string, plate: string, brand: string, seats: number, token: string}
    ) : Promise<CarSchema> =>{
      try{
        const user: User = (await verifyJWT(
          args.token,
          Deno.env.get("JWT_SECRET")!
        )) as User;
        if(user.id === undefined){
          throw new Error("token invalido")
        }
        
        if(user.admin === false){
          throw new Error("no eres administrador")
        }

          const ID = new ObjectId(args.id)
          const found = await carsCollection.findOne({_id : ID})
          if(!found){
             throw new Error("no existe")
          }
          await carsCollection.updateOne({_id : ID}, {$set : {
            plate : args.plate,
            brand : args.brand,
            seats : args.seats
          }})
          
          return{
            _id : found._id,
            plate : args.plate,
            brand : args.brand,
            seats: args.seats,
            driver : found.driver
          }
      }catch(e){
        throw new Error(e);
      }
    },
}
