// src/pages/FundraiserDetail.jsx
import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Form, Alert } from 'react-bootstrap';
import { usePaystackPayment } from 'react-paystack';
import { getFundraiser, initiatePayment } from '../services/api';
import { AppContext } from '../context/AppContext';

function FundraiserDetail() {
  const { id } = useParams();
  const { user } = useContext(AppContext);
  const [fundraiser, setFundraiser] = useState(null);
  const [donationData, setDonationData] = useState({
    amount: '',
    is_anonymous: false,
    in_memory_of: '',
    message: '',
    email: user?.user?.email || '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFundraiser = async () => {
      try {
        const response = await getFundraiser(id);
        setFundraiser(response.data);
      } catch (err) {
        setError('Failed to load fundraiser');
      }
    };
    fetchFundraiser();
  }, [id]);

  const config = {
    reference: new Date().getTime().toString(),
    email: donationData.email,
    amount: donationData.amount * 100, // Paystack expects kobo
    publicKey: 'pk_test_your_paystack_public_key', // Replace with PAYSTACK_TEST_PUBLIC_KEY
  };

  const onSuccess = () => {
    setSuccess('Payment successful! Thank you for your donation.');
    navigate('/thank-you?success=true');
  };

  const onClose = () => {
    setError('Payment cancelled.');
  };

  const initializePayment = usePaystackPayment(config);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDonationData({
      ...donationData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await initiatePayment({
        fundraiser_id: id,
        ...donationData,
      });
      if (response.data.status) {
        initializePayment(onSuccess, onClose);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('Payment initiation failed');
    }
  };

  if (!fundraiser) return <div>Loading...</div>;

  return (
    <Container>
      <h2>{fundraiser.title}</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Row>
        <Col md={8}>
          {fundraiser.photo && <img src={fundraiser.photo} alt={fundraiser.title} className="img-fluid mb-3" />}
          <p>{fundraiser.story}</p>
          <p>Raised: KSh {fundraiser.amount_raised} of KSh {fundraiser.goal_amount}</p>
          <p>Category: {fundraiser.category.name}</p>
          <p>Deadline: {fundraiser.urgency_deadline || 'N/A'}</p>
        </Col>
        <Col md={4}>
          <h3>Donate Now</h3>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Amount (KSh)</Form.Label>
              <Form.Control
                type="number"
                name="amount"
                value={donationData.amount}
                onChange={handleChange}
                required
                min="100"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={donationData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                name="is_anonymous"
                label="Donate Anonymously"
                checked={donationData.is_anonymous}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>In Memory Of</Form.Label>
              <Form.Control
                type="text"
                name="in_memory_of"
                value={donationData.in_memory_of}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                name="message"
                value={donationData.message}
                onChange={handleChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">Donate with Paystack</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default FundraiserDetail;