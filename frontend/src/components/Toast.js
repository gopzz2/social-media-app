import { useEffect } from 'react';

export default function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    success: { bg: '#e8f5e9', color: '#2e7d32', border: '#a5d6a7' },
    error:   { bg: '#fce4ec', color: '#c62828', border: '#ef9a9a' },
    info:    { bg: '#e3f2fd', color: '#1565c0', border: '#90caf9' },
  };

  const c = colors[type] || colors.info;

  return (
    <div style={{
      position: 'fixed', top: '20px', right: '20px', zIndex: 9999,
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
      borderRadius: '10px', padding: '14px 20px', fontSize: '14px',
      fontWeight: '500', minWidth: '260px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}>
      {type === 'success' ? '✓ ' : type === 'error' ? '✗ ' : 'ℹ '}{message}
    </div>
  );
}