
import { useEffect,useState } from 'react';
import './App.css'

function App() {
  const [obj,setObj]=useState({
    firstName: 'John',
    lastName: 'Doe',
    age: 30,
    city: 'New York',
    country: 'USA',
    address:{
      firstLine: 'John Street',
      secondLine: 'Apt 123'
    }
  })
  const handleClick=() => {
    setObj({ ...obj, address: { ...obj.address,secondLine: 'apt 234' }});
    console.log(obj.address.secondLine)
  }
  return (
    <>
      <div>hi</div>
      <button onClick={handleClick}>click me</button>
      <h1>{obj.firstName}</h1>
      <h1>{obj.lastName}</h1>
      <h1>{obj.age}</h1>
      <h1>{obj.address.firstLine}</h1>
      <h1>{obj.address.secondLine}</h1>

    </>
  )
}

export default App
