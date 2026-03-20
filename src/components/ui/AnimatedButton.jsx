import { motion } from "framer-motion";

export default function AnimatedButton({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
  ...props
}) {
  const styles = {
    primary:
      "bg-white text-slate-950 hover:bg-slate-200 border border-transparent",
    secondary:
      "bg-slate-900 text-white border border-slate-700 hover:bg-slate-800",
    danger:
      "bg-rose-600 text-white border border-transparent hover:bg-rose-500",
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      whileHover={{ scale: 1.04, y: -1 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 320, damping: 20 }}
      className={`rounded-xl px-4 py-2 text-sm font-semibold shadow-sm transition ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}