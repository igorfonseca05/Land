type Props = React.ButtonHTMLAttributes<HTMLButtonElement>

export function Button({ className = "", ...props }: Props) {
  return (
    <button
      {...props}
      className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${className}`}
    />
  )
}
