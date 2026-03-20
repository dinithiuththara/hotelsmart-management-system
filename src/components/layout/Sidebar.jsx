import { NavLink } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { getAuth } from "../../auth/auth";
import API from "../../api";

const links = [
  { to: "/dashboard", label: "Dashboard", roles: ["admin", "manager", "reception"], key: "dashboard" },
  { to: "/rooms", label: "Rooms", roles: ["admin", "manager"], key: "rooms" },
  { to: "/bookings", label: "Bookings", roles: ["admin", "manager", "reception"], key: "bookings" },
  { to: "/guests", label: "Guests", roles: ["admin", "manager", "reception"], key: "guests" },
];

function Badge({ children }) {
  return (
    <span className="ml-auto rounded-full border border-slate-700 bg-slate-900 px-2.5 py-0.5 text-[11px] font-bold text-slate-200">
      {children}
    </span>
  );
}

export default function Sidebar() {
  const auth = getAuth();
  const role = auth?.role || "reception";
  const name = auth?.name || "User";

  const [roomsCount, setRoomsCount] = useState(0);
  const [activeBookings, setActiveBookings] = useState(0);
  const [guestsCount, setGuestsCount] = useState(0);

  async function refreshCounts() {
    try {
      const [roomsRes, bookingsRes, guestsRes] = await Promise.all([
        API.get("/rooms"),
        API.get("/bookings"),
        API.get("/guests"),
      ]);

      setRoomsCount(roomsRes.data.length);
      setGuestsCount(guestsRes.data.length);

      const active = bookingsRes.data.filter(
        (b) => b.status !== "Cancelled" && b.status !== "CheckedOut" && b.status !== "Checked-out"
      ).length;

      setActiveBookings(active);
    } catch (err) {
      console.error("Sidebar counts error:", err);
    }
  }

  useEffect(() => {
    refreshCounts();
  }, []);

  const visibleLinks = useMemo(
    () => links.filter((l) => l.roles.includes(role)),
    [role]
  );

  function badgeFor(key) {
    if (key === "rooms") return roomsCount;
    if (key === "bookings") return activeBookings;
    if (key === "guests") return guestsCount;
    return null;
  }

  return (
    <aside className="w-72 hidden md:flex flex-col min-h-screen border-r border-slate-800 bg-slate-950">
      <div className="p-6 border-b border-slate-800">
        <div className="text-lg font-extrabold tracking-tight text-white">HotelSmart</div>
        <div className="text-xs text-slate-400">Hotel Management System</div>
      </div>

      <nav className="p-3 flex-1">
        {visibleLinks.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              [
                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm mb-1 transition",
                isActive
                  ? "bg-slate-800/70 text-white border border-slate-700 shadow-sm"
                  : "text-slate-300 hover:bg-slate-900 hover:text-white",
              ].join(" ")
            }
          >
            <span className="h-2 w-2 rounded-full bg-current opacity-70" />
            {l.label}
            {badgeFor(l.key) !== null ? <Badge>{badgeFor(l.key)}</Badge> : null}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="text-xs text-slate-400">Signed in as</div>
        <div className="text-sm font-semibold text-white">{name}</div>
        <div className="text-xs text-slate-400 capitalize">{role}</div>
      </div>
    </aside>
  );
}