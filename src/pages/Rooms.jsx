import Sidebar from "../components/layout/Sidebar";

export default function Rooms() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ padding: "40px", width: "100%" }}>
        <h1>Rooms</h1>
        <p>Add rooms, edit details, and update availability.</p>

        <div style={{ marginTop: "20px" }}>
          <button>+ Add Room</button>
        </div>

      </div>
    </div>
  );
}