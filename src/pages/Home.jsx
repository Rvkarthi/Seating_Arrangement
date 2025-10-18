import { useEffect, useState } from 'react'
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(useGSAP,Draggable);
function Home() {

  const [classes, setClasses] = useState({})

  const [hall, setHall] = useState([])


  const [hallDetails, setHallDetails] = useState({name: "", size: 0})

  useEffect(()=>{
    Draggable.create('.box', {
    inertia: true,
    bounds: "main"
  })
  },[])

  useGSAP(()=>{

    gsap.from('.box', {
	    rotation: 90,
	    duration: 1,
      opacity: 0,
      scale: 0,
	    ease: 'ease',
    })
  
  })

  function handleHallSubmit(){
    setHall([...hall, hallDetails])
    setHallDetails({name: "", size: 0})
  }

  return (
    <main className='bg-red-500 h-[100vh] w-screen flex flex-col items-center '>

    <div className='flex justify-around w-[50vw]'>
    <input className='bg-white/70 px-4 mt-8 py-3 rounded-lg text-md text-black' type="text" placeholder='enter hall name' value={hallDetails.name} onChange={(e)=>setHallDetails({...hallDetails,"name": e.target.value})} />
    <input className='bg-white/70 px-4 mt-8 py-3 rounded-lg text-md text-black' type="number" placeholder='hall size' value={hallDetails.size} onChange={(e)=>setHallDetails({...hallDetails,"size": e.target.value})}/>
    <button onClick={handleHallSubmit} className='bg-green-500 px-5 text-2xl rounded-md mt-5'>add</button></div>

      <div className='bg-white/10 pt-2 w-[80vw] h-[15vh] mt-20 flex justify-around' id='bounds'>
          <div className='bg-red-900 size-20 text-white text-2xl font-bold text-center box'>2 cse a (60)</div>
          <div className='bg-red-900 size-20 text-white text-2xl font-bold text-center box'>2 cse b (60)</div>
          <div className='bg-red-900 size-20 text-white text-2xl font-bold text-center box'>3 cse a (60)</div>
          <div className='bg-red-900 size-20 text-white text-2xl font-bold text-center box'>3 cse b (60)</div>
      </div>

      <div className="flex justify-around w-3/4">
      {hall.map((item)=>(
        <div className='size-52 bg-black mt-12 text-white'>
          <h1 className='text-2xl text-center'>{item.name}</h1>
          <p className='text-2xl text-center'>{item.size}</p>
        </div>
        ))}
        
        
      </div>

    </main>
  )
}

export default Home
