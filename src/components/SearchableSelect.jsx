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
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const ref = useRef(null);
  const searchRef = useRef(null);

  // Filter options based on search
  const filtered = options.filter((o) =>
    o.toLowerCase().includes(query.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Focus search + reset highlight when opening
  useEffect(() => {
    if (open) {
      setHighlightedIndex(0);
      setTimeout(() => {
        searchRef.current?.focus();
      }, 0);
    }
  }, [open]);

  // Total options count (including Not Applicable if enabled)
  const totalOptions = includeNotApplicable
    ? filtered.length + 1
    : filtered.length;

  return (
    <div className="relative mb-4" ref={ref}>
      {label && (
        <label className="block text-gray-700 font-semibold mb-1">
          {label}
        </label>
      )}

      {/* Main Select Button */}
      <button
        type="button"
        disabled={disabled}
        tabIndex={0}
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(true);
          }

          if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
          }
        }}
        className={`w-full h-12 px-3.5 rounded-lg border bg-white flex items-center justify-between text-sm
          ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}
          ${error ? "border-red-400" : "border-gray-300"}
          focus:outline-none focus:ring-2 focus:ring-emerald-500`}
      >
        <span className={value ? "text-gray-800" : "text-gray-400"}>
          {value || placeholder}
        </span>
        <span className="text-gray-500 text-sm">▼</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
          
          {/* Search Input */}
          <input
            ref={searchRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setHighlightedIndex(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setHighlightedIndex((prev) =>
                  prev < totalOptions - 1 ? prev + 1 : prev
                );
              }

              if (e.key === "ArrowUp") {
                e.preventDefault();
                setHighlightedIndex((prev) =>
                  prev > 0 ? prev - 1 : 0
                );
              }

              if (e.key === "Enter") {
                e.preventDefault();

                if (includeNotApplicable && highlightedIndex === 0) {
                  onChange("Not Applicable");
                } else {
                  const index = includeNotApplicable
                    ? highlightedIndex - 1
                    : highlightedIndex;

                  const selected = filtered[index];
                  if (selected) onChange(selected);
                }

                setQuery("");
                setOpen(false);
              }

              if (e.key === "Escape") {
                setOpen(false);
              }
            }}
            placeholder="Search..."
            className="w-full p-3 text-sm border-b border-gray-200 outline-none"
          />

          {/* Options */}
          <div className="max-h-60 overflow-y-auto text-sm">

            {/* Not Applicable */}
            {includeNotApplicable && (
              <div
                onMouseEnter={() => setHighlightedIndex(0)}
                onClick={() => {
                  onChange("Not Applicable");
                  setQuery("");
                  setOpen(false);
                }}
                className={`px-3 py-2 font-medium border-b border-gray-200 cursor-pointer
                  ${
                    highlightedIndex === 0
                      ? "bg-emerald-100"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
              >
                Not Applicable
              </div>
            )}

            {/* Normal Options */}
            {filtered.length === 0 ? (
              <div className="px-3 py-2 text-gray-500">
                No results found
              </div>
            ) : (
              filtered.map((opt, i) => {
                const optionIndex = includeNotApplicable ? i + 1 : i;

                return (
                  <div
                    key={i}
                    onMouseEnter={() => setHighlightedIndex(optionIndex)}
                    onClick={() => {
                      onChange(opt);
                      setQuery("");
                      setOpen(false);
                    }}
                    className={`px-3 py-2 cursor-pointer
                      ${
                        highlightedIndex === optionIndex
                          ? "bg-emerald-100"
                          : "hover:bg-gray-100"
                      }`}
                  >
                    {opt}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
}
