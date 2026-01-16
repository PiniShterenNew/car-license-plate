export function generateCSV(rows: Record<string, string | number | null>[]): string {
  if (rows.length === 0) {
    return ''
  }

  const headers = Object.keys(rows[0])
  const headerRow = headers.join(',')
  
  const dataRows = rows.map((row) => {
    return headers.map((header) => {
      const value = row[header]
      if (value === null || value === undefined) {
        return ''
      }
      // Escape commas and quotes
      const str = String(value)
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`
      }
      return str
    }).join(',')
  })

  return [headerRow, ...dataRows].join('\n')
}
