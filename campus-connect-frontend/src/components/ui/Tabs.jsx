import { cn } from '../../utils/helpers'
/*
export default function Tabs({ tabs, activeTab, onChange, className }) {
  return (
    <div className={cn('flex gap-1 border-b border-surface-200', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            'px-4 py-2.5 text-sm font-medium transition-colors relative',
            activeTab === tab.value
              ? 'text-brand-600'
              : 'text-surface-500 hover:text-surface-700'
          )}
        >
          {tab.label}
          {activeTab === tab.value && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600 rounded-full" />
          )}
        </button>
      ))}
    </div>
  )
}
*/

export default function Tabs({ tabs, active, onChange }) {
  return (
    <div className="border-b border-neutral-200">
      <div className="flex gap-6">
        {tabs.map((tab) => (
          <button
            key={tab}   // ✅ ADD THIS
            onClick={() => onChange(tab)}
            className={`pb-2 text-sm font-medium ${
              active === tab
                ? "border-b-2 border-sky-600 text-sky-600"
                : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
