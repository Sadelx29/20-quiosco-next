export function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount)
}

export function getImagePath(imagePath: string) {
    const cloudinaryBaseUrl = 'https://res.cloudinary.com'
    if(imagePath.startsWith(cloudinaryBaseUrl)) {
        return imagePath
    } else {
        return `/products/${imagePath}.jpg`
    }
}

// utils/time.ts
export function getLocalDayRange(timezone = 'America/Santo_Domingo') {
    const today = new Date()
  
    const start = new Date(
      today.toLocaleString('en-US', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    )
  
    const end = new Date(start)
    end.setHours(23, 59, 59, 999)
  
    return { start, end }
  }
  