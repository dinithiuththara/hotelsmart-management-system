import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { login } from "../auth/auth";

export default function Login() {
  const navigate = useNavigate();

  const [name, setName] = useState("Dinithi");
  const [email, setEmail] = useState("dinithi@example.com");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");

  function handleLogin(e) {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim()) {
      alert("Please fill name, email, and password.");
      return;
    }

    login({
      role,
      name: name.trim(),
      email: email.trim(),
    });

    navigate("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-900/70 backdrop-blur p-8 shadow-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold text-white tracking-tight">
            HotelSmart
          </h1>
          <p className="text-slate-400 mt-3 text-lg">
            Hotel Management System
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-3xl font-extrabold text-white">Login</h2>
          <p className="text-slate-400 mt-2">
            Sign in and continue to dashboard
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-5 py-4 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-5 py-4 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-5 py-4 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your password"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-5 py-4 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="reception">Receptionist</option>
            </select>
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="w-full rounded-2xl bg-white text-slate-950 font-bold py-4 text-lg shadow-lg hover:bg-slate-200 transition"
          >
            Login
          </motion.button>
        </form>

      <p className="text-center text-slate-500 text-sm mt-8">
  Sign in to continue to HotelSmart dashboard
</p>
      </motion.div>
    </div>
  );
}