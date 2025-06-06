// src/pages/About.jsx
import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { getAbout } from '../services/api';

function About() {
  const [data, setData] = useState({ mission: '', faq: [] });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAboutData();
        setData(response.data);
      } catch (err) {
        setError('Failed to load about data');
      }
    };
    fetchData();
  }, []);

  return (
    <Container>
      <h2>About ShujaaFund</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <p>{data.mission}</p>
      <h3>FAQ</h3>
      {data.faq.map((item, index) => (
        <div key={index} className="mb-3">
          <h5>{item.q}</h5>
          <p>{item.a}</p>
        </div>
      ))}
    </Container>
  );
}

export default About;