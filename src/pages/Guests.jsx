import Sidebar from "../components/layout/Sidebar";

export default function Guests() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ padding: "40px", width: "100%" }}>
        <h1>Guests</h1>
        <p>Manage guest profiles (name, phone, email).</p>

        <div style={{ marginTop: "20px" }}>
          <button>+ Add Guest</button>
        </div>

      </div>
    </div>
  );
}