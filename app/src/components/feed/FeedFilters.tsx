type FeedFilterOption = {
  label: string;
  value: string;
};

type FeedFilterProps = {
  options: FeedFilterOption[];
  selected: string;
  onSelect?: (value: string) => void;
};

export function FeedFilter({
  options,
  selected,
  onSelect,
}: FeedFilterProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {options?.map((option) => (
        <button
          key={option.value}
          // onClick={() => onSelect(option.value)}
          className={`px-4 py-1.5 rounded-full text-sm transition-colors
            ${
              selected === option.value
                ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold shadow-sm"
                :  "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800 font-medium"
            }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
