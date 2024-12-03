import './App.css';
import { Outlet } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import Navbar from './components/Navbar.js';

// Initialize Apollo Client
const client = new ApolloClient({
  uri: '/graphql', // Replace with your Apollo Server's URL (e.g., 'http://localhost:3001/graphql')
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Navbar />
      <Outlet />
    </ApolloProvider>
  );
}

export default App;