interface AvatarProps {
  avatarUrl: string | null
  initial: string
  alt?: string
  className?: string
}

export function Avatar({ avatarUrl, initial, alt = 'Avatar', className = 'avatar' }: AvatarProps) {
  return avatarUrl ? (
    <img src={avatarUrl} alt={alt} className={className} />
  ) : (
    <div className={`${className} ${className}-placeholder`}>
      {initial}
    </div>
  )
}