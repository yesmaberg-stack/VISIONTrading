import Link from 'next/link';
export default function Home(){
  return <div className='container'>
    <div className='card'>
      <div className='header'>
        <h1>VISIONTrading</h1>
        <div>
          <Link href='/dashboard'><button className='btn'>Dashboard</button></Link>
        </div>
      </div>
      <p className='small'>Plataforma de trading — UI base en negro / morado / celeste / rosado.</p>
    </div>
  </div>
}
