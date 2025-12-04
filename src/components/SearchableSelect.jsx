import { useState, useRef, useEffect } from "react";

export default function SearchableSelect({
  label,
  options = [],
  value,
  onChange,
  placeholder = "Select...",
  disabled = false,
  error,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef(null);

  const filtered = options.filter((o) =>
    o.toLowerCase().includes(query.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const check = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", check);
    return () => document.removeEventListener("mousedown", check);
  }, []);

  return (
    <div className="relative mb-3" ref={ref}>
      {label && (
        <label className="block text-gray-700 font-medium mb-1.5">
          {label}
        </label>
      )}

      {/* Compact Input */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className={`w-full h-11 px-3 text-left border rounded-lg bg-white flex justify-between items-center
          ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}
          ${error ? "border-red-300" : "border-gray-300"}
          focus:outline-none focus:ring-2 focus:ring-emerald-500 transition`}
      >
        <span className={value ? "text-gray-900" : "text-gray-400"}>
          {value || placeholder}
        </span>

        {/* Smaller arrow */}
        <span className="text-gray-500 text-xs">▼</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-md">
          {/* Search bar */}
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="w-full p-2.5 text-sm border-b border-gray-200 outline-none"
          />

          {/* Options */}
          <div className="max-h-48 overflow-y-auto text-sm">
            {filtered.length === 0 ? (
              <div className="p-3 text-gray-500">No results</div>
            ) : (
              filtered.map((opt, i) => (
                <div
                  key={i}
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                    setQuery("");
                  }}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {opt}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
