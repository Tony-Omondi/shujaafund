// src/pages/ThankYou.jsx
import { useLocation } from 'react-router-dom';
import { Container, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function ThankYou() {
  const location = useLocation();
  const success = new URLSearchParams(location.search).get('success') === 'true';

  return (
    <Container className="col-md-6 text-center">
      <h2>{success ? 'Thank You!' : 'Oops!'}</h2>
      {success ? (
        <Alert variant="success">
          Your donation was successful! We've sent a thank-you email.
        </Alert>
      ) : (
        <Alert variant="danger">
          Something went wrong with your donation. Please try again.
        </Alert>
      )}
      <Button as={Link} to="/" variant="primary">Back to Home</Button>
    </Container>
  );
}

export default ThankYou;