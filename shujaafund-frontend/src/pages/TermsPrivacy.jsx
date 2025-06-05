// src/pages/TermsPrivacy.jsx
import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { getTermsPrivacy } from '../services/api';

function TermsPrivacy() {
  const [data, setData] = useState({ terms: '', privacy: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTermsPrivacy();
        setData(response.data);
      } catch (err) {
        setError('Failed to load terms and privacy data');
      }
    };
    fetchData();
  }, []);

  return (
    <Container>
      <h2>Terms & Privacy</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <h3>Terms of Use</h3>
      <p>{data.terms}</p>
      <h3>Privacy Policy</h3>
      <p>{data.privacy}</p>
    </Container>
  );
}

export default TermsPrivacy;