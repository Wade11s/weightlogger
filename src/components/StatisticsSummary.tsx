import { useMemo } from 'react';
import { memo } from 'react';
import type { WeightRecord, UserProfile } from '../types';
import { calculateBMI, getBMICategory, getBMICategoryColor, filterRecordsByDateRange, formatWeight, getWeightLabel } from '../utils/helpers';

interface StatisticsSummaryProps {
  records: WeightRecord[];
  profile?: UserProfile | null;
  days?: number;
  weightUnit?: 'kg' | 'jin';
}

function StatisticsSummaryComponent({ records, profile, days, weightUnit = 'jin' }: StatisticsSummaryProps) {
  const unitLabel = getWeightLabel(weightUnit);

  const stats = useMemo(() => {
    const filtered = filterRecordsByDateRange(records, days);

    if (filtered.length === 0) {
      return null;
    }

    const sorted = [...filtered].sort((a, b) => a.date.localeCompare(b.date));
    const latest = sorted[sorted.length - 1];
    const earliest = sorted[0];
    const weights = sorted.map(r => r.weight);

    const currentWeight = latest.weight;
    const startWeight = earliest.weight;
    const weightChange = currentWeight - startWeight;
    const weightChangePercent = startWeight > 0 ? (weightChange / startWeight) * 100 : 0;

    const avgWeight = weights.reduce((sum, w) => sum + w, 0) / weights.length;
    const maxWeight = Math.max(...weights);
    const minWeight = Math.min(...weights);

    const bmi = profile ? calculateBMI(currentWeight, profile.height) : null;
    const bmiCategory = bmi ? getBMICategory(bmi) : null;

    return {
      currentWeight,
      startWeight,
      weightChange,
      weightChangePercent,
      avgWeight,
      maxWeight,
      minWeight,
      bmi,
      bmiCategory,
      recordCount: filtered.length,
    };
  }, [records, profile, days]);

  if (!stats) {
    return (
      <div className="card text-center py-12">
        <p className="text-muted-plum">该时间段内没有记录</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Current Weight */}
      <div className="card">
        <p className="text-xs text-muted-plum mb-1">当前体重</p>
        <p className="text-2xl font-heading text-deep-rose">
          {formatWeight(stats.currentWeight, weightUnit)}
          <span className="text-sm text-muted-plum ml-1">{unitLabel}</span>
        </p>
      </div>

      {/* Weight Change */}
      <div className="card">
        <p className="text-xs text-muted-plum mb-1">变化</p>
        <p className={`text-2xl font-heading ${stats.weightChange < 0 ? 'text-sage-500' : 'text-red-400'}`}>
          {stats.weightChange > 0 ? '+' : ''}{formatWeight(stats.weightChange, weightUnit)}
          <span className="text-sm ml-1">{unitLabel}</span>
        </p>
        <p className={`text-xs ${stats.weightChange < 0 ? 'text-sage-500' : 'text-red-400'}`}>
          {stats.weightChangePercent > 0 ? '+' : ''}{stats.weightChangePercent.toFixed(1)}%
        </p>
      </div>

      {/* Average Weight */}
      <div className="card">
        <p className="text-xs text-muted-plum mb-1">平均体重</p>
        <p className="text-2xl font-heading text-deep-rose">
          {formatWeight(stats.avgWeight, weightUnit)}
          <span className="text-sm text-muted-plum ml-1">{unitLabel}</span>
        </p>
      </div>

      {/* Min/Max */}
      <div className="card">
        <p className="text-xs text-muted-plum mb-1">最低/最高</p>
        <p className="text-lg font-heading text-deep-rose">
          {formatWeight(stats.minWeight, weightUnit)} / {formatWeight(stats.maxWeight, weightUnit)}
        </p>
      </div>

      {/* BMI */}
      {profile && stats.bmi !== null && (
        <div className="card col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-plum mb-1">BMI</p>
              <p className="text-2xl font-heading text-deep-rose">
                {stats.bmi.toFixed(1)}
              </p>
            </div>
            {stats.bmiCategory && (
              <div className={`text-lg font-medium ${getBMICategoryColor(stats.bmi)}`}>
                {stats.bmiCategory}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Record Count */}
      <div className="card col-span-2">
        <p className="text-xs text-muted-plum mb-1">记录数量</p>
        <p className="text-lg font-heading text-deep-rose">
          {stats.recordCount} 条记录
        </p>
      </div>
    </div>
  );
}

export const StatisticsSummary = memo(StatisticsSummaryComponent);
