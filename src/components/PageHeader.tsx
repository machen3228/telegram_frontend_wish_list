interface PageHeaderProps {
  title?: string
  onBack: () => void
}

export function PageHeader({ title, onBack }: PageHeaderProps) {
  return (
    <div className="friends-page-header">
      <button className="back-btn" onClick={onBack}>← Назад</button>
      {title && <h1 className="friends-page-title">{title}</h1>}
    </div>
  )
}