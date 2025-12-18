import Link from 'next/link'

export default function Register() {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1>Create account</h1>

        <form style={styles.form}>
          <input placeholder="Email" type="email" style={styles.input} />
          <input placeholder="Password" type="password" style={styles.input} />
          <input placeholder="Confirm password" type="password" style={styles.input} />

          <button style={styles.button}>Register</button>
        </form>

        <p style={styles.small}>
          Already have an account? <Link href="/login">Login</Link>
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
    color: 'white'
  },
  card: {
    background: '#12121c',
    padding: 30,
    borderRadius: 10,
    width: 320
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12
  },
  input: {
    padding: 10,
    borderRadius: 6,
    border: 'none'
  },
  button: {
    padding: 10,
    marginTop: 10,
    borderRadius: 6,
    border: 'none',
    background: '#7f5af0',
    color: 'white',
    cursor: 'pointer'
  },
  small: {
    marginTop: 15,
    fontSize: 13,
    textAlign: 'center',
    opacity: 0.8
  }
}
