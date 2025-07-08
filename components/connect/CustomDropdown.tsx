import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface CustomDropdownProps {
  label?: string;
  options: string[] | { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const CustomDropdown: React.FC<CustomDropdownProps> = ({ label, options, value, onChange, placeholder }) => {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number; width: number }>({ top: 0, left: 0, width: 0 });

  // Normalize options to {label, value}
  const normalizedOptions = Array.isArray(options) && typeof options[0] === 'string'
    ? (options as string[]).map(opt => ({ label: opt, value: opt }))
    : (options as { label: string; value: string }[]);

  // Check if 'All' is already present
  const hasAllOption = normalizedOptions.some(opt => opt.label === 'All' && opt.value === '');

  const filteredOptions = normalizedOptions.filter(opt =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  // Open menu and set position
  const handleOpen = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setMenuPosition({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX, width: rect.width });
    }
    setOpen(true);
  };

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node) &&
        document.getElementById('dropdown-menu') &&
        !(document.getElementById('dropdown-menu') as HTMLElement).contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  // Portal dropdown menu
  const menu = open ? createPortal(
    <div
      id="dropdown-menu"
      className="absolute bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-[9999] max-h-60 overflow-y-auto"
      style={{ top: menuPosition.top, left: menuPosition.left, width: menuPosition.width, position: 'absolute' }}
    >
      <input
        className="w-full px-3 py-2 border-b border-gray-700 text-sm focus:outline-none bg-gray-800 text-white placeholder-gray-400"
        placeholder="Search..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        autoFocus
        onClick={e => e.stopPropagation()}
        aria-label={`Search ${placeholder || label || ''}`}
      />
      <div>
        {/* Only show 'All' if not already present in options */}
        {!hasAllOption && (
          <div
            className={`px-3 py-2 cursor-pointer hover:bg-blue-900/20 ${value === '' ? 'bg-blue-900/30 font-bold text-white' : 'text-gray-200'}`}
            onClick={e => { e.stopPropagation(); onChange(''); setOpen(false); setSearch(''); }}
          >
            All
          </div>
        )}
        {filteredOptions.map(opt => (
          <div
            key={opt.value}
            className={`px-3 py-2 cursor-pointer hover:bg-blue-900/20 ${value === opt.value ? 'bg-blue-900/30 font-bold text-white' : 'text-gray-200'}`}
            onClick={e => { e.stopPropagation(); onChange(opt.value); setOpen(false); setSearch(''); }}
          >
            {opt.label}
          </div>
        ))}
        {filteredOptions.length === 0 && (
          <div className="px-3 py-2 text-gray-400 text-sm">No options</div>
        )}
      </div>
    </div>,
    document.body
  ) : null;

  // Visually hidden label for accessibility
  const hiddenLabel = placeholder || label || 'Filter';

  return (
    <>
      <div
        ref={triggerRef}
        className="relative w-full min-w-[120px] z-[100]"
        onClick={handleOpen}
        tabIndex={0}
        style={{ cursor: 'pointer' }}
        aria-label={hiddenLabel}
      >
        <span className="sr-only">{hiddenLabel}</span>
        <div
          className="w-full h-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm flex items-center focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-400 focus:border-blue-400 dark:focus:border-blue-400 transition z-[100]"
        >
          <span className={value ? 'text-black' : 'text-gray-400'}>
            {normalizedOptions.find(opt => opt.value === value)?.label || placeholder || label || 'All'}
          </span>
          <span className="ml-auto text-gray-400 dark:text-gray-500">▼</span>
        </div>
      </div>
      {menu}
    </>
  );
}; 