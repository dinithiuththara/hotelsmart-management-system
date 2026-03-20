import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../components/ui/Button";
import API from "../api";

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
          className="relative w-full max-w-2xl rounded-3xl border border-slate-700 bg-slate-950 p-6 shadow-2xl"
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

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [search, setSearch] = useState("");
  const [openAdd, setOpenAdd] = useState(false);

  const [form, setForm] = useState({
    room_no: "",
    room_name: "",
    room_type: "Double",
    floor: "1st Floor",
    price: "",
    status: "Available",
  });

  useEffect(() => {
    loadRooms();
  }, []);

  async function loadRooms() {
    try {
      const res = await API.get("/rooms");
      setRooms(res.data || []);
    } catch (error) {
      console.error("Failed to load rooms:", error);
      alert("Could not load rooms.");
    }
  }

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const q = search.toLowerCase();
      return (
        String(room.room_no || "").toLowerCase().includes(q) ||
        String(room.room_name || "").toLowerCase().includes(q) ||
        String(room.room_type || "").toLowerCase().includes(q) ||
        String(room.floor || "").toLowerCase().includes(q)
      );
    });
  }, [rooms, search]);

  async function handleAddRoom(e) {
    e.preventDefault();

    if (
      !form.room_no.trim() ||
      !form.room_name.trim() ||
      !form.room_type.trim() ||
      !form.floor.trim() ||
      !form.price
    ) {
      alert("Please fill all room fields.");
      return;
    }

    try {
      await API.post("/rooms", {
        room_no: form.room_no.trim(),
        room_name: form.room_name.trim(),
        room_type: form.room_type,
        floor: form.floor,
        price: Number(form.price),
        status: form.status,
      });

      setForm({
        room_no: "",
        room_name: "",
        room_type: "Double",
        floor: "1st Floor",
        price: "",
        status: "Available",
      });

      setOpenAdd(false);
      loadRooms();
      alert("Room added successfully.");
    } catch (error) {
      console.error("Add room error:", error);
      alert(error?.response?.data?.message || "Could not add room.");
    }
  }

  async function deleteRoom(id) {
    if (!window.confirm("Delete this room?")) return;

    try {
      await API.delete(`/rooms/${id}`);
      loadRooms();
    } catch (error) {
      console.error("Delete room error:", error);
      alert(error?.response?.data?.message || "Could not delete room.");
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
          <h1 className="text-2xl font-extrabold text-white">Rooms</h1>
          <p className="text-sm text-slate-400">
            Manage room details and availability.
          </p>
        </div>

        <Button onClick={() => setOpenAdd(true)}>+ Add Room</Button>
      </div>

      <motion.div
        whileHover={{ y: -2 }}
        className="rounded-2xl border border-slate-700 bg-slate-900/70 backdrop-blur p-5 shadow-md"
      >
        <input
          placeholder="Search by room id, floor, or type..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:max-w-md rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredRooms.length === 0 ? (
          <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-6 text-slate-400">
            No rooms found.
          </div>
        ) : (
          filteredRooms.map((room, index) => (
            <motion.div
              key={room.room_no}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5 shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs text-slate-400">Room</div>
                  <div className="text-2xl font-extrabold text-white">
                    {room.room_no}
                  </div>

                  <p className="text-slate-300 mt-2">{room.room_name}</p>
                  <p className="text-slate-400">Type: {room.room_type}</p>
                  <p className="text-slate-400">Floor: {room.floor}</p>

                  <p className="text-white font-bold mt-2">
                    LKR {Number(room.price || 0).toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <span
                    className={[
                      "inline-flex items-center rounded-full border px-4 py-1 text-xs font-semibold",
                      room.status === "Occupied"
                        ? "bg-rose-500/15 text-rose-200 border-rose-500/30"
                        : "bg-emerald-500/15 text-emerald-200 border-emerald-500/30",
                    ].join(" ")}
                  >
                    {room.status}
                  </span>

                  <Button
                    variant="danger"
                    onClick={() => deleteRoom(room.room_no)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <Modal open={openAdd} onClose={() => setOpenAdd(false)} title="Add Room">
        <form onSubmit={handleAddRoom} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Room ID
            </label>
            <input
              value={form.room_no}
              onChange={(e) => setForm({ ...form, room_no: e.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="R203"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Room Name
            </label>
            <input
              value={form.room_name}
              onChange={(e) => setForm({ ...form, room_name: e.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Double Room • Garden View"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Room Type
            </label>
            <select
              value={form.room_type}
              onChange={(e) => setForm({ ...form, room_type: e.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option>Single</option>
              <option>Double</option>
              <option>Deluxe</option>
              <option>Family</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Floor
            </label>
            <select
              value={form.floor}
              onChange={(e) => setForm({ ...form, floor: e.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option>1st Floor</option>
              <option>2nd Floor</option>
              <option>3rd Floor</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Price
            </label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="18000"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option>Available</option>
              <option>Occupied</option>
              <option>Maintenance</option>
            </select>
          </div>

          <div className="md:col-span-2 flex justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={() => setOpenAdd(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Room</Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
}