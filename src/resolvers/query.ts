
import { ObjectId } from "mongo";
import { Car } from "../types.ts";
import { carsCollection } from "../db/dbconnection.ts";
import { CarSchema } from "../db/schema.ts";

export const Query = {
  test:  () => {
    try {
      return "ole"
    } catch (e) {
      throw new Error(e);
    }
  },
  getCars : async () : Promise<Car[]> =>{
    try {
        const coches = await carsCollection.find({}).toArray()
        if(coches){
        const COCHES : Car[] = coches.map((car)=>({...car, id : car._id.toString()}))
        return COCHES
        }
        return []
    } catch (e) {
      throw new Error(e);
    }
  },
  getCar: async (_:unknown, args:{id : string}) : Promise<Car> => {
    try{
      const found = await carsCollection.findOne({_id : new ObjectId(args.id)})
      if (found){
        return{
          id : found._id.toString(),
          plate : found.plate,
          brand: found.brand,
          seats : found.seats
        }
      }else{
        throw new Error("no existe")
      }

    }catch(e){
      throw new Error(e)
    }
  }
  
};