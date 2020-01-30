import { useEffect, useState } from 'react';
import fetch from 'isomorphic-unfetch';
import Link from 'next/link';
import { async } from 'rxjs/internal/scheduler/async';

export default function UserInfo({token}) {
    const [userName, setUserName] = useState();

    async function getUser(token) {
      const res = await fetch('http://localhost:3000/auth/user', {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      setUserName(data.userName);
    };

    function loginOut() {
      setUserName('')
    }

    useEffect(() => {
      if(token){
        getUser(token);
      }
      
    }, [token])

    return (
      <div>
        {
            userName ? [
              <h4 key="wellcome">wellcome {userName}</h4>,
              <a key="loginStatus" onClick={loginOut}>login out</a>
            ] :  <Link href="/login"><span>please login</span></Link>
        }
      </div>
    )
  }