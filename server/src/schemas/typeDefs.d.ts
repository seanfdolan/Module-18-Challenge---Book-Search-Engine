declare const typeDefs = "#graphql\n  type Query {\n    me: User\n  }\n\n  type Mutation {\n    login(email: String!, password: String!): Auth\n    addUser(username: String!, email: String!, password: String!): Auth\n    saveBook(\n      authors: [String]     \n      description: String!\n      title: String!\n      bookId: String!\n      image: String!\n      link: String!\n    ): User\n    removeBook(bookId: String!): User\n  }\n\n  type User {\n    _id: ID\n    username: String\n    email: String\n    bookCount: Int\n    savedBooks: [Book]\n  }\n\n  type Book {\n    bookId: String\n    authors: [String]\n    description: String\n    title: String\n    image: String\n    link: String\n  }\n\n  type Auth {\n    token: ID!\n    user: User\n  }\n";
export default typeDefs;
//# sourceMappingURL=typeDefs.d.ts.map