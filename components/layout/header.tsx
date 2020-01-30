import { useState, useEffect } from 'react';
import UserInfo from '../userInfo'


export default function Header({}) {
  const [token, setToken] = useState();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if(token){
      setToken(token);
    }
    
  }, [])

  return (
    <div>
      <h1>lightning talk</h1>
      <UserInfo token={token}></UserInfo>
    </div>
  )
}
