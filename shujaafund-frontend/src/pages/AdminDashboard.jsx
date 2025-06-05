// src/pages/AdminDashboard.jsx
import { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getAdminDashboard } from '../services/api';
import { AppContext } from '../context/AppContext';

function AdminDashboard() {
  const { user, isAuthenticated } = useContext(AppContext);
  const [dashboardData, setDashboardData] = useState({ fundraisers: [], feedback: [], stats: {} });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  if (!isAuthenticated || !user?.is_admin) {
    navigate('/auth');
    return null;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAdminDashboard();
        setDashboardData(response.data);
      } catch (err) {
        setError('Failed to load admin dashboard');
      }
    };
    fetchData();
  }, []);

  return (
    <Container>
      <h2>Admin Dashboard</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <h3>Stats</h3>
      <Row>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Total Fundraisers</Card.Title>
              <Card.Text>{dashboardData.stats.total_fundraisers || 0}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Total Raised</Card.Title>
              <Card.Text>KSh {dashboardData.stats.total_raised || 0}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <h3>Fundraisers</h3>
      <Row>
        {dashboardData.fundraisers.map((fundraiser) => (
          <Col md={4} key={fundraiser.id} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{fundraiser.title}</Card.Title>
                <Card.Text>Verified: {fundraiser.is_verified ? 'Yes' : 'No'}</Card.Text>
                <Button as={Link} to={`/fundraiser/${fundraiser.id}`} variant="primary">
                  View
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <h3>Feedback</h3>
      <Row>
        {dashboardData.feedback.map((fb) => (
          <Col md={4} key={fb.id} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Text>{fb.message.slice(0, 100)}...</Card.Text>
                <Card.Text>User: {fb.user?.username || 'Anonymous'}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default AdminDashboard;