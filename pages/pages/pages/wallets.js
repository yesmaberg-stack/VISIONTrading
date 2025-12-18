import Link from 'next/link'

export default function Wallets() {
  return (
    <div style={styles.container}>
      <h1>Wallets</h1>

      <div style={styles.wallet}>
        <p>Main Wallet</p>
        <strong>$0.00</strong>
      </div>

      <Link href="/dashboard" style={styles.back}>← Back to dashboard</Link>
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
  wallet: {
    background: '#12121c',
    padding: 20,
    borderRadius: 10,
    marginTop: 20
  },
  back: {
    display: 'inline-block',
    marginTop: 20,
    color: '#7f5af0',
    textDecoration: 'none'
  }
}
