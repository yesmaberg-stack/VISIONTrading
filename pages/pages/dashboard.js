import Link from 'next/link'

export default function Dashboard() {
  return (
    <div style={styles.container}>
      <h1>Dashboard</h1>

      <div style={styles.cards}>
        <Link href="/wallets" style={styles.card}>💼 Wallets</Link>
        <div style={styles.card}>📊 Trading (soon)</div>
        <div style={styles.card}>⚙️ Settings (soon)</div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#0b0b12',
    color: 'white',
    padding: 30
  },
  cards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: 20,
    marginTop: 30
  },
  card: {
    background: '#12121c',
    padding: 20,
    borderRadius: 10,
    textAlign: 'center',
    cursor: 'pointer',
    textDecoration: 'none',
    color: 'white'
  }
}
