import { Timestamp, FieldValue } from 'firebase/firestore'


export function createSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD") // separa acentos
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .replace(/[^a-z0-9\s-]/g, "") // remove caracteres especiais
    .trim()
    .replace(/\s+/g, "-") // espaços → hífen
    .replace(/-+/g, "-"); // evita hífens duplicados
}

export function createPublicId(name: string): string {
  const firstName =  name.split(/\s+/)[0]
  return `${firstName}-${crypto.randomUUID()}`
}


export function formatFirebaseTime(
  value: Timestamp | FieldValue | undefined
): string {
  if (!value || !(value instanceof Timestamp)) {
    return 'agora'
  }

  const date = value.toDate()
  const now = new Date()

  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffSec < 60) return `${diffSec} segundo${diffSec !== 1 ? 's' : ''}`
  if (diffMin < 60) return `${diffMin} minuto${diffMin !== 1 ? 's' : ''}`
  if (diffHour < 24) return `${diffHour} hora${diffHour !== 1 ? 's' : ''}`
  if (diffDay === 1) return 'ontem'

  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export function getUpperCaseLatter(text: string = "") {
    return text.slice(0, 1).toUpperCase() + text.slice(1);
  }

