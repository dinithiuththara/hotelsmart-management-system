import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../components/ui/Button";

const GUEST_KEY = "hotel_guests_v1";

function getGuests() {
  try {
    return JSON.parse(localStorage.getItem(GUEST_KEY)) || [];
  } catch {
    return [];
  }
}

function saveGuests(list) {
  localStorage.setItem(GUEST_KEY, JSON.stringify(list));
}

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

export default function Guests() {
  const [guests, setGuests] = useState([]);
  const [search, setSearch] = useState("");
  const [openAdd, setOpenAdd] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    setGuests(getGuests());
  }, []);

  const filteredGuests = useMemo(() => {
    return guests.filter((guest) => {
      const q = search.toLowerCase();
      return (
        guest.name.toLowerCase().includes(q) ||
        guest.phone.toLowerCase().includes(q) ||
        guest.email.toLowerCase().includes(q)
      );
    });
  }, [guests, search]);

  function addGuest(e) {
    e.preventDefault();

    if (!name || !phone || !email) {
      alert("Please fill all guest fields.");
      return;
    }

    const newGuest = {
      id: `G${Date.now().toString().slice(-6)}`,
      name,
      phone,
      email,
    };

    const updated = [newGuest, ...guests];
    saveGuests(updated);
    setGuests(updated);

    setName("");
    setPhone("");
    setEmail("");
    setOpenAdd(false);
  }

  function deleteGuest(id) {
    if (!window.confirm("Delete this guest?")) return;
    const updated = guests.filter((g) => g.id !== id);
    saveGuests(updated);
    setGuests(updated);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Guests</h1>
          <p className="text-sm text-slate-400">Manage guest profiles professionally.</p>
        </div>

        <Button onClick={() => setOpenAdd(true)}>+ Add Guest</Button>
      </div>

      <motion.div
        whileHover={{ y: -2 }}
        className="rounded-2xl border border-slate-700 bg-slate-900/70 backdrop-blur p-5 shadow-md"
      >
        <input
          placeholder="Search by name, phone, or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:max-w-md rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </motion.div>

      <div className="grid grid-cols-1 gap-4">
        {filteredGuests.length === 0 ? (
          <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-6 text-slate-400">
            No guests found.
          </div>
        ) : (
          filteredGuests.map((guest, index) => (
            <motion.div
              key={guest.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5 shadow-md"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h3 className="text-xl font-extrabold text-white">{guest.name}</h3>
                  <p className="text-slate-300 mt-1">Phone: {guest.phone}</p>
                  <p className="text-slate-400">Email: {guest.email}</p>
                </div>

                <Button variant="danger" onClick={() => deleteGuest(guest.id)}>
                  Delete
                </Button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <Modal open={openAdd} onClose={() => setOpenAdd(false)} title="Add Guest">
        <form onSubmit={addGuest} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Guest name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Phone
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="0771234567"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="guest@email.com"
            />
          </div>

          <div className="md:col-span-2 flex justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={() => setOpenAdd(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Guest</Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
}