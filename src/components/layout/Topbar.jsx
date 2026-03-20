import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import { getAuth, logout } from "../../auth/auth";

export default function Topbar() {
  const navigate = useNavigate();
  const auth = getAuth();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="flex items-center justify-between px-4 md:px-6 h-14">
        <div>
          <div className="text-sm font-semibold text-white">
            Welcome{auth?.name ? `, ${auth.name}` : ""}
          </div>
          <div className="text-xs text-slate-400">
            Role: <span className="capitalize">{auth?.role || "reception"}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            className="hidden sm:block w-72 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Search bookings / guests..."
          />
          <Button variant="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}