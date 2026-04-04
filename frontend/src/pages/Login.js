import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.username);
      localStorage.setItem('userId', res.data.userId);// line add 
      navigate('/dashboard');
    } catch (err) {
      alert('Login failed! Check email and password');
    }
    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.brand}>
          <div style={styles.brandIcon}>S</div>
          <h2 style={styles.brandName}>SocialApp</h2>
          <p style={styles.brandSub}>Welcome back!</p>
        </div>
        <div style={styles.field}>
          <label style={styles.label}>EMAIL ADDRESS</label>
          <input style={styles.input} type="email" placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>PASSWORD</label>
          <input style={styles.input} type="password" placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button style={styles.btn} onClick={handleLogin} disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <p style={styles.linkText}>
          Don't have account?{' '}
          <span style={styles.link} onClick={() => navigate('/signup')}>Sign up</span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#1a1a2e', display: 'flex',
    alignItems: 'center', justifyContent: 'center' },
  card: { background: '#fff', borderRadius: '16px', padding: '36px 32px',
    width: '100%', maxWidth: '400px' },
  brand: { textAlign: 'center', marginBottom: '28px' },
  brandIcon: { width: '52px', height: '52px', background: '#6c63ff',
    borderRadius: '14px', display: 'flex', alignItems: 'center',
    justifyContent: 'center', margin: '0 auto 12px', fontSize: '24px',
    color: 'white', fontWeight: '600' },
  brandName: { fontSize: '22px', fontWeight: '600', color: '#1a1a2e', margin: '0 0 4px' },
  brandSub: { fontSize: '14px', color: '#888', margin: 0 },
  field: { marginBottom: '16px' },
  label: { fontSize: '11px', fontWeight: '600', color: '#666',
    letterSpacing: '0.8px', display: 'block', marginBottom: '6px' },
  input: { width: '100%', padding: '12px 14px', border: '1.5px solid #e8e8f0',
    borderRadius: '10px', fontSize: '14px', color: '#333',
    background: '#f7f7fb', outline: 'none', boxSizing: 'border-box' },
  btn: { width: '100%', padding: '13px', background: '#6c63ff', color: 'white',
    border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600',
    cursor: 'pointer', marginTop: '8px' },
  linkText: { textAlign: 'center', fontSize: '13px', color: '#888', marginTop: '20px' },
  link: { color: '#6c63ff', cursor: 'pointer', fontWeight: '500' },
};