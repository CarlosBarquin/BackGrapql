
import { ObjectId } from "mongo";
import { Car, User } from "../types.ts";
import { UsersCollection, carsCollection } from "../db/dbconnection.ts";
import { CarSchema, UserSchema } from "../db/schema.ts";
import { calculateObjectSize } from "https://deno.land/x/web_bson@v0.2.5/mod.ts";
import { verifyJWT } from "../libs/jwt.ts";

const UserResolver = {
    cars : async (parent: UserSchema | User) =>{
        try{
            const p = parent as UserSchema
            const coches = await carsCollection.find({driver : p._id}).toArray()
            if(coches){
                const COCHES : Car[] = coches.map((car)=>({
                    id : car._id.toString(),
                    plate : car.plate,
                    brand : car.brand,
                    seats : car.seats,
                    driver : parent as User
                }))
                return COCHES
            }
            return []

        }catch(e){
            throw new Error(e);
            
        }
    }
}

export default UserResolver