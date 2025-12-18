import { useState } from 'react'
import Link from 'next/link'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Auth logic will be connected next')
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>VISIONTrading</h1>
        <p style={styles.subtitle}>Sign in to your account</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={styles.input}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={styles.input}
            required
          />

          <button type="submit" style={styles.button}>
            Sign In
          </button>
        </form>

        <p style={styles.small}>
          Don’t have an account?{' '}
          <Link href="/register">Create one</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#0b0b12',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    fontFamily: 'Arial'
  },
  card: {
    width: 340,
    background: '#12121a',
    padding: 30,
    borderRadius: 10,
    boxShadow: '0 0 20px rgba(0,0,0,0.5)'
  },
  title: {
    marginBottom: 5,
    textAlign: 'center'
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 20
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12
  },
  input: {
    padding: 10,
    borderRadius: 6,
    border: 'none',
    outline: 'none'
  },
  button: {
    marginTop: 10,
    padding: 10,
    borderRadius: 6,
    border: 'none',
    background: '#7f5af0',
    color: 'white',
    cursor: 'pointer'
  },
  small: {
    marginTop: 15,
    textAlign: 'center',
    fontSize: 13,
    opacity: 0.8
  }
} 
