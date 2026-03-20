export default function Input({ label, ...props }) {
  return (
    <label className="block">
      <div className="text-xs font-semibold text-slate-600 mb-1">{label}</div>
      <input
        className="w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
        {...props}
      />
    </label>
  );
}