import { useState, useEffect } from 'react';
import type { UserProfile, WeightUnit } from '../types';
import { api } from '../services/api';

interface UnitSelectorProps {
  profile?: UserProfile | null;
  onProfileChange?: (profile: UserProfile) => void;
}

export function UnitSelector({ profile, onProfileChange }: UnitSelectorProps) {
  const [currentUnit, setCurrentUnit] = useState<WeightUnit>(profile?.weightUnit || 'jin');
  const [isSaving, setIsSaving] = useState(false);

  // Update local state when profile changes
  useEffect(() => {
    setCurrentUnit(profile?.weightUnit || 'jin');
  }, [profile]);

  const handleUnitChange = async (newUnit: WeightUnit) => {
    if (newUnit === currentUnit) return;

    setIsSaving(true);
    try {
      // Create updated profile
      const updatedProfile: UserProfile = {
        height: profile?.height || 0,
        gender: profile?.gender,
        weightUnit: newUnit,
      };

      // Save to backend
      await api.updateProfile(updatedProfile);

      // Update local state
      setCurrentUnit(newUnit);

      // Notify parent component
      onProfileChange?.(updatedProfile);
    } catch (err) {
      console.error('Failed to update weight unit:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-heading text-deep-rose dark:text-dark-rose">重量单位</h3>
          <p className="text-sm text-muted-plum dark:text-dark-textMuted">选择您偏好的重量显示单位</p>
        </div>
        {isSaving && (
          <span className="text-sm text-muted-plum">保存中...</span>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => handleUnitChange('jin')}
          disabled={isSaving}
          className={`
            flex-1 py-3 px-4 rounded-xl font-medium transition-all
            ${currentUnit === 'jin'
              ? 'bg-pink-300 text-deep-rose dark:bg-pink-600 dark:text-white'
              : 'btn-secondary'
            }
            ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          斤
          <span className="block text-xs font-normal mt-1">
            1 斤 = 0.5 kg
          </span>
        </button>

        <button
          onClick={() => handleUnitChange('kg')}
          disabled={isSaving}
          className={`
            flex-1 py-3 px-4 rounded-xl font-medium transition-all
            ${currentUnit === 'kg'
              ? 'bg-pink-300 text-deep-rose dark:bg-pink-600 dark:text-white'
              : 'btn-secondary'
            }
            ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          kg
          <span className="block text-xs font-normal mt-1">
            千克
          </span>
        </button>
      </div>

      {currentUnit && (
        <p className="text-xs text-muted-plum dark:text-dark-textMuted mt-3 text-center">
          当前单位: {currentUnit === 'jin' ? '斤' : 'kg'}
        </p>
      )}
    </div>
  );
}
