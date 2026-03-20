export default function StatusBadge({ status }) {
  const map = {
    Available: "bg-emerald-500/15 text-emerald-200 border-emerald-500/30",
    Occupied: "bg-rose-500/15 text-rose-200 border-rose-500/30",
    Cleaning: "bg-amber-500/15 text-amber-200 border-amber-500/30",
    Maintenance: "bg-slate-500/15 text-slate-200 border-slate-500/30",
  };

  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur",
        map[status] || "bg-slate-500/15 text-slate-200 border-slate-500/30",
      ].join(" ")}
    >
      {status}
    </span>
  );
}