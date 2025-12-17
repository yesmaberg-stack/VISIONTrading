import Link from 'next/link';
export default function Header(){
  return <div className='header'>
    <h3>VISION</h3>
    <div>
      <Link href='/'><a className='small'>Home</a></Link> | <Link href='/dashboard'><a className='small'>Dashboard</a></Link> | <Link href='/admin'><a className='small'>Admin</a></Link>
    </div>
  </div>
}
