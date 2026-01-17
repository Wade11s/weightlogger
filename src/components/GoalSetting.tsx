import { useState, useEffect } from 'react';
import { Target } from 'lucide-react';
import type { Goal } from '../types';
import { api } from '../services/api';

interface GoalSettingProps {
  onGoalChange?: (goal: Goal | null) => void;
}

export function GoalSetting({ onGoalChange }: GoalSettingProps) {
  const [goal, setGoal] = useState<Goal | null>(null);
  const [targetWeight, setTargetWeight] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadGoal();
  }, []);

  const loadGoal = async () => {
    try {
      const goalData = await api.getGoal();
      setGoal(goalData);
      if (goalData) {
        setTargetWeight(goalData.target_weight.toString());
        setTargetDate(goalData.target_date || '');
      }
    } catch (err) {
      console.error('Failed to load goal:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    const weight = parseFloat(targetWeight);

    if (isNaN(weight) || weight < 20 || weight > 300) {
      setMessage('请输入有效的体重 (20-300kg)');
      setIsSubmitting(false);
      return;
    }

    try {
      const newGoal: Goal = {
        target_weight: weight,
        target_date: targetDate || undefined,
        created_at: goal?.created_at || new Date().toISOString(),
      };

      await api.updateGoal(newGoal);
      setGoal(newGoal);
      onGoalChange?.(newGoal);
      setMessage('目标已保存！');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : '保存失败');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('确定要删除目标吗？')) {
      return;
    }

    try {
      // Setting an empty goal will delete it in the backend
      await api.updateGoal({
        target_weight: 0,
        created_at: new Date().toISOString(),
      } as Goal);
      setGoal(null);
      setTargetWeight('');
      setTargetDate('');
      onGoalChange?.(null);
      setMessage('目标已删除');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : '删除失败');
    }
  };

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-pink-400" />
          <h3 className="text-lg font-heading text-deep-rose">目标设定</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="targetWeight" className="block text-deep-rose font-medium mb-2">
              目标体重 (kg)
            </label>
            <input
              type="number"
              id="targetWeight"
              value={targetWeight}
              onChange={(e) => setTargetWeight(e.target.value)}
              step="0.1"
              min="20"
              max="300"
              placeholder="65"
              className="input"
              required
            />
          </div>

          <div>
            <label htmlFor="targetDate" className="block text-deep-rose font-medium mb-2">
              目标日期 (可选)
            </label>
            <input
              type="date"
              id="targetDate"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="input"
            />
          </div>

          {message && (
            <div className={`text-sm ${message.includes('删除') || message.includes('失败') ? 'text-red-400' : 'text-sage-500'}`}>
              {message}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex-1"
            >
              {isSubmitting ? '保存中...' : '保存目标'}
            </button>

            {goal && (
              <button
                type="button"
                onClick={handleDelete}
                className="btn-secondary text-red-400 border-red-300 hover:bg-red-50"
              >
                删除目标
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Goal Summary */}
      {goal && (
        <div className="card">
          <h4 className="text-md font-heading text-deep-rose mb-3">当前目标</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-plum">目标体重</span>
              <span className="font-medium text-deep-rose">{goal.target_weight} kg</span>
            </div>
            {goal.target_date && (
              <div className="flex justify-between">
                <span className="text-muted-plum">目标日期</span>
                <span className="font-medium text-deep-rose">
                  {new Date(goal.target_date).toLocaleDateString('zh-CN')}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
