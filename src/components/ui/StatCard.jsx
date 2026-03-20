import { motion } from "framer-motion";

export default function StatCard({ title, value, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, boxShadow: "0 12px 30px rgba(0,0,0,0.35)" }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5"
    >
      <div className="text-sm text-slate-400">{title}</div>
      <div className="text-3xl font-bold mt-2 text-white">{value}</div>
      <div className="text-xs text-slate-500 mt-1">{subtitle}</div>
    </motion.div>
  );
}