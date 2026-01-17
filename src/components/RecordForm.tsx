import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import type { WeightRecord } from '../types';
import { api } from '../services/api';
import { generateId, getTodayISO, validateWeight, jinToKg, kgToJin, getWeightLabel } from '../utils/helpers';

interface RecordFormProps {
  onSuccess?: () => void;
  existingRecord?: WeightRecord;
  initialDate?: string;
  weightUnit?: 'kg' | 'jin';
}

export function RecordForm({ onSuccess, existingRecord, initialDate, weightUnit = 'jin' }: RecordFormProps) {
  const [date, setDate] = useState(existingRecord?.date || initialDate || getTodayISO());
  const [weight, setWeight] = useState('');
  const [note, setNote] = useState(existingRecord?.note || '');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize weight input value based on unit
  useEffect(() => {
    if (existingRecord?.weight !== undefined) {
      const displayWeight = weightUnit === 'jin' ? kgToJin(existingRecord.weight) : existingRecord.weight;
      setWeight(displayWeight.toString());
    }
  }, [existingRecord, weightUnit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const weightNum = parseFloat(weight);

    // Validate weight in the display unit
    const validation = validateWeight(weightNum, weightUnit);
    if (!validation.valid) {
      setError(validation.error || '输入无效');
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert to kg for storage
      const weightKg = weightUnit === 'jin' ? jinToKg(weightNum) : weightNum;

      const record: WeightRecord = {
        id: existingRecord?.id || generateId(),
        date,
        weight: weightKg,
        note: note.trim() || undefined,
        created_at: existingRecord?.created_at || new Date().toISOString(),
      };

      await api.saveRecord(record);
      onSuccess?.();

      // Reset form if it's a new record
      if (!existingRecord) {
        setDate(initialDate || getTodayISO());
        setWeight('');
        setNote('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存失败');
    } finally {
      setIsSubmitting(false);
    }
  };

  const unitLabel = getWeightLabel(weightUnit);
  const minWeight = weightUnit === 'jin' ? 40 : 20;
  const maxWeight = weightUnit === 'jin' ? 600 : 300;
  const placeholder = weightUnit === 'jin' ? '141' : '70.5';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-100 border-2 border-red-300 text-red-700 rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="date" className="block text-deep-rose font-medium mb-2">
          日期
        </label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="input"
          required
        />
      </div>

      <div>
        <label htmlFor="weight" className="block text-deep-rose font-medium mb-2">
          体重 ({unitLabel})
        </label>
        <input
          type="number"
          id="weight"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          step="0.1"
          min={minWeight}
          max={maxWeight}
          placeholder={placeholder}
          className="input"
          required
        />
      </div>

      <div>
        <label htmlFor="note" className="block text-deep-rose font-medium mb-2">
          备注 (可选)
        </label>
        <textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="记录一些备注..."
          className="input resize-none"
          rows={3}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />
        {isSubmitting ? '保存中...' : existingRecord ? '更新记录' : '添加记录'}
      </button>
    </form>
  );
}
