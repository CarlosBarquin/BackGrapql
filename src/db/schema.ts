import { ObjectId } from "https://deno.land/x/web_bson@v0.2.5/mod.ts";
import { Car } from "../types.ts";

export type CarSchema = Omit<Car, "id"> & {
  _id : ObjectId
}