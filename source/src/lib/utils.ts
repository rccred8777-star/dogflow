import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatHours(hours: number): string {
  if (hours < 1) return `${Math.ceil(hours * 60)} minutos`
  if (hours < 24) return `${Math.ceil(hours)} horas`
  return `${Math.ceil(hours / 24)} dias`
}
