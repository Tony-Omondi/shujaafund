// src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getHomeData } from '../services/api';

function Home() {
  const [fundraisers, setFundraisers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getHomeData();
        setFundraisers(response.data.featured_fundraisers);
      } catch (err) {
        setError('Failed to load featured fundraisers');
      }
    };
    fetchData();
  }, []);

  return (
    <Container>
      <h1>Welcome to ShujaaFund</h1>
      <p>Support Kenyans in need through emergency fundraising.</p>
      {error && <div className="alert alert-danger">{error}</div>}
      <h2>Featured Fundraisers</h2>
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
                  Donate Now
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Home;