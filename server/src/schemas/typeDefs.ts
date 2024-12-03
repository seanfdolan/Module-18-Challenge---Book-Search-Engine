const typeDefs = `#graphql
  type Query {
    me: User
    users: [User]
    user(username: String!): User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(
      author: String!
      description: String!
      title: String!
      bookId: String!
      image: String!
      link: String!
    ): User
    removeBook(bookId: String!): User
  }

  type User {
    _id: ID
    id: ID
    name: String
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
  }

  type Book {
    bookId: String
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }

  type Auth {
    token: ID!
    user: User
  }
`;

export default typeDefs;
