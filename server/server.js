const express = require('express');

// Step 1: modify server.js to use Apollo Server
const { ApolloServer } = require("apollo-server-express");

const path = require('path');
const { authMiddleware } = require('./utils/auth');

// Step 2: require your type defs and resolvers from the schemas folder
const { typeDefs, resolvers } = require("./schemas");

const db = require('./config/connection');

// Step 3: these routes will be replaced with the typeDefs and resolvers
//const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;

// Step 4: create your server from the ApolloServer class
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
});

// Step 5: apply middleware to app
server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// Step 6: these routes used will be replaced with the ApolloServer
//app.use(routes);

// Step 7: Modify this listener to include graphql url -- not important
db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});

// Step 8: Create schemas folder