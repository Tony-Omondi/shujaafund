// src/components/Header.jsx
import { useContext } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

function Header() {
  const { user, isAuthenticated, logout } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">ShujaaFund</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/explore">Explore</Nav.Link>
            <Nav.Link as={Link} to="/about">About</Nav.Link>
            {isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                {user?.is_admin && <Nav.Link as={Link} to="/admin">Admin</Nav.Link>}
                <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <Nav.Link as={Link} to="/auth">Login/Sign Up</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;