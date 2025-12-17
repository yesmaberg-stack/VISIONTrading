import useSWR from 'swr';
import io from 'socket.io-client';
import { useEffect, useState } from 'react';
const fetcher = (url) => fetch(url).then(r=>r.json());

let socket;
export default function Dashboard(){
  const [orders, setOrders] = useState([]);
  useEffect(()=>{
    socket = io();
    socket.on('order_book_update', (d)=> setOrders(prev => [d, ...prev].slice(0,20)));
    return ()=> socket && socket.disconnect();
  },[]);
  return <div className='container'>
    <div className='card'>
      <h2>Dashboard</h2>
      <p className='small'>Realtime order updates (demo)</p>
      <div style={{marginTop:12}}>
        <button className='btn' onClick={()=> socket && socket.emit('new_order', {side:'buy', amount:100, price:12.34, when:Date.now()})}>Emit test order</button>
      </div>
      <ul style={{marginTop:12}}>
        {orders.map((o,i)=><li key={i} className='small'>{o.side} {o.amount} @ {o.price}</li>)}
      </ul>
    </div>
  </div>
}
