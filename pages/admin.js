import { supabase } from '@/lib/client';
import { Router, useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { useSubscription } from 'react-supabase'



function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-indexed
  const year = date.getFullYear().toString();
  return `${day}-${month}-${year}`;
}

function User({ index, userID, username, phone, timestamp }) {
  const router = useRouter();


  async function deleteUser(){
    let { data, error } = await supabase.from('Users').delete().eq('user_id', userID)
    router.reload();
  }



  return (
    <div className='user'>
      <div className='user-left'>
        <div className='index'>
          {index}
        </div>
      </div>
      <div className='user-main'>
        <p className='user-name'>{username}</p>
        <p className='user-phone'>{phone}</p>
      </div>
      <div className='user-right'>
        <p>{formatTimestamp(timestamp)}</p>
        <img className={'user-delete-button'} src='/delete.png' onClick={deleteUser}></img>
      </div>
    </div>
  )
}

const Users = () => {

  const router = useRouter();

  const [users, setUsers] = useState([]);
  let usersComponent;



  useEffect(() => {
    const userSubscription = supabase
      .channel('any_string_you_want')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'Users',
        },
        (payload) => {
          // console.log(payload);
          router.reload();
        }
      )
      .subscribe();

    return () => {
      userSubscription.unsubscribe();
    }
  }, [])


  useEffect(() => {

    async function fetchUsers() {
      let { data, error } = await supabase.from('Users').select('*');
      if (data) setUsers(data);
      // console.log(data);
    }

    fetchUsers();
  }, [])







  return (
    <div className="admin-page">
      <h1>Admin Page</h1>
      <div className='admin-prompt'>
        <div className='admin-upper-container'>
          <p>customers</p>
          <p>{`${users?.length} / 60`}</p>
        </div>
        <p className='prompt'>Customer who booked on this day</p>
      </div>
      <div className='users'>
        {

          users.map((user, index) =>
            <User
              key={index + 1}
              userID={user.user_id}
              index={index}
              username={user.username}
              phone={user.phone}
              timestamp={user.timestamp}
            />
          )

        }
      </div>
    </div>
  )
}

export default Users;