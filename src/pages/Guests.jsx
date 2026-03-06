import { useEffect, useState } from "react";
import Sidebar from "../components/layout/Sidebar";

const GUEST_KEY = "hotel_guests";

export default function Guests() {
  const [guests, setGuests] = useState([]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Load guests
  useEffect(() => {
    const saved = localStorage.getItem(GUEST_KEY);
    if (saved) {
      setGuests(JSON.parse(saved));
    }
  }, []);

  function saveGuests(updated) {
    setGuests(updated);
    localStorage.setItem(GUEST_KEY, JSON.stringify(updated));
  }

  function addGuest() {
    if (!name || !phone) {
      alert("Name and phone are required");
      return;
    }

    const newGuest = {
      id: Date.now(),
      name,
      phone,
      email,
    };

    const updated = [...guests, newGuest];
    saveGuests(updated);

    setName("");
    setPhone("");
    setEmail("");
  }

  function deleteGuest(id) {
    if (!window.confirm("Delete this guest?")) return;

    const updated = guests.filter((g) => g.id !== id);
    saveGuests(updated);
  }

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ padding: "40px", width: "100%" }}>
        <h1>Guests</h1>
        <p>Manage guest profiles.</p>

        {/* Add Guest */}
        <div style={{ marginTop: "20px" }}>
          <input
            placeholder="Guest Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ marginRight: "10px" }}
          />

          <input
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{ marginRight: "10px" }}
          />

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginRight: "10px" }}
          />

          <button onClick={addGuest}>Add Guest</button>
        </div>

        {/* Guest List */}
        <div style={{ marginTop: "30px" }}>
          {guests.map((guest) => (
            <div
              key={guest.id}
              style={{
                border: "1px solid #ccc",
                padding: "15px",
                marginBottom: "10px",
                borderRadius: "8px",
              }}
            >
              <h3>{guest.name}</h3>
              <p>Phone: {guest.phone}</p>
              <p>Email: {guest.email}</p>

              <button
                onClick={() => deleteGuest(guest.id)}
                style={{ background: "red", color: "white" }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}