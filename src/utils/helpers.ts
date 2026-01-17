// Generate a simple UUID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// Format date for display
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Format date to ISO string (YYYY-MM-DD)
export function toISODate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Get today's date as ISO string
export function getTodayISO(): string {
  return toISODate(new Date());
}

// Calculate BMI
export function calculateBMI(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

// Get BMI category
export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return '偏瘦';
  if (bmi < 24) return '正常';
  if (bmi < 28) return '超重';
  return '肥胖';
}

// Get BMI category color class
export function getBMICategoryColor(bmi: number): string {
  if (bmi < 18.5) return 'text-blue-500';
  if (bmi < 24) return 'text-sage-500';
  if (bmi < 28) return 'text-gold-500';
  return 'text-red-400';
}

// Validate weight value
export function validateWeight(weight: number): { valid: boolean; error?: string } {
  if (isNaN(weight)) {
    return { valid: false, error: '请输入有效的数字' };
  }
  if (weight < 20) {
    return { valid: false, error: '体重不能小于 20kg' };
  }
  if (weight > 300) {
    return { valid: false, error: '体重不能大于 300kg' };
  }
  return { valid: true };
}

// Calculate weight change percentage
export function calculateWeightChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

// Sort records by date (newest first)
export function sortRecordsByDate<T extends { date: string }>(records: T[]): T[] {
  return [...records].sort((a, b) => b.date.localeCompare(a.date));
}

// Filter records by date range
export function filterRecordsByDateRange<T extends { date: string }>(
  records: T[],
  days?: number
): T[] {
  if (!days) return records;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  const cutoffISO = cutoffDate.toISOString().split('T')[0];

  return records.filter(record => record.date >= cutoffISO);
}
