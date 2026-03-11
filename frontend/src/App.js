import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

function App() {

const [category,setCategory] = useState("food")
const [lat,setLat] = useState(null)
const [lon,setLon] = useState(null)
const [city,setCity] = useState("")
const [searchCity,setSearchCity] = useState("")
const [radius,setRadius] = useState(5)
const [places,setPlaces] = useState([])
const [loading,setLoading] = useState(false)
const [errorMsg,setErrorMsg] = useState("")

// AUTO LOCATION
useEffect(()=>{

navigator.geolocation.getCurrentPosition(

async(position)=>{

const latitude = position.coords.latitude
const longitude = position.coords.longitude

setLat(latitude)
setLon(longitude)

try{

const res = await fetch(
`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
)

const data = await res.json()

const detectedCity =
data.address.city ||
data.address.town ||
data.address.village ||
"Unknown location"

setCity(detectedCity)

}catch(e){
console.log(e)
}

},

(error)=>{
console.log("Location error",error)
setCity("Location Access Denied")
}

)

},[])


// SEARCH CITY
const searchLocation = async ()=>{

if(!searchCity) return

try{

const res = await fetch(
`https://nominatim.openstreetmap.org/search?format=json&q=${searchCity}&limit=1`
)

const data = await res.json()

if(data.length===0){
alert("Location not found")
return
}

setLat(parseFloat(data[0].lat))
setLon(parseFloat(data[0].lon))
setCity(searchCity)

}catch(err){
console.log(err)
}

}


// FIND PLACES
const findPlaces = async()=>{

if(!lat || !lon){
alert("Location not ready")
return
}

setLoading(true)
setErrorMsg("")
setPlaces([])

try{

const response = await fetch("http://127.0.0.1:8000/recommend",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

category:category,
latitude:parseFloat(lat),
longitude:parseFloat(lon),
radius:parseInt(radius)

})

})

const data = await response.json()

if(Array.isArray(data) && data.length>0){
setPlaces(data)
}else{
setErrorMsg(`No ${category} found in ${radius} km`)
}

}catch(error){

console.log(error)
setErrorMsg("Server error")

}

setLoading(false)

}

return(

<div style={{
minHeight:"100vh",
background:"linear-gradient(135deg,#1f4037,#99f2c8)",
display:"flex",
justifyContent:"center",
alignItems:"center",
padding:"30px",
fontFamily:"Arial"
}}>

<div style={{
background:"rgba(255,255,255,0.9)",
padding:"40px",
borderRadius:"20px",
width:"1000px",
backdropFilter:"blur(10px)",
boxShadow:"0 20px 60px rgba(0,0,0,0.25)"
}}>

<h1 style={{
textAlign:"center",
fontSize:"36px",
color:"#2c3e50"
}}>
🌍 Nearby Finder
</h1>

<p style={{
textAlign:"center",
color:"#555",
marginBottom:"25px"
}}>
Explore everything around you instantly
</p>

<p>
📍 <strong>Current Location:</strong> {city}
</p>


{/* CITY SEARCH */}

<div style={{
display:"flex",
gap:"10px",
marginTop:"10px"
}}>

<input
placeholder="Search city"
value={searchCity}
onChange={(e)=>setSearchCity(e.target.value)}
style={{
padding:"12px",
flex:1,
borderRadius:"8px",
border:"1px solid #ccc"
}}
/>

<button
onClick={searchLocation}
style={{
padding:"12px 20px",
background:"#ff7b00",
color:"white",
border:"none",
borderRadius:"8px",
cursor:"pointer"
}}
>
Set Location
</button>

</div>


{/* RADIUS */}

<div style={{
marginTop:"20px",
padding:"10px",
background:"#f5f5f5",
borderRadius:"8px"
}}>

<strong>Search Radius:</strong>

<select
value={radius}
onChange={(e)=>setRadius(e.target.value)}
style={{
marginLeft:"10px",
padding:"6px"
}}
>

<option value={2}>2 km</option>
<option value={5}>5 km</option>
<option value={10}>10 km</option>
<option value={20}>20 km</option>

</select>

</div>


{/* CATEGORY */}

<div style={{
marginTop:"20px",
display:"flex",
flexWrap:"wrap",
gap:"10px"
}}>

{[
["food","🍔"],
["hospital","🏥"],
["gym","💪"],
["shopping","🛍"],
["clothes","👕"],
["shoes","👟"],
["hotel","🏨"],
["atm","🏧"],
["fuel","⛽"]
].map(([cat,icon])=>(

<button
key={cat}
onClick={()=>setCategory(cat)}
style={{
padding:"10px 18px",
borderRadius:"25px",
border:"none",
cursor:"pointer",
fontSize:"14px",
background:category===cat ? "#2c7be5" : "#e0e0e0",
color:category===cat ? "white" : "black"
}}
>

{icon} {cat}

</button>

))}

</div>


{/* SEARCH BUTTON */}

<button
onClick={findPlaces}
style={{
marginTop:"25px",
width:"100%",
padding:"14px",
fontSize:"16px",
background:"#27ae60",
color:"white",
border:"none",
borderRadius:"10px",
cursor:"pointer"
}}
>

{loading ? "Searching..." : `Find ${category} Nearby`}

</button>


{/* MAP */}

{lat && lon && (

<div style={{marginTop:"30px"}}>

<MapContainer
center={[lat,lon]}
zoom={13}
style={{height:"300px",borderRadius:"10px"}}
>

<TileLayer
url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
/>

<Marker position={[lat,lon]}>
<Popup>Your Location</Popup>
</Marker>

{places.map((p,i)=>(
<Marker key={i} position={[lat,lon]}>
<Popup>

<strong>{p.name}</strong>
<br/>
Distance: {p.distance} km

</Popup>
</Marker>
))}

</MapContainer>

</div>

)}


{/* RESULTS */}

<h2 style={{marginTop:"30px"}}>Results</h2>

{errorMsg && (

<div style={{
background:"#ffe6e6",
padding:"10px",
borderRadius:"6px",
color:"#c62828"
}}>
{errorMsg}
</div>

)}

<div style={{
display:"grid",
gridTemplateColumns:"1fr 1fr",
gap:"15px",
marginTop:"20px"
}}>

{places.map((p,index)=>(

<div key={index} style={{
border:"1px solid #eee",
padding:"15px",
borderRadius:"12px",
boxShadow:"0 6px 20px rgba(0,0,0,0.08)",
background:"white",
transition:"0.2s"
}}>

<h3>{p.name}</h3>

<p style={{color:"#2c7be5"}}>
Distance: {p.distance} km
</p>

</div>

))}

</div>

</div>

</div>

)

}

export default App