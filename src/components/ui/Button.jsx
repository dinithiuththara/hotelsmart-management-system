import { motion } from "framer-motion";

export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-indigo-500";

  const styles = {
    primary:
      "bg-white text-slate-950 hover:bg-slate-200 border border-transparent shadow-md",
    secondary:
      "border border-slate-700 bg-slate-950 text-slate-100 hover:bg-slate-900 shadow-sm",
    danger:
      "bg-rose-600 text-white hover:bg-rose-500 border border-transparent shadow-md",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.04, y: -1 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className={`${base} ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}