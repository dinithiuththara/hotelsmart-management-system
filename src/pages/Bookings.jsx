import Sidebar from "../components/layout/Sidebar";

export default function Bookings() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ padding: "40px", width: "100%" }}>
        <h1>Bookings</h1>
        <p>Create and manage hotel bookings.</p>

        <div style={{ marginTop: "20px" }}>
          <button>+ Add Booking</button>
        </div>

      </div>
    </div>
  );
}