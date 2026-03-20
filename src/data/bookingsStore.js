import { emitStoreUpdate } from "./storeEvents";
import { getRooms, saveRooms } from "./roomsStore";

export const BOOKINGS_KEY = "hotel_bookings_v1";

const seedBookings = [];

export function getBookings() {
  try {
    const raw = localStorage.getItem(BOOKINGS_KEY);
    if (!raw) {
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(seedBookings));
      return seedBookings;
    }
    return JSON.parse(raw);
  } catch {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(seedBookings));
    return seedBookings;
  }
}

export function saveBookings(list) {
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(list));
  emitStoreUpdate();
}

/**
 * A booking is "active" if it is NOT Cancelled and NOT Checked-out
 * Active bookings make the room NOT available.
 */
export function isActiveBooking(b) {
  const s = String(b.status || "").toLowerCase();
  return s !== "cancelled" && s !== "checked-out";
}

/**
 * Recompute rooms status based on active bookings
 * - if a room has any active booking => Occupied
 * - else => Available
 */
export function syncRoomsFromBookings(bookings = getBookings()) {
  const rooms = getRooms();

  const activeRoomIds = new Set(
    bookings.filter(isActiveBooking).map((b) => String(b.room).toUpperCase())
  );

  const nextRooms = rooms.map((r) => ({
    ...r,
    status: activeRoomIds.has(String(r.id).toUpperCase()) ? "Occupied" : "Available",
  }));

  saveRooms(nextRooms);
  emitStoreUpdate();
}

/**
 * Add booking + auto-sync room status
 */
export function addBooking(payload) {
  const list = getBookings();
  const next = [payload, ...list];
  saveBookings(next);
  syncRoomsFromBookings(next);
}

/**
 * Delete booking + auto-sync room status
 */
export function deleteBooking(id) {
  const list = getBookings();
  const next = list.filter((b) => b.id !== id);
  saveBookings(next);
  syncRoomsFromBookings(next);
}

export function countActiveBookings() {
  return getBookings().filter(isActiveBooking).length;
}

export function calcNights(checkIn, checkOut) {
  const d1 = new Date(checkIn);
  const d2 = new Date(checkOut);
  const ms = d2 - d1;
  const days = Math.ceil(ms / (1000 * 60 * 60 * 24));
  return isNaN(days) ? 0 : Math.max(0, days);
}