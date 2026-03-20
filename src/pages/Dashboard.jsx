import { useEffect, useState } from "react";
import {  useNavigate } from "react-router-dom";
import StatCard from "../components/ui/StatCard";
import Button from "../components/ui/Button";
import StatusBadge from "../components/ui/StatusBadge";
import API from "../api";

import firstFloorImg from "../assets/rooms/first-floor.jpeg";
import secondFloorImg from "../assets/rooms/second-floor.jpeg";
import viewImg from "../assets/rooms/paddy-view.jpeg";
import kitchenImg from "../assets/rooms/kitchen.jpeg";
import bathImg from "../assets/rooms/bathroom.jpeg";
import heroImg from "../assets/hero/hero.jpeg";

function SectionTitle({ title, sub }) {
  return (
    <div className="animate-[fadeInUp_0.5s_ease-out]">
      <h2 className="text-base sm:text-lg font-extrabold tracking-tight text-white">
        {title}
      </h2>
      {sub ? <p className="text-sm text-slate-400 mt-1">{sub}</p> : null}
    </div>
  );
}

function Lightbox({ open, src, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-[fadeIn_0.25s_ease-out]">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-5xl animate-[zoomIn_0.25s_ease-out]">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-slate-800 hover:scale-105"
        >
          ✕ Close
        </button>
        <img
          src={src}
          alt="Preview"
          className="w-full max-h-[82vh] object-contain rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl"
        />
      </div>
    </div>
  );
}

