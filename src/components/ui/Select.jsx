export default function Select({ label, options = [], ...props }) {
  return (
    <label className="block">
      <div className="text-xs font-semibold text-slate-600 mb-1">{label}</div>
      <select
        className="w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}