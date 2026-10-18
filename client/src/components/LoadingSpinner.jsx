function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '260px',
      padding: '2rem',
    }}>
      <div style={{
        width: '42px',
        height: '42px',
        border: '3px solid var(--border)',
        borderTopColor: 'var(--primary)',
        borderRadius: '50%',
        animation: 'spin 0.75s linear infinite',
      }} />
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.9375rem', fontWeight: 500 }}>
        {message}
      </p>
    </div>
  );
}

export default LoadingSpinner;
