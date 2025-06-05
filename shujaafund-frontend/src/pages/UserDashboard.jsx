// src/pages/UserDashboard.jsx
import { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { getUserDashboard } from '../services/api';
import { AppContext } from '../context/AppContext';

function UserDashboard() {
  const { isAuthenticated } = useContext(AppContext);
  const [dashboardData, setDashboardData] = useState({ fundraisers: [], donations: [] });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  if (!isAuthenticated) {
    navigate('/auth');
    return null;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getUserDashboard();
        setDashboardData(response.data);
      } catch (err) {
        setError('Failed to load dashboard');
      }
    };
    fetchData();
  }, []);

  return (
    <Container>
      <h2>Your Dashboard</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <h3>Your Fundraisers</h3>
      <Row>
        {dashboardData.fundraisers.map((fundraiser) => (
          <Col md={4} key={fundraiser.id} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{fundraiser.title}</Card.Title>
                <Card.Text>Raised: KSh {fundraiser.amount_raised} / {fundraiser.goal_amount}</Card.Text>
                <Button as={Link} to={`/fundraiser/${fundraiser.id}`} variant="primary">
                  View
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <h3>Your Donations</h3>
      <Row>
        {dashboardData.donations.map((donation) => (
          <Col md={4} key={donation.id} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Text>Amount: KSh {donation.amount}</Card.Text>
                <Card.Text>Fundraiser: {donation.fundraiser.title}</Card.Text>
                <Card.Text>Date: {new Date(donation.created_at).toLocaleDateString()}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default UserDashboard;