// src/pages/CreateFundraiser.jsx
import { useState, useContext } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { createFundraiser } from '../services/api';
import { AppContext } from '../context/AppContext';

function CreateFundraiser() {
  const { isAuthenticated } = useContext(AppContext);
  const [formData, setFormData] = useState({
    title: '',
    story: '',
    goal_amount: '',
    category: { name: 'Emergency', slug: 'emergency' },
    urgency_deadline: '',
    photo: null,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  if (!isAuthenticated) {
    navigate('/auth');
    return null;
  }

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === 'category') {
        form.append('category[name]', formData.category.name);
        form.append('category[slug]', formData.category.slug);
      } else if (formData[key]) {
        form.append(key, formData[key]);
      }
    });

    try {
      const response = await createFundraiser(form);
      setSuccess('Fundraiser created successfully!');
      navigate(`/fundraiser/${response.data.id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create fundraiser');
    }
  };

  return (
    <Container className="col-md-8">
      <h2>Create a Fundraiser</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Story</Form.Label>
          <Form.Control
            as="textarea"
            name="story"
            value={formData.story}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Goal Amount (KSh)</Form.Label>
          <Form.Control
            type="number"
            name="goal_amount"
            value={formData.goal_amount}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Urgency Deadline</Form.Label>
          <Form.Control
            type="date"
            name="urgency_deadline"
            value={formData.urgency_deadline}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Photo</Form.Label>
          <Form.Control
            type="file"
            name="photo"
            onChange={handleChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit">Create Fundraiser</Button>
      </Form>
    </Container>
  );
}

export default CreateFundraiser;