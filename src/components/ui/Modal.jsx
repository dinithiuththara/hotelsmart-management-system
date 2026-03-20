export default function Modal({ open, title, children, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-4 shadow-xl">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="font-bold">{title}</div>
          <button
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm hover:bg-slate-100"
          >
            ✕
          </button>
        </div>
        <div className="pt-3">{children}</div>
      </div>
    </div>
  );
}