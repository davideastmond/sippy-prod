'use client'

import Home from "@/components/home/Home"

export default function Dashboard() {

  async function handleRegister() {
    try {
      const newUser = {
        isAdmin: false,
        email: "userSippy3@example.com",
        phoneNumber: "123456789",
        firstName: "Sippy Test",
        lastName: "Dev?",
        // addressId: "Los Angeles"
      };
    
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
      });
    
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log("User created",result.data)
    } catch (error) {
      console.log(error)
    }
  }
  
  return (
    <div>
      <Home />

      <button onClick={handleRegister}>test new user</button>
    </div>
  );
}
