// Step 18: Modify App.js to include Apollo provider
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Step 19: add apollo dependencies
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink
} from "@apollo/client"
import { setContext } from "@apollo/client/link/context";

import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';

// Step 20: Construct our main GraphQL API endpoint
const httpLink = createHttpLink({
  uri: '/graphql',
});

// Step 21: Construct request middleware that will attach the JWT token to every request as an `authorization` header
const authLink = setContext((_, { headers }) => {
  //get the authentication token from local storage if it exists
  const token = localStorage.getItem("id_token");
  //return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  };
});

// Step 22: create apollo client
const client = new ApolloClient({
  //set up our client to execute the `authLink` middleware prior to making the request to our GraphQL API
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

// Step 23: modify App() - add ApolloProvider tag/wrapper
function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <>
          <Navbar />
          <Routes>
            <Route exact path='/' element={<SearchBooks />} />
            <Route exact path='/saved' element={<SavedBooks />} />
            <Route render={() => <h1 className='display-2'>Wrong page!</h1>} />
          </Routes>
        </>
      </Router>
    </ApolloProvider>
  );
}

export default App;

// Step 24: modify utils folder - add mutations.js and queries.js and remove API.js