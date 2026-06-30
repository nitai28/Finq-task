interface FilterInputProps {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}

function FilterInput({ placeholder, value, onChange }: FilterInputProps) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
    />
  );
}

interface FilterBarProps {
  nameFilter: string;
  countryFilter: string;
  onNameChange: (v: string) => void;
  onCountryChange: (v: string) => void;
}

export function FilterBar({ nameFilter, countryFilter, onNameChange, onCountryChange }: FilterBarProps) {
  return (
    <div className="flex gap-3 mb-4">
      <FilterInput placeholder="Filter by name..." value={nameFilter} onChange={onNameChange} />
      <FilterInput placeholder="Filter by country..." value={countryFilter} onChange={onCountryChange} />
    </div>
  );
}
