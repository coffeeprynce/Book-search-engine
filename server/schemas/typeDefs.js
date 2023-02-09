const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    bookCount: Number!
    savedBooks: [Book]
  }

  type Book {
    bookId: ID!
    authors: [String]
    description: String!
    title: String!
    image: String!
    link: String!

  }

  type Auth {
    token: ID!
    user: User
  }

  input Bookinput
  {
    bookId: String!
    authors: [String]
    description: String!
    title: String!
    image: String!
    link: String!

  }
  type Query {
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    createUser(email: String!, password: String!): Auth
    saveBook(bookdata: Bookinput): User
    deleteBook(bookId: ID!): User
  }
`;

module.exports = typeDefs;