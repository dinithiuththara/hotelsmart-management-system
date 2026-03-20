import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../components/ui/Button";
import API from "../api";

const LOCAL_ROOMS_KEY = "hotel_rooms_v1";
const LOCAL_BOOKINGS_KEY = "hotel_bookings_v1";

function Modal({ open, onClose, title, children }) {
  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="absolute inset-0 bg-black/80" onClick={onClose} />
        <motion.div
          initial={{ scale: 0.92, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.92, y: 20 }}
          className="relative w-full max-w-4xl rounded-3xl border border-slate-700 bg-slate-950 p-6 shadow-2xl"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-extrabold text-white">{title}</h2>
            <button
              onClick={onClose}
              className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Close
            </button>
          </div>
          <div className="mt-5">{children}</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function getRoomId(room) {
  return String(room?.room_no ?? room?.id ?? room?.roomId ?? room?.number ?? "").trim();
}

function getRoomFloor(room) {
  return room?.floor || "-";
}

function getRoomStatus(room) {
  return room?.status || "Available";
}

function getRoomPrice(room) {
  return Number(room?.price || 0);
}

function roomLabel(room) {
  return `${getRoomId(room)} • ${getRoomFloor(room)} • LKR ${getRoomPrice(
    room
  ).toLocaleString()} • ${getRoomStatus(room)}`;
}

function seedLocalRoomsIfMissing() {
  try {
    const raw = localStorage.getItem(LOCAL_ROOMS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}

  const seed = [
    {
      room_no: "R201",
      room_name: "Double Room • First Floor",
      room_type: "Double",
      floor: "1st Floor",
      price: 15000,
      status: "Available",
    },
    {
      room_no: "R202",
      room_name: "Double Room • Second Floor",
      room_type: "Double",
      floor: "2nd Floor",
      price: 20000,
      status: "Available",
    },
  ];

  localStorage.setItem(LOCAL_ROOMS_KEY, JSON.stringify(seed));
  return seed;
}

function saveLocalBookings(list) {
  localStorage.setItem(LOCAL_BOOKINGS_KEY, JSON.stringify(list));
}

export default function Bookings() {
  const location = useLocation();

  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [search, setSearch] = useState("");
  const [loadingRooms, setLoadingRooms] = useState(false);

  const [form, setForm] = useState({
    guest: "",
    phone: "",
    room: "",
    checkIn: "",
    checkOut: "",
  });

  useEffect(() => {
    loadAll();
  }, []);

  useEffect(() => {
    if (!rooms.length) return;

    const selectedRoom = location.state?.selectedRoom;
    const openFromDashboard = location.state?.openAdd;

    if (selectedRoom) {
      setForm((prev) => ({
        ...prev,
        room: String(selectedRoom),
      }));
      setOpenAdd(true);
      return;
    }

    if (openFromDashboard) {
      setForm((prev) => ({
        ...prev,
        room: prev.room || getRoomId(rooms[0]),
      }));
      setOpenAdd(true);
    }
  }, [location.state, rooms]);

  async function loadAll() {
    setLoadingRooms(true);

    try {
      const [bookingRes, roomRes] = await Promise.all([
        API.get("/bookings").catch(() => ({ data: [] })),
        API.get("/rooms").catch(() => ({ data: [] })),
      ]);

      const bookingData = Array.isArray(bookingRes.data) ? bookingRes.data : [];
      let roomData = Array.isArray(roomRes.data) ? roomRes.data : [];

      if (!roomData.length) {
        roomData = seedLocalRoomsIfMissing();
      }

      setBookings(bookingData);
      setRooms(roomData);

      setForm((prev) => ({
        ...prev,
        room:
          prev.room && roomData.some((r) => getRoomId(r) === prev.room)
            ? prev.room
            : roomData[0]
            ? getRoomId(roomData[0])
            : "",
      }));
    } catch (error) {
      console.error("Failed to load bookings/rooms:", error);

      const fallbackRooms = seedLocalRoomsIfMissing();
      setRooms(fallbackRooms);

      setForm((prev) => ({
        ...prev,
        room: fallbackRooms[0] ? getRoomId(fallbackRooms[0]) : "",
      }));
    } finally {
      setLoadingRooms(false);
    }
  }

  const filteredBookings = useMemo(() => {
    const q = search.toLowerCase();
    return bookings.filter((booking) => {
      return (
        String(booking.guest || "").toLowerCase().includes(q) ||
        String(booking.room || "").toLowerCase().includes(q) ||
        String(booking.phone || "").toLowerCase().includes(q)
      );
    });
  }, [bookings, search]);

  async function handleAddBooking(e) {
    e.preventDefault();

    if (
      !form.guest.trim() ||
      !form.phone.trim() ||
      !form.room.trim() ||
      !form.checkIn ||
      !form.checkOut
    ) {
      alert("Please fill all booking fields.");
      return;
    }

    const selectedRoom = rooms.find((r) => getRoomId(r) === form.room);

    if (!selectedRoom) {
      alert("Selected room not found.");
      console.log("Selected room value:", form.room);
      console.log("Rooms list:", rooms);
      return;
    }

    if (getRoomStatus(selectedRoom) === "Occupied") {
      alert("This room is already occupied.");
      return;
    }

    try {
      const res = await API.post("/bookings", {
        guest: form.guest.trim(),
        phone: form.phone.trim(),
        room: form.room,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
      });

      const created = res?.data;

      if (created) {
        const updatedBookings = [created, ...bookings];
        setBookings(updatedBookings);
        saveLocalBookings(updatedBookings);
      }

      setForm({
        guest: "",
        phone: "",
        room: rooms[0] ? getRoomId(rooms[0]) : "",
        checkIn: "",
        checkOut: "",
      });

      setOpenAdd(false);
      await loadAll();
      alert("Booking added successfully.");
    } catch (error) {
      console.error("Add booking error:", error);
      alert(error?.response?.data?.message || "Could not save booking.");
    }
  }

  async function handleDeleteBooking(id) {
    if (!window.confirm("Delete this booking?")) return;

    try {
      await API.delete(`/bookings/${id}`);
      await loadAll();
    } catch (error) {
      console.error("Delete booking error:", error);
      alert(error?.response?.data?.message || "Could not delete booking.");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Bookings</h1>
          <p className="text-sm text-slate-400">
            Create, search, and manage hotel bookings.
          </p>
        </div>

        <Button
          onClick={() => {
            if (!rooms.length) {
              alert("No rooms available. Please add rooms first.");
              return;
            }
            setOpenAdd(true);
          }}
        >
          + Add Booking
        </Button>
      </div>

      <motion.div
        whileHover={{ y: -2 }}
        className="rounded-2xl border border-slate-700 bg-slate-900/70 backdrop-blur p-5 shadow-md"
      >
        <input
          placeholder="Search by guest, room, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:max-w-md rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </motion.div>

      <div className="grid grid-cols-1 gap-4">
        {filteredBookings.length === 0 ? (
          <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-6 text-slate-400">
            No bookings found.
          </div>
        ) : (
          filteredBookings.map((booking, index) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5 shadow-md"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h3 className="text-xl font-extrabold text-white">
                    {booking.guest}
                  </h3>
                  <p className="text-slate-300 mt-1">Room: {booking.room}</p>
                  <p className="text-slate-400">Phone: {booking.phone}</p>
                  <p className="text-slate-400">Check In: {booking.checkIn}</p>
                  <p className="text-slate-400">Check Out: {booking.checkOut}</p>
                  <p className="text-slate-400">Status: {booking.status}</p>
                  <p className="text-white font-bold mt-2">
                    Total: LKR {Number(booking.total || 0).toLocaleString()}
                  </p>
                </div>

                <Button
                  variant="danger"
                  onClick={() => handleDeleteBooking(booking.id)}
                >
                  Delete
                </Button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <Modal open={openAdd} onClose={() => setOpenAdd(false)} title="Add Booking">
        <form
          onSubmit={handleAddBooking}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Guest Name
            </label>
            <input
              value={form.guest}
              onChange={(e) => setForm({ ...form, guest: e.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter guest name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Phone
            </label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="0771234567"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Room
            </label>
            <select
              value={form.room}
              onChange={(e) => setForm({ ...form, room: e.target.value })}
              disabled={loadingRooms || rooms.length === 0}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
            >
              {rooms.length === 0 ? (
                <option value="">No rooms available</option>
              ) : (
                rooms.map((r) => (
                  <option key={getRoomId(r)} value={getRoomId(r)}>
                    {roomLabel(r)}
                  </option>
                ))
              )}
            </select>
            {rooms.length === 0 && (
              <p className="mt-2 text-xs text-amber-400">
                No rooms found. Add rooms first in the Rooms page.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Check In
            </label>
            <input
              type="date"
              value={form.checkIn}
              onChange={(e) => setForm({ ...form, checkIn: e.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Check Out
            </label>
            <input
              type="date"
              value={form.checkOut}
              onChange={(e) => setForm({ ...form, checkOut: e.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="md:col-span-2 flex justify-end gap-3 pt-2">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setOpenAdd(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!rooms.length}>
              Save Booking
            </Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
}