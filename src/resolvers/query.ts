
import { ObjectId } from "mongo";
import { Car, User } from "../types.ts";
import { UsersCollection, carsCollection } from "../db/dbconnection.ts";
import { CarSchema } from "../db/schema.ts";
import { calculateObjectSize } from "https://deno.land/x/web_bson@v0.2.5/mod.ts";
import { verifyJWT } from "../libs/jwt.ts";

export const Query = {
  test:  () => {
    try {
      return "ole"
    } catch (e) {
      throw new Error(e);
    }
  },
  getCars : async (_:unknown, args:{ token : string }) : Promise<Car[]> =>{
    try {
      const user: User = (await verifyJWT(
        args.token,
        Deno.env.get("JWT_SECRET")!
      )) as User;
      if(user.id === undefined){
        throw new Error("token invalido")
      }
        const coches = await carsCollection.find({}).toArray()
        if(coches){
        const COCHES : Car[] = coches.map((car)=>({
          id : car._id.toString(),
          plate : car.plate,
          brand : car.brand,
          seats : car.seats,
          driver : user
        }))
        return COCHES
        }
        return []
    } catch (e) {
      throw new Error(e);
    }
  },
  getCar: async (_:unknown, args:{id : string, token: string}) : Promise<Car> => {
    try{

      const user: User = (await verifyJWT(
        args.token,
        Deno.env.get("JWT_SECRET")!
      )) as User;
      if(user.id === undefined){
        throw new Error("token invalido")
      }
      
      const found = await carsCollection.findOne({_id : new ObjectId(args.id)})
      if (found){
        return{
          id : found._id.toString(),
          plate : found.plate,
          brand: found.brand,
          seats : found.seats,
          driver : user
        }
      }else{
        throw new Error("no existe")
      }

    }catch(e){
      throw new Error(e)
    }
  },
  Me: async (_: unknown, args: { token: string }) :Promise<User> => {
    try {
      const user: User = (await verifyJWT(
        args.token,
        Deno.env.get("JWT_SECRET")!
      )) as User;
      return user;
    } catch (e) {
      throw new Error(e);
    }
  },
  
};