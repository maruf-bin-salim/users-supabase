import { supabase } from "@/lib/client";
import { useState } from "react"

export default function Home() {

  let [username, setUsername] = useState('');
  let [phone, setPhone] = useState('');
  let [isLoading, setLoading] = useState(false);
  let [isError, setError] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    let user = {
      username: username,
      phone: phone,
      timestamp: Date.now(),
    }

    let { data, error } = await supabase.from('Users').select('*');
    if (data) {

      if(data.length < 59)
      {
        // save user to database
        await supabase.from('Users').insert([user]);
      }
      else {
        setError(true)
      }
    }


    setLoading(false);
    setUsername('');
    setPhone('');

  }

  return (
    <div className="user-page">
      {
        !isLoading &&
        <>
          <div className="user-upper-container">
            <h1>User Page</h1>
            <p>For reservations, fill in your details</p>
            <input type="text" placeholder='First Name' value={username} onChange={(e) => { setError(false); setUsername(e.target.value) }} />
            <input type="text" placeholder='Number Mob.' value={phone} onChange={(e) => { setError(false); setPhone(e.target.value) }} />
            {isError && <p style={{color: "red", textAlign: "center", marginTop: "10px"}}>{"Your data wasn't saved. Already 60 users have reservation."}</p>}
          </div>
          <div className="user-button-container">
            <button onClick={handleSubmit}>Reservation</button>
          </div>
        </>
      }
      {
        isLoading &&
        <div className="user-upper-container">
          <h1>Saving your reservation</h1>
        </div>

      }
    </div>
  )
}
