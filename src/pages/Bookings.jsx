import { useEffect, useState } from "react";
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

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ padding: "40px", width: "100%" }}>
        <h1>Bookings</h1>
        <p>Create and manage hotel bookings.</p>

        <div style={{ marginTop: "20px" }}>
          <input
            placeholder="Guest Name"
            value={guest}
            onChange={(e) => setGuest(e.target.value)}
            style={{ marginRight: "10px", padding: "8px" }}
          />

          <select
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            style={{ marginRight: "10px", padding: "8px" }}
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
            style={{ marginRight: "10px", padding: "8px" }}
          />

          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            style={{ marginRight: "10px", padding: "8px" }}
          />

          <button onClick={addBooking} style={{ padding: "8px 14px" }}>
            Add Booking
          </button>
        </div>

        <div style={{ marginTop: "30px" }}>
          {bookings.length === 0 ? (
            <p>No bookings yet.</p>
          ) : (
            bookings.map((booking) => (
              <div
                key={booking.id}
                style={{
                  border: "1px solid #ccc",
                  padding: "15px",
                  marginBottom: "10px",
                  borderRadius: "8px",
                }}
              >
                <h3>{booking.guest}</h3>
                <p>Room: {booking.room}</p>
                <p>Check In: {booking.checkIn}</p>
                <p>Check Out: {booking.checkOut}</p>
                <p>Status: {booking.status}</p>

                <button
                  onClick={() => deleteBooking(booking.id)}
                  style={{
                    background: "red",
                    color: "white",
                    border: "none",
                    padding: "8px 12px",
                    cursor: "pointer",
                    borderRadius: "4px",
                  }}
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