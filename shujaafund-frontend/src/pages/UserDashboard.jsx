import { useState, useEffect, useContext } from 'react';
import { Card, Row, Col, Spinner, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getDashboard } from '../services/api';
import { AppContext } from '../context/AppContext';

function UserDashboard() {
  const { user, loading: userLoading } = useContext(AppContext);
  const navigate = useNavigate();
  const [data, setData] = useState({ fundraisers: [], donations: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userLoading && !user) {
      toast.error('Please login to view your dashboard');
      navigate('/auth');
    }
    if (user) {
      const fetchDashboard = async () => {
        try {
          const { data } = await getDashboard();
          setData(data);
        } catch (error) {
          toast.error('Failed to load dashboard');
        } finally {
          setLoading(false);
        }
      };
      fetchDashboard();
    }
  }, [user, userLoading, navigate]);

  if (loading || userLoading) return <Spinner animation="border" className="d-block mx-auto mt-5" />;

  return (
    <div>
      <h1 className="text-center mb-4">Your Dashboard</h1>
      <div className="text-center mb-4">
        <Button as={Link} to="/create" variant="primary">
          Start a New Fundraiser
        </Button>
      </div>
      <h2 className="mb-3">Your Fundraisers</h2>
      {data.fundraisers.length === 0 ? (
        <p className="text-center">You haven’t created any fundraisers yet.</p>
      ) : (
        <Row>
          {data.fundraisers.map((fundraiser) => (
            <Col key={fundraiser.id} sm={12} md={6} lg={4} className="mb-4">
              <Card>
                <Card.Img
                  variant="top"
                  src={fundraiser.photo || 'https://via.placeholder.com/400x200'}
                  alt={fundraiser.title}
                />
                <Card.Body>
                  <Card.Title>{fundraiser.title}</Card.Title>
                  <p>
                    <strong>Raised:</strong> KSh {fundraiser.amount_raised} of KSh {fundraiser.goal_amount}
                  </p>
                  <Button as={Link} to={`/fundraiser/${fundraiser.id}`} variant="outline-primary">
                    View Fundraiser
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
      <h2 className="mb-3 mt-5">Your Donations</h2>
      {data.donations.length === 0 ? (
        <p className="text-center">You haven’t made any donations yet.</p>
      ) : (
        <Row>
          {data.donations.map((donation) => (
            <Col key={donation.id} sm={12} md={6} lg={4} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>Donation to {donation.fundraiser.title}</Card.Title>
                  <p>
                    <strong>Amount:</strong> KSh {donation.amount}
                  </p>
                  <p>
                    <strong>Anonymous:</strong> {donation.is_anonymous ? 'Yes' : 'No'}
                  </p>
                  {donation.message && <p><strong>Message:</strong> {donation.message}</p>}
                  <Button as={Link} to={`/fundraiser/${donation.fundraiser.id}`} variant="outline-primary">
                    View Fundraiser
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default UserDashboard;