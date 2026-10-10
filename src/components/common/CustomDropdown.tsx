import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, Search, X, Sparkles, Filter } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string;
  description?: string;
}

export type DropdownTheme = 'violet' | 'orange' | 'teal' | 'indigo' | 'purple' | 'slate';

export interface CustomDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: (string | DropdownOption)[];
  placeholder?: string;
  label?: string;
  headerTitle?: string;
  icon?: React.ReactNode;
  theme?: DropdownTheme;
  searchable?: boolean;
  align?: 'start' | 'center' | 'end';
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  disabled?: boolean;
  allowClear?: boolean;
}

const THEME_STYLES: Record<
  DropdownTheme,
  {
    triggerBorder: string;
    triggerHoverBorder: string;
    triggerBg: string;
    triggerHoverBg: string;
    iconGradient: string;
    chevronColor: string;
    contentBorder: string;
    headerBg: string;
    headerBadge: string;
    itemHoverBg: string;
    itemHoverText: string;
    itemActiveBg: string;
    itemActiveText: string;
    checkColor: string;
  }
> = {
  violet: {
    triggerBorder: 'border-violet-200',
    triggerHoverBorder: 'hover:border-violet-300',
    triggerBg: 'bg-violet-50/50',
    triggerHoverBg: 'hover:bg-violet-50',
    iconGradient: 'from-violet-500 to-pink-500',
    chevronColor: 'text-violet-400',
    contentBorder: 'border-violet-100',
    headerBg: 'from-violet-50 to-pink-50',
    headerBadge: 'bg-violet-100 text-violet-700',
    itemHoverBg: 'hover:bg-violet-50',
    itemHoverText: 'hover:text-violet-700',
    itemActiveBg: 'bg-violet-100/70',
    itemActiveText: 'text-violet-800',
    checkColor: 'text-violet-600',
  },
  orange: {
    triggerBorder: 'border-orange-200',
    triggerHoverBorder: 'hover:border-orange-300',
    triggerBg: 'bg-orange-50/50',
    triggerHoverBg: 'hover:bg-orange-50',
    iconGradient: 'from-orange-500 to-amber-500',
    chevronColor: 'text-orange-400',
    contentBorder: 'border-orange-100',
    headerBg: 'from-orange-50 to-amber-50',
    headerBadge: 'bg-orange-100 text-orange-700',
    itemHoverBg: 'hover:bg-orange-50',
    itemHoverText: 'hover:text-orange-700',
    itemActiveBg: 'bg-orange-100/70',
    itemActiveText: 'text-orange-800',
    checkColor: 'text-orange-600',
  },
  teal: {
    triggerBorder: 'border-teal-200',
    triggerHoverBorder: 'hover:border-teal-300',
    triggerBg: 'bg-teal-50/50',
    triggerHoverBg: 'hover:bg-teal-50',
    iconGradient: 'from-teal-500 to-emerald-500',
    chevronColor: 'text-teal-400',
    contentBorder: 'border-teal-100',
    headerBg: 'from-teal-50 to-emerald-50',
    headerBadge: 'bg-teal-100 text-teal-700',
    itemHoverBg: 'hover:bg-teal-50',
    itemHoverText: 'hover:text-teal-700',
    itemActiveBg: 'bg-teal-100/70',
    itemActiveText: 'text-teal-800',
    checkColor: 'text-teal-600',
  },
  indigo: {
    triggerBorder: 'border-indigo-200',
    triggerHoverBorder: 'hover:border-indigo-300',
    triggerBg: 'bg-indigo-50/50',
    triggerHoverBg: 'hover:bg-indigo-50',
    iconGradient: 'from-indigo-500 to-blue-500',
    chevronColor: 'text-indigo-400',
    contentBorder: 'border-indigo-100',
    headerBg: 'from-indigo-50 to-blue-50',
    headerBadge: 'bg-indigo-100 text-indigo-700',
    itemHoverBg: 'hover:bg-indigo-50',
    itemHoverText: 'hover:text-indigo-700',
    itemActiveBg: 'bg-indigo-100/70',
    itemActiveText: 'text-indigo-800',
    checkColor: 'text-indigo-600',
  },
  purple: {
    triggerBorder: 'border-purple-200',
    triggerHoverBorder: 'hover:border-purple-300',
    triggerBg: 'bg-purple-50/50',
    triggerHoverBg: 'hover:bg-purple-50',
    iconGradient: 'from-purple-500 to-pink-500',
    chevronColor: 'text-purple-400',
    contentBorder: 'border-purple-100',
    headerBg: 'from-purple-50 to-pink-50',
    headerBadge: 'bg-purple-100 text-purple-700',
    itemHoverBg: 'hover:bg-purple-50',
    itemHoverText: 'hover:text-purple-700',
    itemActiveBg: 'bg-purple-100/70',
    itemActiveText: 'text-purple-800',
    checkColor: 'text-purple-600',
  },
  slate: {
    triggerBorder: 'border-slate-200',
    triggerHoverBorder: 'hover:border-slate-300',
    triggerBg: 'bg-slate-50/60',
    triggerHoverBg: 'hover:bg-slate-50',
    iconGradient: 'from-slate-600 to-slate-800',
    chevronColor: 'text-slate-400',
    contentBorder: 'border-slate-100',
    headerBg: 'from-slate-50 to-slate-100',
    headerBadge: 'bg-slate-200 text-slate-700',
    itemHoverBg: 'hover:bg-slate-100',
    itemHoverText: 'hover:text-slate-900',
    itemActiveBg: 'bg-slate-100',
    itemActiveText: 'text-slate-900 font-extrabold',
    checkColor: 'text-slate-700',
  },
};

