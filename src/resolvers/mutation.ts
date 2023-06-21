
import { ObjectId } from "mongo";
import { Car } from "../types.ts";
import { carsCollection } from "../db/dbconnection.ts";
import { CarSchema } from "../db/schema.ts";

export const Mutation = {
  createCar: async ( _: unknown,
    args: {
      plate : string,
      brand : string,
      seats : number
    }) : Promise<Car> => {
      try{
       const Found = await carsCollection.findOne({plate : args.plate}) 

       if(args.plate === "" || args.brand === "" || args.seats === 0){
        throw new Error("FALTAN DATOS")
        }

       if(Found){
        throw new Error("YA EXISTE ESA MATRICULA")
       }else{
        const id = new ObjectId()

        const car : CarSchema = {
          _id : id,
          plate: args.plate,
          brand : args.brand,
          seats : args.seats 
        }
        await carsCollection.insertOne(car)
        return {
          id : id.toString(),
          plate : args.plate,
          brand: args.brand,
          seats: args.seats
        }
       }
  }catch(e){
    throw new Error(e);
  }
    },
    deleteCar: async(_: unknown,
      args : {id : string}
    ) : Promise<Car> =>{
      try{
          const ID = new ObjectId(args.id)
          const found = await carsCollection.findOne({_id : ID})
          if(!found){
             throw new Error("no existe")
          }
          await carsCollection.deleteOne({_id : ID})
          
          return{
            id : found._id.toString(),
            plate : found.plate,
            brand : found.brand,
            seats: found.seats
          }
      }catch(e){
        throw new Error(e);
      }
    },
    updateCar: async(_: unknown,
      args : {id : string, plate: string, brand: string, seats: number}
    ) : Promise<Car> =>{
      try{
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
            id : found._id.toString(),
            plate : args.plate,
            brand : args.brand,
            seats: args.seats
          }
      }catch(e){
        throw new Error(e);
      }
    },
}
