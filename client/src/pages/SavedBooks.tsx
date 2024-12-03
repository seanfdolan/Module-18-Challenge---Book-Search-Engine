import { useState, useEffect } from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import { getMe, removeBook } from '../utils/API';
import { GET_ME } from '../utils/queries';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
import type { User } from '../models/User';
import { REMOVE_BOOK } from '../utils/mutations';


  const SavedBooks = () => {
    const { loading, error, data } = useQuery(GET_ME);
    useEffect(() => {
      if (data) {
        setUserData(data.me);
      }
    }, [data]);
    const [userData, setUserData] = useState<User | null>(null);
  
    useEffect(() => {
      if (data) {
        setUserData(data.me);
      }
    }, [data]);
    
    // The useQuery hook automatically executes when the component mounts and will re-fetch data when necessary, making the useEffect hook unnecessary in this case.

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId: string) => {
      const token = Auth.loggedIn() ? Auth.getToken() : null;
      const [removeBook] = useMutation(REMOVE_BOOK, {
        refetchQueries: [{ query: GET_ME }],
      });

      if (!token) {
        return false;
      }

      try {
        await removeBook({
          variables: { bookId },
        });

        removeBookId(bookId);
      } catch (err) {
              console.error(err);
            }
        };

  
  // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  }
  if (error) {
    console.error(error);
    return <h2>Something went wrong!</h2>;
  }

  return (
    <>
      <div className='text-light bg-dark p-5'>
        <Container>
          {userData?.username ? (
            <h1>Viewing {userData.username}'s saved books!</h1>
          ) : (
            <h1>Viewing saved books!</h1>
          )}
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData?.savedBooks?.length
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? 'book' : 'books'
              }:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData?.savedBooks?.map((book: { bookId: string; image?: string; title: string; authors: string[]; description: string }) => {
            return (
              <Col md='4'>
                <Card key={book.bookId} border='dark'>
                  {book.image ? (
                    <Card.Img
                      src={book.image}
                      alt={`The cover for ${book.title}`}
                      variant='top'
                    />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button
                      className='btn-block btn-danger'
                      onClick={() => handleDeleteBook(book.bookId)}
                    >
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
