import { motion } from "framer-motion";

export default function AnimatedCard({ children, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`rounded-2xl border border-slate-700 bg-slate-900/70 backdrop-blur shadow-md ${className}`}
    >
      {children}
    </motion.div>
  );
}