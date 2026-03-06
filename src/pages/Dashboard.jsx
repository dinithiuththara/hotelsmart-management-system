import { useEffect, useState } from "react";
import Sidebar from "../components/layout/Sidebar";

const ROOM_KEY = "hotel_rooms";
const BOOKING_KEY = "hotel_bookings";

export default function Dashboard() {
  const [totalRooms, setTotalRooms] = useState(0);
  const [availableRooms, setAvailableRooms] = useState(0);
  const [occupiedRooms, setOccupiedRooms] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);

  useEffect(() => {
    const rooms = JSON.parse(localStorage.getItem(ROOM_KEY)) || [];
    const bookings = JSON.parse(localStorage.getItem(BOOKING_KEY)) || [];

    setTotalRooms(rooms.length);

    const available = rooms.filter((r) => r.status === "Available").length;
    const occupied = rooms.filter((r) => r.status === "Occupied").length;

    setAvailableRooms(available);
    setOccupiedRooms(occupied);
    setTotalBookings(bookings.length);
  }, []);

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
        <h1 style={{ marginBottom: "10px" }}>Dashboard</h1>
        <p style={{ color: "#94a3b8", marginBottom: "30px" }}>
          HotelSmart Management Overview
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "20px",
          }}
        >
          <div
            style={cardStyle}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "scale(1)")
            }
          >
            <h3 style={{ marginBottom: "10px", color: "#cbd5e1" }}>
              Total Rooms
            </h3>
            <h1>{totalRooms}</h1>
          </div>

          <div
            style={cardStyle}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "scale(1)")
            }
          >
            <h3 style={{ marginBottom: "10px", color: "#cbd5e1" }}>
              Available Rooms
            </h3>
            <h1>{availableRooms}</h1>
          </div>

          <div
            style={cardStyle}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "scale(1)")
            }
          >
            <h3 style={{ marginBottom: "10px", color: "#cbd5e1" }}>
              Occupied Rooms
            </h3>
            <h1>{occupiedRooms}</h1>
          </div>

          <div
            style={cardStyle}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "scale(1)")
            }
          >
            <h3 style={{ marginBottom: "10px", color: "#cbd5e1" }}>
              Total Bookings
            </h3>
            <h1>{totalBookings}</h1>
          </div>
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  background: "#1e293b",
  color: "white",
  padding: "25px",
  borderRadius: "12px",
  textAlign: "center",
  boxShadow: "0 6px 15px rgba(0,0,0,0.4)",
  transition: "transform 0.2s ease",
};