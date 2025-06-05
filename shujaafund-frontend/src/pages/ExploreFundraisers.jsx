// src/pages/ExploreFundraisers.jsx
import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { exploreFundraisers } from '../services/api';

function ExploreFundraisers() {
  const [fundraisers, setFundraisers] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFundraisers = async () => {
      try {
        const response = await exploreFundraisers({ search });
        setFundraisers(response.data);
      } catch (err) {
        setError('Failed to load fundraisers');
      }
    };
    fetchFundraisers();
  }, [search]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  return (
    <Container>
      <h2>Explore Fundraisers</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search fundraisers..."
          value={search}
          onChange={handleSearch}
        />
      </Form.Group>
      <Row>
        {fundraisers.map((fundraiser) => (
          <Col md={4} key={fundraiser.id} className="mb-4">
            <Card>
              {fundraiser.photo && <Card.Img variant="top" src={fundraiser.photo} />}
              <Card.Body>
                <Card.Title>{fundraiser.title}</Card.Title>
                <Card.Text>{fundraiser.story.slice(0, 100)}...</Card.Text>
                <Card.Text>Raised: KSh {fundraiser.amount_raised} / {fundraiser.goal_amount}</Card.Text>
                <Button as={Link} to={`/fundraiser/${fundraiser.id}`} variant="primary">
                  View Details
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default ExploreFundraisers;