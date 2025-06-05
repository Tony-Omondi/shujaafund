// src/pages/SignUpLogin.jsx
import { useState, useContext } from 'react';
import { Container, Row, Col, Form, Button, Alert, Tabs, Tab } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { register, login } from '../services/api';
import { AppContext } from '../context/AppContext';

function SignUpLogin() {
  const [signUpData, setSignUpData] = useState({
    username: '', email: '', password: '', phone_number: '',
  });
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { login: loginUser } = useContext(AppContext);
  const navigate = useNavigate();

  const handleSignUpChange = (e) => {
    setSignUpData({ ...signUpData, [e.target.name]: e.target.value });
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await register(signUpData);
      setSuccess(response.data.message);
      setTimeout(() => navigate('/auth'), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(loginData);
      loginUser(response.data.user, response.data.access, response.data.refresh);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <Container className="col-md-6">
      <h2>Sign Up or Login</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Tabs defaultActiveKey="login" className="mb-3">
        <Tab eventKey="login" title="Login">
          <Form onSubmit={handleLoginSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={loginData.username}
                onChange={handleLoginChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={loginData.password}
                onChange={handleLoginChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">Login</Button>
            <a href="/auth/google" className="btn btn-outline-primary ms-2">Login with Google</a>
          </Form>
        </Tab>
        <Tab eventKey="signup" title="Sign Up">
          <Form onSubmit={handleSignUpSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={signUpData.username}
                onChange={handleSignUpChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={signUpData.email}
                onChange={handleSignUpChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={signUpData.password}
                onChange={handleSignUpChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                name="phone_number"
                value={signUpData.phone_number}
                onChange={handleSignUpChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">Sign Up</Button>
          </Form>
        </Tab>
      </Tabs>
    </Container>
  );
}

export default SignUpLogin;