import { useState } from "react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { findBookingByIdAndPhone } from "../data/bookingsStore";

export default function GuestCheck() {
  const [bookingId, setBookingId] = useState("");
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);

  function handleSearch(e) {
    e.preventDefault();
    const booking = findBookingByIdAndPhone(bookingId, phone);
    setResult(booking);
    setSearched(true);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl space-y-4">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h1 className="text-xl font-extrabold">Check Your Booking</h1>
          <p className="text-sm text-slate-500 mt-1">
            Enter your Booking ID and phone number to view your reservation.
          </p>

          <form className="mt-4 space-y-3" onSubmit={handleSearch}>
            <Input
              label="Booking ID"
              placeholder="Eg: B001"
              value={bookingId}
              onChange={(e) => setBookingId(e.target.value)}
            />
            <Input
              label="Phone Number"
              placeholder="Eg: 0771234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <Button type="submit" className="w-full">
              Search Booking
            </Button>

            <div className="text-xs text-slate-500">
              Tip: Use the same phone number used at booking time.
            </div>
          </form>
        </div>

        {searched && (
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            {!result ? (
              <div>
                <div className="text-base font-bold text-rose-700">
                  Booking not found
                </div>
                <p className="text-sm text-slate-600 mt-1">
                  Please check the Booking ID and phone number and try again.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs text-slate-500">Booking ID</div>
                    <div className="text-lg font-extrabold">{result.id}</div>
                  </div>
                  <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold">
                    {result.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 text-sm">
                  <div className="rounded-xl border bg-slate-50 p-3">
                    <div className="text-xs text-slate-500">Guest</div>
                    <div className="font-semibold">{result.guest}</div>
                  </div>
                  <div className="rounded-xl border bg-slate-50 p-3">
                    <div className="text-xs text-slate-500">Phone</div>
                    <div className="font-semibold">{result.phone}</div>
                  </div>
                  <div className="rounded-xl border bg-slate-50 p-3">
                    <div className="text-xs text-slate-500">Room</div>
                    <div className="font-semibold">{result.room}</div>
                  </div>
                  <div className="rounded-xl border bg-slate-50 p-3">
                    <div className="text-xs text-slate-500">Dates</div>
                    <div className="font-semibold">
                      {result.checkIn} → {result.checkOut}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-500 mt-3">
                  If you need changes, please contact reception with your Booking ID.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}