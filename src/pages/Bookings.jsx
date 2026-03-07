import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/layout/Sidebar";

const BOOKING_KEY = "hotel_bookings";
const ROOM_KEY = "hotel_rooms";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [guest, setGuest] = useState("");
  const [room, setRoom] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const [search, setSearch] = useState("");
  const [filterRoom, setFilterRoom] = useState("All");

  useEffect(() => {
    const savedBookings = localStorage.getItem(BOOKING_KEY);
    if (savedBookings) {
      setBookings(JSON.parse(savedBookings));
    }

    const savedRooms = localStorage.getItem(ROOM_KEY);
    if (savedRooms) {
      setRooms(JSON.parse(savedRooms));
    }
  }, []);

  function saveBookings(updated) {
    setBookings(updated);
    localStorage.setItem(BOOKING_KEY, JSON.stringify(updated));
  }

  function addBooking() {
    if (!guest || !room || !checkIn || !checkOut) {
      alert("Please fill all fields");
      return;
    }

    const selectedRoom = rooms.find((r) => r.number === room);

    if (!selectedRoom) {
      alert("Selected room not found");
      return;
    }

    if (selectedRoom.status === "Occupied") {
      alert("This room is already occupied");
      return;
    }

    const newBooking = {
      id: Date.now(),
      guest,
      room,
      checkIn,
      checkOut,
      status: "Confirmed",
    };

    const updatedBookings = [...bookings, newBooking];
    saveBookings(updatedBookings);

    const updatedRooms = rooms.map((r) =>
      r.number === room ? { ...r, status: "Occupied" } : r
    );

    localStorage.setItem(ROOM_KEY, JSON.stringify(updatedRooms));
    setRooms(updatedRooms);

    setGuest("");
    setRoom("");
    setCheckIn("");
    setCheckOut("");
  }

  function deleteBooking(id) {
    if (!window.confirm("Delete this booking?")) return;

    const booking = bookings.find((b) => b.id === id);

    const updatedBookings = bookings.filter((b) => b.id !== id);
    saveBookings(updatedBookings);

    if (booking) {
      const updatedRooms = rooms.map((r) =>
        r.number === booking.room ? { ...r, status: "Available" } : r
      );

      localStorage.setItem(ROOM_KEY, JSON.stringify(updatedRooms));
      setRooms(updatedRooms);
    }
  }

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesSearch =
        booking.guest.toLowerCase().includes(search.toLowerCase()) ||
        booking.room.toLowerCase().includes(search.toLowerCase());

      const matchesRoom =
        filterRoom === "All" ? true : booking.room === filterRoom;

      return matchesSearch && matchesRoom;
    });
  }, [bookings, search, filterRoom]);

  return (
    <div
      style={{
        display: "flex",
        background: "#020617",
        minHeight: "100vh",
        color: "white",
      }}
    >
      <Sidebar />

      <div style={{ padding: "40px", width: "100%" }}>
        <h1>Bookings</h1>
        <p style={{ color: "#94a3b8" }}>Create and manage hotel bookings.</p>

        <div style={{ marginTop: "20px" }}>
          <input
            placeholder="Guest Name"
            value={guest}
            onChange={(e) => setGuest(e.target.value)}
            style={inputStyle}
          />

          <select
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            style={inputStyle}
          >
            <option value="">Select Room</option>
            {rooms.map((r) => (
              <option key={r.id} value={r.number}>
                Room {r.number} - {r.status}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            style={inputStyle}
          />

          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            style={inputStyle}
          />

          <button onClick={addBooking} style={buttonStyle}>
            Add Booking
          </button>
        </div>

        <div
          style={{
            marginTop: "30px",
            marginBottom: "20px",
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <input
            placeholder="Search by guest or room"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={inputStyle}
          />

          <select
            value={filterRoom}
            onChange={(e) => setFilterRoom(e.target.value)}
            style={inputStyle}
          >
            <option value="All">All Rooms</option>
            {rooms.map((r) => (
              <option key={r.id} value={r.number}>
                Room {r.number}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginTop: "20px" }}>
          {filteredBookings.length === 0 ? (
            <p style={{ color: "#94a3b8" }}>No bookings found.</p>
          ) : (
            filteredBookings.map((booking) => (
              <div key={booking.id} style={cardStyle}>
                <h3>{booking.guest}</h3>
                <p>Room: {booking.room}</p>
                <p>Check In: {booking.checkIn}</p>
                <p>Check Out: {booking.checkOut}</p>
                <p>Status: {booking.status}</p>

                <button
                  onClick={() => deleteBooking(booking.id)}
                  style={deleteButtonStyle}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  marginRight: "10px",
  marginBottom: "10px",
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #334155",
  background: "#0f172a",
  color: "white",
};

const buttonStyle = {
  padding: "10px 16px",
  borderRadius: "8px",
  border: "none",
  background: "#2563eb",
  color: "white",
  cursor: "pointer",
};

const deleteButtonStyle = {
  background: "#dc2626",
  color: "white",
  border: "none",
  padding: "8px 12px",
  cursor: "pointer",
  borderRadius: "6px",
  marginTop: "10px",
};

const cardStyle = {
  border: "1px solid #334155",
  padding: "15px",
  marginBottom: "10px",
  borderRadius: "10px",
  background: "#0f172a",
  boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
};