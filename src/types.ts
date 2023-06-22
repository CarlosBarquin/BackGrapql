export type Car = {
  id: string;
  brand: string;
  plate: string;
  seats: number;
  driver : User
};
export type User = {
  id: string;
  username: string;
  email: string;
  password?: string;
  name: string;
  surname: string;
  token?: string;
  admin: boolean;
  cars : Car[]
};