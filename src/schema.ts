import { gql } from "graphql_tag";

export const typeDefs = gql`
  type Car {
    id: ID!
    plate: String!
    brand: String!
    seats: Int!
    driver : User!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    name: String!
    surname: String!
    token: String
    admin: Boolean!
    cars : [Car!]!
  }

  type Query {
    test : String!
    getCars(token : String!): [Car!]!
    getCar(id: ID!, token : String!): Car
    Me(token: String!): User!
  }

  type Mutation {

    register(
      username: String!
      email: String!
      password: String!
      name: String!
      surname: String!,
      admin : Boolean!
    ): User!
    login(username: String!, password: String!): String!

    createCar(plate: String!, brand: String!, seats: Int!, token: String!): Car!
    updateCar(id: ID!, plate: String!, brand: String!, seats: Int!, token: String!): Car!
    deleteCar(id: ID!, token: String!): Car!
  }
`;
