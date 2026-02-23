type FeedTab = {
  label: string;
  value: string;
};

type FeedTabsProps = {
  tabs: FeedTab[];
  activeTab: string;
  onChange?: (value: string) => void;
};

export function FeedTabs({
  tabs,
  activeTab,
  onChange,
}: FeedTabsProps) {
  return (
    <div className="flex border-b border-gray-200">
      {tabs.map((tab, i) => (
        <button
          key={i}
          // onClick={() => onChange(tab.value)}
          className={`px-4 py-2 text-sm font-medium transition
            ${
              activeTab === tab.value
                ? "border-b-2 border-[#102210] text-[#102210]"
                : "text-gray-500 hover:text-gray-700"
            }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
