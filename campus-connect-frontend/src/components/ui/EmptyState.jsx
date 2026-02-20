import Button from './Button'

export default function EmptyState({ icon: Icon, title, description, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && (
        <div className="mb-4 rounded-full bg-surface-100 p-4">
          <Icon className="h-8 w-8 text-surface-400" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-surface-900">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-surface-500">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-4">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
