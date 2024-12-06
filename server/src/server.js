import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import path from 'path';
import { typeDefs, resolvers } from './schemas/index.js';
import db from './config/connection.js';
import routes from './routes/index.js';
import { authenticateToken } from './services/auth.js';
const PORT = process.env.PORT || 3009;
const app = express();
const server = new ApolloServer({
    typeDefs,
    resolvers,
});
const startApolloServer = async () => {
    await server.start();
    await db();
    const PORT = process.env.PORT || 3001;
    const app = express();
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use('/graphql', expressMiddleware(server, {
        context: authenticateToken
    }));
    app.use(routes);
    // if we're in production, serve client/dist as static assets
    if (process.env.NODE_ENV === 'production') {
        app.use(express.static(path.join(__dirname, '../client/dist')));
        app.get('*', (_req, res) => {
            res.sendFile(path.join(__dirname, '../client/dist/index.html'));
        });
    }
    // db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    app.listen(PORT, () => {
        console.log(`API server running on port ${PORT}!`);
        console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
};
// db.once('open', () => {
//   app.listen(PORT, () => console.log(`Now listening on localhost: ${PORT}`));
// });
startApolloServer();
//# sourceMappingURL=server.js.map