import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Card, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { createFundraiser, getCategories } from '../services/api';
import { AppContext } from '../context/AppContext';

function CreateFundraiser() {
  const { user, loading: userLoading } = useContext(AppContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    story: '',
    goal_amount: '',
    urgency_deadline: '',
    photo: null,
    category: '',
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userLoading && !user) {
      toast.error('Please login to create a fundraiser');
      navigate('/auth');
    }
    const fetchCategories = async () => {
      try {
        const { data } = await getCategories();
        setCategories(data);
      } catch (error) {
        toast.error('Failed to load categories');
      }
    };
    fetchCategories();
  }, [user, userLoading, navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = new FormData();
      payload.append('title', formData.title);
      payload.append('story', formData.story);
      payload.append('goal_amount', formData.goal_amount);
      payload.append('urgency_deadline', formData.urgency_deadline);
      payload.append('category', formData.category);
      if (formData.photo) payload.append('photo', formData.photo);

      const { data } = await createFundraiser(payload);
      toast.success('Fundraiser created successfully!');
      navigate(`/fundraiser/${data.id}`);
    } catch (error) {
      toast.error('Failed to create fundraiser: ' + (error.response?.data?.error || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  if (userLoading) return <Spinner animation="border" className="d-block mx-auto" />;

  return (
    <Card className="mx-auto" style={{ maxWidth: '600px' }}>
      <Card.Body>
        <h2 className="text-center mb-4">Create Fundraiser</h2>
        {categories.length === 0 ? (
          <Spinner animation="border" className="d-block mx-auto" />
        ) : (
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                maxLength={200}
                placeholder="e.g., Help Tony's Medical Bills"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Story</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                name="story"
                value={formData.story}
                onChange={handleChange}
                required
                placeholder="Share your story..."
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
                min="1000"
                step="0.01"
                placeholder="e.g., 50000"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Urgency Deadline</Form.Label>
              <Form.Control
                type="datetime-local"
                name="urgency_deadline"
                value={formData.urgency_deadline}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Photo (Optional)</Form.Label>
              <Form.Control
                type="file"
                name="photo"
                onChange={handleChange}
                accept="image/*"
              />
            </Form.Group>
            <Button type="submit" variant="primary" disabled={loading} className="w-100">
              {loading ? 'Creating...' : 'Create Fundraiser'}
            </Button>
          </Form>
        )}
      </Card.Body>
    </Card>
  );
}

export default CreateFundraiser;