function RoomPhotoCard({ room, onBook }) {
  return (
    <div className="group rounded-3xl border border-slate-800 bg-slate-900/50 shadow-lg overflow-hidden transition duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-slate-700 animate-[fadeInUp_0.6s_ease-out]">
      <div className="relative overflow-hidden">
        <img
          src={room.cover}
          alt={room.title}
          className="h-56 w-full object-cover transition duration-500 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="absolute top-3 left-3 flex gap-2">
          <span className="rounded-full bg-black/40 border border-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
            {room.floor}
          </span>
          <span className="rounded-full bg-black/40 border border-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
            {room.type}
          </span>
        </div>

        <div className="absolute top-3 right-3">
          <StatusBadge status={room.status} />
        </div>

        <div className="absolute bottom-3 left-4 right-4">
          <div className="text-white font-extrabold text-base sm:text-lg">
            {room.title}
          </div>
          <div className="text-white/85 text-xs mt-1">{room.subtitle}</div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Room Code</div>
            <div className="text-sm font-extrabold text-white">{room.code}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-400">Price / night</div>
            <div className="text-sm font-extrabold text-emerald-400">
              LKR {room.price}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {room.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-slate-700 bg-slate-950/80 px-3 py-1 text-xs font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="flex justify-end">
          <Button onClick={() => onBook(room.code)}>Book Now</Button>
        </div>
      </div>
    </div>
  );
}

function HighlightCard({ title, desc }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4 transition duration-300 hover:-translate-y-1 hover:border-slate-700 hover:bg-slate-900/70 hover:shadow-lg animate-[fadeInUp_0.6s_ease-out]">
      <div className="font-extrabold text-white">{title}</div>
      <div className="mt-1 text-slate-300 text-sm">{desc}</div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [lightboxSrc, setLightboxSrc] = useState(null);
  const [stats, setStats] = useState({
    totalRooms: 0,
    occupiedRooms: 0,
    todayCheckins: 0,
    todayRevenue: 0,
  });
  const [rooms, setRooms] = useState([]);

  async function fetchDashboardData() {
    try {
      const [statsRes, roomsRes] = await Promise.all([
        API.get("/stats"),
        API.get("/rooms"),
      ]);

      setStats(statsRes.data);
      setRooms(roomsRes.data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    }
  }

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const quickGallery = [
    heroImg,
    firstFloorImg,
    secondFloorImg,
    viewImg,
    kitchenImg,
    bathImg,
  ];

  const roomCards = [
    {
      code: "R201",
      title: "Double Room • First Floor",
      subtitle: "Beautiful paddy field view • Quiet & private stay",
      floor: "1st Floor",
      type: "Double",
      price: "15,000",
      status:
        rooms.find((r) => String(r.room_no) === "R201")?.status || "Available",
      cover: firstFloorImg,
      tags: ["Private Kitchen", "Private Bathroom", "A/C", "Paddy Field View"],
    },
    {
      code: "R202",
      title: "Double Room • Second Floor",
      subtitle: "Paddy field facing • Fresh air & peaceful vibes",
      floor: "2nd Floor",
      type: "Double",
      price: "20,000",
      status:
        rooms.find((r) => String(r.room_no) === "R202")?.status || "Available",
      cover: secondFloorImg,
      tags: ["Private Kitchen", "Private Bathroom", "A/C", "Paddy Field View"],
    },
  ];

  function handleBookNow(roomCode) {
    navigate("/bookings", { state: { selectedRoom: roomCode, openAdd: true } });
  }

  return (
    <div className="space-y-6">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes zoomIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>

      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/50 shadow-xl animate-[fadeInUp_0.5s_ease-out]">
        <img
          src={heroImg}
          alt="hero"
          className="absolute inset-0 h-full w-full object-cover opacity-30 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/70 to-slate-900/40" />
        <div className="relative p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs font-semibold text-slate-200 backdrop-blur-md">
                HotelSmart • Overview
              </div>

              <h1 className="mt-3 text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                Welcome back 👋
              </h1>

              <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                Bookings update room availability automatically, so your
                dashboard always reflects the latest room status.
              </p>
            </div>

            <div className="flex gap-2 flex-wrap">
              <Button variant="secondary" onClick={() => navigate("/bookings")}>
                View Bookings
              </Button>
              <Button
                onClick={() =>
                  navigate("/bookings", { state: { openAdd: true } })
                }
              >
                + New Booking
              </Button>
            </div>
          </div>
        </div>
        <div className="h-1.5 bg-gradient-to-r from-slate-900 via-indigo-700 to-slate-900" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="animate-[fadeInUp_0.55s_ease-out]">
          <StatCard
            title="Total Rooms"
            value={stats.totalRooms}
            subtitle="All rooms in system"
          />
        </div>

        <div className="animate-[fadeInUp_0.65s_ease-out]">
          <StatCard
            title="Available"
            value={stats.totalRooms - stats.occupiedRooms}
            subtitle="Ready to book"
          />
        </div>

        <div className="animate-[fadeInUp_0.75s_ease-out]">
          <StatCard
            title="Occupied"
            value={stats.occupiedRooms}
            subtitle="Currently occupied"
          />
        </div>

        <div className="animate-[fadeInUp_0.85s_ease-out]">
          <StatCard
            title="Today Revenue"
            value={`LKR ${Number(stats.todayRevenue).toLocaleString()}`}
            subtitle="Revenue from today's check-ins"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-3xl border border-slate-800 bg-slate-900/50 p-6 shadow-lg animate-[fadeInUp_0.7s_ease-out]">
          <SectionTitle
            title="Property Highlights"
            sub="What makes your rooms special."
          />

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <HighlightCard
              title="Private Comfort"
              desc="Separate kitchen + private bathroom in each room."
            />
            <HighlightCard
              title="A/C Rooms"
              desc="Air-conditioned rooms for a comfortable stay."
            />
            <HighlightCard
              title="Paddy Field View"
              desc="Both rooms face a peaceful paddy field."
            />
            <HighlightCard
              title="Two Floors"
              desc="One room on the first floor and one on the second floor."
            />
            <HighlightCard
              title="Fast Check-in"
              desc="Smooth and quick arrival experience for guests."
            />
            <HighlightCard
              title="Peaceful Stay"
              desc="Quiet surroundings ideal for rest and relaxation."
            />
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 shadow-lg animate-[fadeInUp_0.8s_ease-out]">
          <SectionTitle
            title="Quick Gallery"
            sub="Click any photo to view larger."
          />

          <div className="mt-4 grid grid-cols-2 gap-3">
            {quickGallery.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setLightboxSrc(img)}
                className="group overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 transition duration-300 hover:-translate-y-1 hover:border-slate-700 hover:shadow-lg"
              >
                <img
                  src={img}
                  alt={`gallery-${i}`}
                  className="h-28 w-full object-cover transition duration-500 group-hover:scale-110"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <SectionTitle
          title="Room Preview"
          sub="Status reflects bookings automatically."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {roomCards.map((r) => (
            <RoomPhotoCard key={r.code} room={r} onBook={handleBookNow} />
          ))}
        </div>
      </div>

      <Lightbox
        open={!!lightboxSrc}
        src={lightboxSrc}
        onClose={() => setLightboxSrc(null)}
      />
    </div>
  );
}