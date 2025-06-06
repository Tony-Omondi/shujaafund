import { useState, useEffect, useContext } from 'react';
import { Card, Row, Col, Spinner, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getHomeData } from '../services/api';
import { AppContext } from '../context/AppContext';

function Home() {
  const { user, loading: userLoading } = useContext(AppContext);
  const [fundraisers, setFundraisers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const { data } = await getHomeData();
        setFundraisers(data.featured_fundraisers || []);
      } catch (error) {
        toast.error('Failed to load featured fundraisers');
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  if (loading || userLoading) return <Spinner animation="border" className="d-block mx-auto mt-5" />;

  return (
    <div>
      <h1 className="text-center mb-4">Welcome to ShujaaFund</h1>
      <p className="text-center mb-5">
        Empowering Kenyans to support each other in times of need.
      </p>
      {user && (
        <div className="text-center mb-4">
          <Button as={Link} to="/create" variant="primary">
            Start a Fundraiser
          </Button>
        </div>
      )}
      <h2 className="mb-4">Featured Fundraisers</h2>
      {fundraisers.length === 0 ? (
        <p className="text-center">No featured fundraisers yet.</p>
      ) : (
        <Row>
          {fundraisers.map((fundraiser) => (
            <Col key={fundraiser.id} sm={12} md={6} lg={4} className="mb-4">
              <Card>
                <Card.Img
                  variant="top"
                  src={fundraiser.photo || 'https://via.placeholder.com/400x200'}
                  alt={fundraiser.title}
                />
                <Card.Body>
                  <Card.Title>{fundraiser.title}</Card.Title>
                  <Card.Text>
                    {fundraiser.story.substring(0, 100)}...
                  </Card.Text>
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
    </div>
  );
}

export default Home;