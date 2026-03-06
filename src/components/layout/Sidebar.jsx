import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Rooms", path: "/rooms" },
    { name: "Bookings", path: "/bookings" },
    { name: "Guests", path: "/guests" },
  ];

  return (
    <div
      style={{
        width: "230px",
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        padding: "25px",
      }}
    >
      <h2 style={{ marginBottom: "40px" }}>HotelSmart</h2>

      {menu.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          style={{
            display: "block",
            padding: "12px",
            marginBottom: "10px",
            borderRadius: "8px",
            background:
              location.pathname === item.path ? "#1e293b" : "transparent",
            color: "white",
            textDecoration: "none",
          }}
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
}