export const CustomDropdown: React.FC<CustomDropdownProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Select option',
  label,
  headerTitle,
  icon,
  theme = 'violet',
  searchable,
  align = 'start',
  className,
  triggerClassName,
  contentClassName,
  disabled = false,
  allowClear = true,
}) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const t = THEME_STYLES[theme] || THEME_STYLES.violet;

  // Normalize options to DropdownOption format
  const normalizedOptions: DropdownOption[] = useMemo(() => {
    return options.map((opt) => {
      if (typeof opt === 'string') {
        return { value: opt, label: opt };
      }
      return opt;
    });
  }, [options]);

  // Find currently selected option
  const selectedOption = useMemo(() => {
    return normalizedOptions.find((opt) => opt.value === value);
  }, [normalizedOptions, value]);

  // Automatically enable search if there are more than 5 options and searchable is not explicitly false
  const shouldSearch = searchable ?? (normalizedOptions.length > 5);

  // Filter options by search term
  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return normalizedOptions;
    const lower = searchTerm.toLowerCase();
    return normalizedOptions.filter(
      (opt) =>
        opt.label.toLowerCase().includes(lower) ||
        opt.value.toLowerCase().includes(lower)
    );
  }, [normalizedOptions, searchTerm]);

  const handleSelect = (val: string) => {
    onChange(val);
    setOpen(false);
    setSearchTerm('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setOpen(false);
    setSearchTerm('');
  };

  const displayText = selectedOption
    ? selectedOption.label
    : placeholder;

  return (
    <div className={cn('inline-block text-left', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild disabled={disabled}>
          <motion.button
            type="button"
            whileHover={disabled ? undefined : { scale: 1.02 }}
            whileTap={disabled ? undefined : { scale: 0.98 }}
            className={cn(
              'group flex items-center gap-2 p-1.5 pr-3 rounded-xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 select-none text-left',
              t.triggerBorder,
              t.triggerHoverBorder,
              t.triggerBg,
              t.triggerHoverBg,
              disabled && 'opacity-50 cursor-not-allowed',
              triggerClassName
            )}
          >
            {/* Left badge or icon mirroring account dropdown avatar */}
            <div
              className={cn(
                'w-7 h-7 rounded-lg bg-gradient-to-br text-white flex items-center justify-center font-extrabold text-xs shadow-sm shrink-0',
                t.iconGradient
              )}
            >
              {icon ? (
                icon
              ) : selectedOption?.icon ? (
                selectedOption.icon
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-white" />
              )}
            </div>

            {/* Label and selected text */}
            <div className="flex flex-col min-w-0 pr-1">
              {label && (
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 leading-none">
                  {label}
                </span>
              )}
              <span
                className={cn(
                  'text-xs font-extrabold truncate max-w-[190px]',
                  selectedOption ? 'text-slate-800' : 'text-slate-500'
                )}
                title={displayText}
              >
                {displayText}
              </span>
            </div>

            {/* Chevron or Clear */}
            <div className="ml-auto flex items-center gap-1 shrink-0 pl-1">
              {allowClear && value && !disabled && (
                <span
                  role="button"
                  onClick={handleClear}
                  className="p-0.5 rounded-full hover:bg-slate-200/60 text-slate-400 hover:text-slate-600 transition-colors"
                  title="Clear filter"
                >
                  <X className="w-3 h-3" />
                </span>
              )}
              <ChevronDown
                className={cn(
                  'w-3.5 h-3.5 transition-transform duration-200',
                  t.chevronColor,
                  open && 'rotate-180'
                )}
              />
            </div>
          </motion.button>
        </PopoverTrigger>

        <PopoverContent
          align={align}
          className={cn(
            'w-72 p-2 rounded-2xl shadow-2xl bg-white border z-50',
            t.contentBorder,
            contentClassName
          )}
        >
          {/* Header Card mirroring account dropdown top card */}
          <div
            className={cn(
              'px-3 py-2 border-b rounded-xl mb-1.5 flex items-center justify-between bg-gradient-to-r',
              t.headerBg,
              t.contentBorder
            )}
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <p className="text-xs font-extrabold text-slate-800 truncate">
                {headerTitle || (label ? `Filter by ${label}` : 'Select Option')}
              </p>
            </div>
            <span
              className={cn(
                'px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase shrink-0',
                t.headerBadge
              )}
            >
              {normalizedOptions.length} Items
            </span>
          </div>

          {/* Quick Search */}
          {shouldSearch && (
            <div className="px-1 mb-1.5">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search options..."
                  className="w-full pl-8 pr-7 py-1.5 text-xs font-semibold rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-400 text-slate-700"
                  autoFocus
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto space-y-0.5 pr-0.5 custom-scrollbar">
            {allowClear && (
              <button
                type="button"
                onClick={() => handleSelect('')}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2 text-xs font-bold rounded-xl transition-all text-left',
                  value === ''
                    ? `${t.itemActiveBg} ${t.itemActiveText}`
                    : `text-slate-600 ${t.itemHoverBg} ${t.itemHoverText}`
                )}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="text-xs">✨</span>
                  <span className="truncate">{placeholder}</span>
                </div>
                {value === '' && <Check className={cn('w-3.5 h-3.5 shrink-0 ml-2', t.checkColor)} />}
              </button>
            )}

            {filteredOptions.length === 0 ? (
              <div className="px-3 py-4 text-center text-xs text-slate-400 font-medium">
                No matching options found
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = value === opt.value;
                return (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2 text-xs font-bold rounded-xl transition-all text-left group',
                      isSelected
                        ? `${t.itemActiveBg} ${t.itemActiveText}`
                        : `text-slate-700 ${t.itemHoverBg} ${t.itemHoverText}`
                    )}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                      <span className="truncate">{opt.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      {opt.badge && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-bold group-hover:bg-white">
                          {opt.badge}
                        </span>
                      )}
                      {isSelected && (
                        <Check className={cn('w-3.5 h-3.5 shrink-0', t.checkColor)} />
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CustomDropdown;
