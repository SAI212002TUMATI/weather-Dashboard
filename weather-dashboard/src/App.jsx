 import { useState } from "react";
 import SearchBar from "./components/SearchBar";
 function App(){
  const[weather,setWeather] = useState(null);
  const[error,setError] = useState("");
  const[loading,setLoading]=useState(false);
  const[unit,setUnit] = useState("C");
  const fetchWeather = async(city)=>{
    setError("");
    setWeather(null);
    setLoading(true);
    try{
      const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
      );
      if(!response.ok){
        throw new Error("city not found");
      }
      const data = await response.json();
      setWeather(data);
    }catch(err){
      setError(err.message);
    }finally{
      setLoading(false);
    }
    };
    const getTemperature = () => {
      if(!weather ||!weather.main)
        return null;
      return unit === "C"
      ? weather.main.temp
      : (weather.main.temp * 9) / 5 + 32;
    };
  return(
    <div style={{padding:"40px",fontFamily:"Arial"}}>
      <h1>🌦️Weather Dashboard</h1>
      <p>Search a city to get live weather updates</p>
      {/* CENTERED FLEX CONTAINER*/}
      <div
      style = {{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "80vh",
      }}
      >

      <SearchBar onSearch={fetchWeather}/>
      <button
      onClick = {()=>setUnit(unit === "C"?"F":"C")}
      style={{
        marginTop:"10px",
        padding: "8px 12px",
        borderRadius:"6px",
        border:"none",
        cursor:"pointer",
      }}>
      switch to °{unit ==="C"?"F" : "C"}
      </button>
      {error &&<p style={{color:"red"}}>{error}</p>}
      {loading && <p>loading...</p>}
      {weather &&(
        <div style={{marginTop:"20px",
          padding:"20px",
          borderRadius:"10px",
          background:"linear-gradient(to right,#4facfe,#00f2fe)",
          color:"#fff",
          width:"300px",
          textAlign:"center",
          boxShadow:"0 4px 8px rgba(0,0,0,0.2)",
        }}>
          <h2 style={{margin: "0 0 10px 0"}}>{weather.name}</h2>
          <p style={{fontSize:"24px",margin: "5px 0"}}></p>
           {getTemperature() !==null && (
            <p style={{fontSize:"24px",margin:"5px 0"}}>
              🌡️Temperature :
              {getTemperature().toFixed(1)}°{unit}
            </p>
           )}
          </div>

  )}
</div>
</div>
  );
}
export default App;