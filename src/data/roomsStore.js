import { emitStoreUpdate } from "./storeEvents";

export const ROOMS_KEY = "hotel_rooms_v1";

const seedRooms = [
  { id: "R201", name: "Double Room • First Floor", floor: "1st Floor", type: "Double", price: 15000, status: "Available" },
  { id: "R202", name: "Double Room • Second Floor", floor: "2nd Floor", type: "Double", price: 20000, status: "Available" },
];

export function getRooms() {
  try {
    const raw = localStorage.getItem(ROOMS_KEY);
    if (!raw) {
      localStorage.setItem(ROOMS_KEY, JSON.stringify(seedRooms));
      return seedRooms;
    }
    return JSON.parse(raw);
  } catch {
    localStorage.setItem(ROOMS_KEY, JSON.stringify(seedRooms));
    return seedRooms;
  }
}

export function saveRooms(list) {
  localStorage.setItem(ROOMS_KEY, JSON.stringify(list));
  emitStoreUpdate();
}

export function setRoomStatus(roomId, status) {
  const rooms = getRooms();
  const next = rooms.map((r) => (r.id === roomId ? { ...r, status } : r));
  saveRooms(next);
}

export function countAvailableRooms() {
  return getRooms().filter((r) => r.status === "Available").length;
}

export function countOccupiedRooms() {
  return getRooms().filter((r) => r.status === "Occupied").length;
}