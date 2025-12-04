import { useState, useRef, useEffect } from "react";

export default function SearchableSelect({
  label,
  options = [],
  value,
  onChange,
  placeholder = "Select...",
  disabled = false,
  error,
  includeNotApplicable = false,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef(null);

  // Filter normal options (not including NA)
  const filtered = options.filter((o) =>
    o.toLowerCase().includes(query.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative mb-4" ref={ref}>
      {label && (
        <label className="block text-gray-700 font-semibold mb-1">
          {label}
        </label>
      )}

      {/* Main Select Box */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        disabled={disabled}
        className={`w-full h-12 px-3.5 rounded-lg border bg-white flex items-center justify-between
          text-sm
          ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}
          ${error ? "border-red-400" : "border-gray-300"}
          focus:outline-none focus:ring-2 focus:ring-emerald-500`}
      >
        <span className={value ? "text-gray-800" : "text-gray-400"}>
          {value || placeholder}
        </span>
        <span className="text-gray-500 text-sm">▼</span>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
          
          {/* Search bar */}
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="w-full p-3 text-sm border-b border-gray-200 outline-none"
          />

          <div className="max-h-60 overflow-y-auto text-sm">

            {/* Not Applicable at the top */}
            {includeNotApplicable && (
              <div
                onClick={() => {
                  onChange("Not Applicable");
                  setQuery("");
                  setOpen(false);
                }}
                className="px-3 py-2 font-medium bg-gray-50 hover:bg-gray-100 cursor-pointer border-b border-gray-200"
              >
                Not Applicable
              </div>
            )}

            {/* Normal options */}
            {filtered.length === 0 ? (
              <div className="px-3 py-2 text-gray-500">No results found</div>
            ) : (
              filtered.map((opt, i) => (
                <div
                  key={i}
                  onClick={() => {
                    onChange(opt);
                    setQuery("");
                    setOpen(false);
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
