import Sidebar from "../components/layout/Sidebar";

export default function Dashboard() {

  return (
    <div style={{display:"flex"}}>

      <Sidebar />

      <div style={{padding:"40px"}}>
        <h1>Dashboard</h1>
        <p>Welcome to HotelSmart Management System</p>
      </div>

    </div>
  );
}