export const rooms = [
  { id: "R101", type: "Single", price: 12000, status: "Available" },
  { id: "R102", type: "Double", price: 18000, status: "Occupied" },
  { id: "R103", type: "Deluxe", price: 25000, status: "Cleaning" },
  { id: "R104", type: "Family", price: 30000, status: "Maintenance" },
  { id: "R105", type: "Single", price: 12000, status: "Available" },
];

export const bookings = [
  {
    id: "B001",
    guest: "Dinithi Uththara",
    phone: "0771234567",
    room: "R102",
    checkIn: "2026-03-02",
    checkOut: "2026-03-05",
    status: "Checked-in",
  },
  {
    id: "B002",
    guest: "Kavindu Perera",
    phone: "0719876543",
    room: "R101",
    checkIn: "2026-03-04",
    checkOut: "2026-03-06",
    status: "Reserved",
  },
];