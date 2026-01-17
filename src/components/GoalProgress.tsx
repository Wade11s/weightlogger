import { useMemo } from 'react';
import { Trophy, Target, TrendingUp, Calendar, Award } from 'lucide-react';
import type { Goal, WeightRecord, UserProfile } from '../types';
import { calculateBMI, formatWeight, getWeightLabel } from '../utils/helpers';

interface GoalProgressProps {
  goal: Goal;
  records: WeightRecord[];
  profile?: UserProfile | null;
  weightUnit?: 'kg' | 'jin';
}

export function GoalProgress({ goal, records, profile, weightUnit = 'jin' }: GoalProgressProps) {
  const unitLabel = getWeightLabel(weightUnit);

  const progress = useMemo(() => {
    if (records.length === 0) {
      return null;
    }

    const sorted = [...records].sort((a, b) => a.date.localeCompare(b.date));
    const startWeight = sorted[0].weight;
    const latestWeight = sorted[sorted.length - 1].weight;

    // Calculate progress percentage (always in kg for calculation)
    const totalChange = goal.target_weight - startWeight;
    const currentChange = latestWeight - startWeight;
    const progressPercent = totalChange !== 0 ? (currentChange / totalChange) * 100 : 0;

    // Calculate estimated days to reach goal
    let estimatedDays: number | null = null;
    if (sorted.length >= 2) {
      const recentRecords = sorted.slice(-7);
      if (recentRecords.length >= 2) {
        const totalChange = recentRecords[recentRecords.length - 1].weight - recentRecords[0].weight;
        const avgDailyChange = totalChange / 7;

        if (avgDailyChange !== 0) {
          const remaining = goal.target_weight - latestWeight;
          estimatedDays = Math.ceil(remaining / avgDailyChange);
        }
      }
    }

    const isAchieved = Math.abs(latestWeight - goal.target_weight) <= 0.5;

    return {
      startWeight,
      currentWeight: latestWeight,
      targetWeight: goal.target_weight,
      totalToLose: startWeight - goal.target_weight,
      weightLost: startWeight - latestWeight,
      remainingWeight: latestWeight - goal.target_weight,
      progressPercent: Math.max(0, Math.min(100, progressPercent)),
      estimatedDays,
      isAchieved,
      daysSinceStart: Math.ceil((Date.now() - new Date(sorted[0].date).getTime()) / (1000 * 60 * 60 * 24)),
    };
  }, [goal, records]);

  if (!progress) {
    return (
      <div className="card text-center py-8">
        <Target className="w-12 h-12 text-muted-plum mx-auto mb-3" />
        <p className="text-muted-plum dark:text-dark-textMuted">添加记录后查看进度追踪</p>
      </div>
    );
  }

  const targetDate = goal.target_date ? new Date(goal.target_date) : null;
  const today = new Date();

  // Helper to format weight for display
  const fmtWeight = (weightKg: number) => formatWeight(weightKg, weightUnit);

  return (
    <div className="space-y-6">
      {/* Achievement Banner */}
      {progress.isAchieved && (
        <div className="card bg-gradient-to-r from-sage-100 to-sage-50 dark:from-sage-900 dark:to-sage-800 border-2 border-sage-300 dark:border-sage-600">
          <div className="text-center py-6">
            <Award className="w-16 h-16 text-sage-500 mx-auto mb-3" />
            <h3 className="text-2xl font-heading text-sage-700 dark:text-sage-300 mb-2">🎉 目标达成！</h3>
            <p className="text-sage-600 dark:text-sage-400">恭喜您已成功达成目标体重！</p>
          </div>
        </div>
      )}

      {/* Main Progress Card */}
      <div className="card-non-interactive">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-gold" />
            <div>
              <h3 className="text-xl font-heading text-deep-rose dark:text-dark-rose">目标进度</h3>
              <p className="text-sm text-muted-plum dark:text-dark-textMuted">
                已坚持 {progress.daysSinceStart} 天
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-heading text-deep-rose dark:text-dark-rose">
              {progress.progressPercent.toFixed(0)}%
            </p>
            <p className="text-xs text-muted-plum dark:text-dark-textMuted">完成度</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="h-6 bg-pink-100 dark:bg-dark-input rounded-full overflow-hidden shadow-inner">
            <div
              className={`h-full transition-all duration-700 ease-out ${
                progress.isAchieved
                  ? 'bg-gradient-to-r from-sage-400 to-sage-500'
                  : 'bg-gradient-to-r from-pink-300 to-pink-400'
              }`}
              style={{ width: `${Math.min(100, progress.progressPercent)}%` }}
            />
          </div>
        </div>

        {/* Progress Metrics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-xs text-muted-plum dark:text-dark-textMuted mb-1">起始</p>
            <p className="text-lg font-heading text-deep-rose dark:text-dark-rose">
              {fmtWeight(progress.startWeight)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-plum dark:text-dark-textMuted mb-1">当前</p>
            <p className="text-lg font-heading text-deep-rose dark:text-dark-rose">
              {fmtWeight(progress.currentWeight)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-plum dark:text-dark-textMuted mb-1">目标</p>
            <p className="text-lg font-heading text-pink-400">
              {fmtWeight(progress.targetWeight)}
            </p>
          </div>
        </div>
      </div>

      {/* Weight Journey Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-sage-500" />
            <h4 className="font-heading text-deep-rose dark:text-dark-rose">已减重</h4>
          </div>
          <p className="text-3xl font-heading text-sage-500">
            {fmtWeight(Math.abs(progress.weightLost))}
            <span className="text-lg ml-1">{unitLabel}</span>
          </p>
          {progress.totalToLose > 0 && (
            <p className="text-xs text-muted-plum dark:text-dark-textMuted mt-1">
              目标: {fmtWeight(Math.abs(progress.totalToLose))} {unitLabel}
            </p>
          )}
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-pink-400" />
            <h4 className="font-heading text-deep-rose dark:text-dark-rose">还需</h4>
          </div>
          <p className="text-3xl font-heading text-pink-400">
            {fmtWeight(Math.abs(progress.remainingWeight))}
            <span className="text-lg ml-1">{unitLabel}</span>
          </p>
          <p className="text-xs text-muted-plum dark:text-dark-textMuted mt-1">
            距离目标
          </p>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="card-non-interactive">
        <h4 className="text-lg font-heading text-deep-rose dark:text-dark-rose mb-4">时间线</h4>

        <div className="space-y-4">
          {/* Progress Timeline */}
          <div className="relative">
            {/* Timeline Bar */}
            <div className="h-3 bg-pink-200 dark:bg-dark-input rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-300 via-pink-400 to-pink-500"
                style={{ width: `${Math.min(100, progress.progressPercent)}%` }}
              />
            </div>

            {/* Milestone Markers */}
            <div className="mt-4 flex justify-between text-xs">
              <div className="text-center">
                <div className="w-3 h-3 bg-pink-300 rounded-full mx-auto mb-1"></div>
                <p className="text-muted-plum dark:text-dark-textMuted">起点</p>
                <p className="font-medium">{fmtWeight(progress.startWeight)} {unitLabel}</p>
              </div>

              <div className={`text-center ${progress.progressPercent >= 50 ? 'opacity-100' : 'opacity-50'}`}>
                <div className="w-3 h-3 bg-pink-400 rounded-full mx-auto mb-1"></div>
                <p className="text-muted-plum dark:text-dark-textMuted">50%</p>
                <p className="font-medium">
                  {progress.progressPercent >= 50
                    ? '已过半'
                    : `${fmtWeight((progress.startWeight - progress.targetWeight) / 2 + progress.currentWeight)} ${unitLabel}`}
                </p>
              </div>

              <div className={`text-center ${progress.isAchieved ? 'opacity-100' : 'opacity-60'}`}>
                <div className={`w-3 h-3 rounded-full mx-auto mb-1 ${
                  progress.isAchieved ? 'bg-sage-500' : 'bg-pink-500'
                }`}></div>
                <p className="text-muted-plum dark:text-dark-textMuted">目标</p>
                <p className="font-medium">{fmtWeight(progress.targetWeight)} {unitLabel}</p>
              </div>
            </div>
          </div>

          {/* Estimated Time */}
          {progress.estimatedDays !== null && progress.estimatedDays > 0 && !progress.isAchieved && (
            <div className="p-4 bg-pink-50 dark:bg-dark-input rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-pink-400" />
                  <span className="text-sm text-muted-plum dark:text-dark-textMuted">预计达成</span>
                </div>
                <div className="text-right">
                  <p className="text-lg font-heading text-deep-rose dark:text-dark-rose">
                    {progress.estimatedDays} 天
                  </p>
                  <p className="text-xs text-muted-plum dark:text-dark-textMuted">
                    基于最近7天趋势
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Target Date Countdown */}
          {targetDate && targetDate > today && !progress.isAchieved && (
            <div className="p-4 bg-gold/10 dark:bg-dark-input rounded-xl border border-gold/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gold" />
                  <span className="text-sm text-muted-plum dark:text-dark-textMuted">目标日期</span>
                </div>
                <div className="text-right">
                  <p className="text-lg font-heading text-gold-700 dark:text-gold">
                    {Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))} 天
                  </p>
                  <p className="text-xs text-muted-plum dark:text-dark-textMuted">
                    {targetDate.toLocaleDateString('zh-CN')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Overdue Warning */}
          {targetDate && targetDate < today && !progress.isAchieved && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400 text-center">
                ⚠️ 目标日期已过，继续努力！
              </p>
            </div>
          )}
        </div>
      </div>

      {/* BMI Goal Indicator (subtle) */}
      {profile && (
        <div className="card-non-interactive">
          <h4 className="text-lg font-heading text-deep-rose dark:text-dark-rose mb-4">BMI 目标范围</h4>
          <div className="flex items-center gap-4">
            <div className="flex-1 text-center p-3 bg-pink-50 dark:bg-dark-input rounded-xl">
              <p className="text-xs text-muted-plum dark:text-dark-textMuted mb-1">当前 BMI</p>
              <p className="text-xl font-heading text-deep-rose dark:text-dark-rose">
                {calculateBMI(progress.currentWeight, profile.height).toFixed(1)}
              </p>
            </div>
            <div className="text-2xl text-muted-plum">→</div>
            <div className="flex-1 text-center p-3 bg-sage-50 dark:bg-dark-input rounded-xl">
              <p className="text-xs text-muted-plum dark:text-dark-textMuted mb-1">目标 BMI</p>
              <p className="text-xl font-heading text-sage-500">
                {calculateBMI(progress.targetWeight, profile.height).toFixed(1)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
