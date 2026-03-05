import { Link } from "react-router-dom";

export default function Sidebar() {

  return (
    <div style={{
      width:"220px",
      height:"100vh",
      background:"#0f172a",
      color:"white",
      padding:"20px"
    }}>

      <h2>HotelSmart</h2>

      <div style={{marginTop:"30px", display:"flex", flexDirection:"column", gap:"10px"}}>

        <Link to="/dashboard" style={{color:"white"}}>Dashboard</Link>

        <Link to="/rooms" style={{color:"white"}}>Rooms</Link>

        <Link to="/bookings" style={{color:"white"}}>Bookings</Link>

        <Link to="/guests" style={{color:"white"}}>Guests</Link>

      </div>

    </div>
  );
}