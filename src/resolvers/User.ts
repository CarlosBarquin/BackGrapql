
import { ObjectId } from "mongo";
import { Car, User } from "../types.ts";
import { UsersCollection, carsCollection } from "../db/dbconnection.ts";
import { CarSchema, UserSchema } from "../db/schema.ts";
import { calculateObjectSize } from "https://deno.land/x/web_bson@v0.2.5/mod.ts";
import { verifyJWT } from "../libs/jwt.ts";


const UserResolver = {
    id : (parent : UserSchema | User) =>{
        const p = parent as UserSchema
         return p._id.toString()

    },
    cars : async (parent : UserSchema | User) =>{
        const p = parent as UserSchema
        const cars = await carsCollection.find({driver : p._id}).toArray()
        
        return cars
    }
}

export default UserResolver