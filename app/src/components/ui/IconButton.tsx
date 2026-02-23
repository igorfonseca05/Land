type Props = {
  icon: string
}

export function IconButton({ icon }: Props) {
  return (
    <button className="p-2 rounded-full hover:bg-neutral-100 transition">
      <span className="material-symbols-outlined">{icon}</span>
    </button>
  )
}
