export type AccessLevel = 'none' | 'desafio' | 'basico' | 'premium' | 'pro'

export const PLAN_HIERARCHY: Record<AccessLevel, number> = {
  none: 0, desafio: 1, basico: 2, premium: 3, pro: 4,
}

export function canAccess(userLevel: AccessLevel, required: AccessLevel): boolean {
  return PLAN_HIERARCHY[userLevel] >= PLAN_HIERARCHY[required]
}

export function isModuleUnlocked(unlockHours: number, purchasedAt: string): boolean {
  const ms = Date.now() - new Date(purchasedAt).getTime()
  const hours = ms / 3600000
  return hours >= unlockHours
}

export function hoursUntilUnlock(unlockHours: number, purchasedAt: string): number {
  const ms = Date.now() - new Date(purchasedAt).getTime()
  const elapsed = ms / 3600000
  return Math.max(0, unlockHours - elapsed)
}
