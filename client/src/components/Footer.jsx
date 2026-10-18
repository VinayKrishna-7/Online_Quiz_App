function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      padding: '1.25rem 0',
      marginTop: 'auto',
      backgroundColor: 'var(--bg-card)',
      textAlign: 'center',
      color: 'var(--text-muted)',
      fontSize: '0.875rem',
    }}>
      <div className="container">
        <p>
          <strong style={{ color: 'var(--text-main)' }}>QuizMaster</strong> — An interactive online quiz application
        </p>
      </div>
    </footer>
  );
}

export default Footer;
