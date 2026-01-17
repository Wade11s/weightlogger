import { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import type { UserProfile } from '../types';
import { api } from '../services/api';

interface ProfileSettingProps {
  onProfileChange?: (profile: UserProfile | null) => void;
}

export function ProfileSetting({ onProfileChange }: ProfileSettingProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [height, setHeight] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profileData = await api.getProfile();
      setProfile(profileData);
      if (profileData) {
        setHeight(profileData.height.toString());
        setGender(profileData.gender || '');
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    const heightNum = parseFloat(height);

    if (isNaN(heightNum) || heightNum < 100 || heightNum > 250) {
      setMessage('请输入有效的身高 (100-250cm)');
      setIsSubmitting(false);
      return;
    }

    try {
      // Preserve existing weightUnit when updating profile
      const newProfile: UserProfile = {
        height: heightNum,
        gender: gender || undefined,
        weightUnit: profile?.weightUnit || 'jin',  // Preserve existing weight unit
      };

      await api.updateProfile(newProfile);
      setProfile(newProfile);
      onProfileChange?.(newProfile);
      setMessage('个人资料已保存！');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : '保存失败');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-pink-400" />
          <h3 className="text-lg font-heading text-deep-rose">个人资料</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="height" className="block text-deep-rose font-medium mb-2">
              身高 (cm)
            </label>
            <input
              type="number"
              id="height"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              step="1"
              min="100"
              max="250"
              placeholder="165"
              className="input"
              required
            />
          </div>

          <div>
            <label htmlFor="gender" className="block text-deep-rose font-medium mb-2">
              性别 (可选)
            </label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value as 'male' | 'female' | '')}
              className="input"
            >
              <option value="">未设置</option>
              <option value="male">男</option>
              <option value="female">女</option>
            </select>
          </div>

          {message && (
            <div className={`text-sm ${message.includes('失败') ? 'text-red-400' : 'text-sage-500'}`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full"
          >
            {isSubmitting ? '保存中...' : '保存资料'}
          </button>
        </form>
      </div>

      {/* Profile Summary */}
      {profile && (
        <div className="card">
          <h4 className="text-md font-heading text-deep-rose mb-3">当前资料</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-plum">身高</span>
              <span className="font-medium text-deep-rose">{profile.height} cm</span>
            </div>
            {profile.gender && (
              <div className="flex justify-between">
                <span className="text-muted-plum">性别</span>
                <span className="font-medium text-deep-rose">
                  {profile.gender === 'male' ? '男' : '女'}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
