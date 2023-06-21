import { ObjectId } from "https://deno.land/x/web_bson@v0.2.5/mod.ts";
import { Car, User } from "../types.ts";

export type CarSchema = Omit<Car, "id"> & {
  _id : ObjectId
}


export type UserSchema = Omit<User, "id" | "token"> & {
  _id: ObjectId;
};