// src/components/Footer.jsx
import { Container } from 'react-bootstrap';

function Footer() {
  return (
    <footer className="bg-dark text-white py-3 mt-5">
      <Container className="text-center">
        <p>&copy; 2025 ShujaaFund. All rights reserved.</p>
        <p>
          <a href="/about" className="text-white mx-2">About</a> |
          <a href="/terms-privacy" className="text-white mx-2">Terms & Privacy</a>
        </p>
      </Container>
    </footer>
  );
}

export default Footer;