const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');
const dotenv = require('dotenv');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Success: Connected to MongoDB');
    } catch (error) {
        console.error(`❌ Error: Unable to connect to DB - ${error.message}`);
        process.exit(1);
    }
};

const startServer = async () => {
    const app = express();
    app.use(express.json());
    app.use(cors());

    const server = new ApolloServer({ typeDefs, resolvers });
    await server.start();
    server.applyMiddleware({ app });

    app.listen(process.env.PORT || 4000, async () => {
        await connectDB();
        console.log(`🚀 Server ready at http://localhost:${process.env.PORT || 4000}${server.graphqlPath}`);
    });
};

startServer();