// Limite quotidienne par IP — 20 exercices par jour
const dailyUsage = new Map()

export function checkDailyLimit(ip) {
  const today = new Date().toDateString()
  const key = `${ip}:${today}`
  const count = dailyUsage.get(key) || 0

  // Nettoyage des anciennes entrées
  if (dailyUsage.size > 5000) {
    for (const [k] of dailyUsage) {
      if (!k.endsWith(today)) dailyUsage.delete(k)
    }
  }

  if (count >= 20) return { allowed: false, remaining: 0 }

  dailyUsage.set(key, count + 1)
  return { allowed: true, remaining: 19 - count }
}
