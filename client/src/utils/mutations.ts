import { gql } from '@apollo/client';

// Define the LOGIN_USER mutation
export const LOGIN_USER = gql`
  mutation loginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      token  
      user {
        _id
        username
        # name
        # email
        # Add other user fields if necessary
      }
    }
  }
`;

// Define the ADD_USER mutation
export const ADD_USER = gql`
  # mutation addUser($username: String!, $email: String!, $password: String!) {
  #   addUser(username: $username, email: $email, password: $password) {
  mutation addUser($input: UserInput!) {
    addUser(input: $input) {
      token
      user {
        _id
        username
      }
        # name
        # email
        # Add other user fields if necessary
      }
    }
`;

// Define the SAVE_BOOK mutation
export const SAVE_BOOK = gql`
  # mutation saveBook($author: String!, $description: String!, $title: String!, $bookId: String!, $image: String!, $link: String!) {  // $book: BookInput!
  mutation saveBook($input: BookInput!) {
    saveBook(book: $book) {
      bookId
      title
      authors
      description
      image
      link
      # _id        
      # username
      # email
      # bookCount
      # savedBooks {
      #   bookId
      #   title
      #   description
      #   authors
      #   image
      #   link  
      # }   
      # Add other user fields if necessary
    }
  }
`;

// Define the REMOVE_BOOK mutation
export const REMOVE_BOOK = gql`
  mutation removeBook($bookId: ID!) {  
    removeBook(bookId: $bookId) {
      bookId
      title
      authors
      description
      image
      link
      # _id
      # username
      # email
      # bookCount
      # savedBooks {
      #   bookId
      #   title
      #   description
      #   authors
      #   image
      #   link
      #       }
      # Add other user fields if necessary
    }
  }
`;
