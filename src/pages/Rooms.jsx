import { useEffect, useState } from "react";
import Sidebar from "../components/layout/Sidebar";

const STORAGE_KEY = "hotel_rooms";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [roomNumber, setRoomNumber] = useState("");
  const [price, setPrice] = useState("");

  // load rooms
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setRooms(JSON.parse(saved));
    }
  }, []);

  // save rooms
  function saveRooms(updated) {
    setRooms(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  function addRoom() {
    if (!roomNumber || !price) {
      alert("Enter room number and price");
      return;
    }

    const newRoom = {
      id: Date.now(),
      number: roomNumber,
      price: price,
      status: "Available",
    };

    const updated = [...rooms, newRoom];
    saveRooms(updated);

    setRoomNumber("");
    setPrice("");
  }

  function deleteRoom(id) {
    if (!window.confirm("Delete this room?")) return;

    const updated = rooms.filter((room) => room.id !== id);
    saveRooms(updated);
  }

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ padding: "40px", width: "100%" }}>
        <h1>Rooms</h1>
        <p>Add rooms and manage availability.</p>

        {/* Add Room */}
        <div style={{ marginTop: "20px" }}>
          <input
            placeholder="Room Number"
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
            style={{ marginRight: "10px" }}
          />

          <input
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={{ marginRight: "10px" }}
          />

          <button onClick={addRoom}>Add Room</button>
        </div>

        {/* Room List */}
        <div style={{ marginTop: "30px" }}>
          {rooms.map((room) => (
            <div
              key={room.id}
              style={{
                border: "1px solid #ccc",
                padding: "15px",
                marginBottom: "10px",
                borderRadius: "8px",
              }}
            >
              <h3>Room {room.number}</h3>
              <p>Price: LKR {room.price}</p>
              <p>Status: {room.status}</p>

              <button
                onClick={() => deleteRoom(room.id)}
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