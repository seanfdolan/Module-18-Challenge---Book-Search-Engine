// import express from 'express';
// import db from './config/connection.js';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// // Import the ApolloServer class
// import { ApolloServer } from '@apollo/server';
// import { expressMiddleware } from '@apollo/server/express4';
// import path from 'node:path';
// // Import the two parts of a GraphQL schema
// import { typeDefs, resolvers } from './schemas/index.js';
// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
// });
// // Create a new instance of an Apollo server with the GraphQL schema
// const startApolloServer = async () => {
//   await server.start();
//   await db;
//   const PORT = process.env.PORT || 3001;
//   const app = express();
//   app.use(express.urlencoded({ extended: false }));
//   app.use(express.json());
//    if (process.env.NODE_ENV === 'production') {
//     app.use(express.static(path.join(__dirname, '../client/dist')));
//     app.get('*', (_req, res) => {
//       res.sendFile(path.join(__dirname, '../client/dist/index.html'));
//     });
//   }
//   app.use('/graphql', expressMiddleware(server));
//   app.listen(PORT, () => {
//     console.log(`API server running on port ${PORT}!`);
//     console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
//   });
// };
// // Call the async function to start the server
// startApolloServer();
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import path from 'path';
import { typeDefs, resolvers } from './schemas/index.js';
import db from './config/connection.js';
import routes from './routes/index.js';
const PORT = process.env.PORT || 3001;
const app = express();
const server = new ApolloServer({
    typeDefs,
    resolvers,
});
const startApolloServer = () => __awaiter(void 0, void 0, void 0, function* () {
    yield server.start();
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use('/graphql', expressMiddleware(server));
    app.use(routes);
    // if we're in production, serve client/dist as static assets
    if (process.env.NODE_ENV === 'production') {
        app.use(express.static(path.join(__dirname, '../client/dist')));
        app.get('*', (_req, res) => {
            res.sendFile(path.join(__dirname, '../client/dist/index.html'));
        });
    }
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    app.listen(PORT, () => {
        console.log(`API server running on port ${PORT}!`);
        console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
});
db.once('open', () => {
    app.listen(PORT, () => console.log(`Now listening on localhost: ${PORT}`));
});
startApolloServer();