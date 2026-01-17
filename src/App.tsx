import { useState, useEffect } from 'react';
import { Target } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { CalendarView } from './components/CalendarView';
import { RecordForm } from './components/RecordForm';
import { TrendChart } from './components/TrendChart';
import { StatisticsSummary } from './components/StatisticsSummary';
import { GoalSetting } from './components/GoalSetting';
import { ProfileSetting } from './components/ProfileSetting';
import { GoalProgress } from './components/GoalProgress';
import { ExportData } from './components/ExportData';
import { ImportData } from './components/ImportData';
import { BackupRestore } from './components/BackupRestore';
import { ThemeToggle } from './components/ThemeToggle';
import { useToast } from './components/Toast';
import { api } from './services/api';
import type { WeightRecord, UserProfile, Goal } from './types';
import { calculateBMI, getBMICategory, getBMICategoryColor } from './utils/helpers';

type Page = 'dashboard' | 'records' | 'statistics' | 'goals' | 'settings';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [records, setRecords] = useState<WeightRecord[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingRecord, setEditingRecord] = useState<WeightRecord | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [statsDaysRange, setStatsDaysRange] = useState<number | undefined>(undefined);
  const { showToast, toast } = useToast();

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (showNotification = false) => {
    try {
      const [recordsData, profileData, goalData] = await Promise.all([
        api.getRecords(),
        api.getProfile(),
        api.getGoal(),
      ]);
      setRecords(recordsData);
      setProfile(profileData);
      setGoal(goalData);
      if (showNotification) {
        showToast('数据已自动保存', 'success');
      }
    } catch (err) {
      console.error('Failed to load data:', err);
      showToast('数据加载失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-deep-rose dark:text-dark-rose">加载中...</div>
        </div>
      );
    }

    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'records':
        return <RecordsPage />;
      case 'statistics':
        return <StatisticsPage />;
      case 'goals':
        return <GoalsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  // Dashboard Page
  const DashboardPage = () => {
    const latestRecord = records[0];
    const startWeight = records.length > 0 ? records[records.length - 1].weight : 0;
    const weightChange = latestRecord ? latestRecord.weight - startWeight : 0;
    const bmi = profile && latestRecord ? calculateBMI(latestRecord.weight, profile.height) : null;

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-heading text-deep-rose dark:text-dark-rose mb-6">概览</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Current Weight */}
          <div className="card">
            <p className="text-muted-plum dark:text-dark-textMuted text-sm mb-1">当前体重</p>
            <p className="text-4xl font-heading text-deep-rose dark:text-dark-rose">
              {latestRecord ? latestRecord.weight.toFixed(1) : '--'}
              <span className="text-lg text-muted-plum dark:text-dark-textMuted ml-1">kg</span>
            </p>
            {weightChange !== 0 && (
              <p className={`text-sm mt-2 ${weightChange > 0 ? 'text-red-400' : 'text-sage-500'}`}>
                {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)} kg
              </p>
            )}
          </div>

          {/* BMI */}
          <div className="card">
            <p className="text-muted-plum dark:text-dark-textMuted text-sm mb-1">BMI</p>
            <p className="text-4xl font-heading text-deep-rose dark:text-dark-rose">
              {bmi ? bmi.toFixed(1) : '--'}
            </p>
            {bmi && (
              <p className={`text-sm mt-2 ${getBMICategoryColor(bmi)}`}>
                {getBMICategory(bmi)}
              </p>
            )}
          </div>

          {/* Goal Progress */}
          {goal && (
            <div className="md:col-span-2">
              <GoalProgress goal={goal} records={records} profile={profile} />
            </div>
          )}
        </div>

        {/* Quick Add */}
        <div className="card">
          <h3 className="text-lg font-heading text-deep-rose dark:text-dark-rose mb-4">快速记录</h3>
          <RecordForm onSuccess={() => loadData(true)} />
        </div>
      </div>
    );
  };

  // Records Page
  const RecordsPage = () => {
    const handleRecordClick = (record: WeightRecord) => {
      setEditingRecord(record);
      setShowEditModal(true);
    };

    const handleDateClick = (date: string) => {
      // Create a new empty record with the clicked date
      setEditingRecord({
        id: '',
        date,
        weight: 0,
        note: '',
        created_at: new Date().toISOString(),
      });
      setShowEditModal(true);
    };

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-heading text-deep-rose dark:text-dark-rose mb-6">体重记录</h2>
        <CalendarView
          records={records}
          onRecordClick={handleRecordClick}
          onDateClick={handleDateClick}
        />
      </div>
    );
  };

  // Statistics Page
  const StatisticsPage = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-heading text-deep-rose dark:text-dark-rose">统计分析</h2>
          {/* Time range filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setStatsDaysRange(7)}
              className={`px-4 py-2 rounded-xl transition-all ${statsDaysRange === 7 ? 'btn-primary' : 'btn-secondary'}`}
            >
              7天
            </button>
            <button
              onClick={() => setStatsDaysRange(30)}
              className={`px-4 py-2 rounded-xl transition-all ${statsDaysRange === 30 ? 'btn-primary' : 'btn-secondary'}`}
            >
              30天
            </button>
            <button
              onClick={() => setStatsDaysRange(undefined)}
              className={`px-4 py-2 rounded-xl transition-all ${statsDaysRange === undefined ? 'btn-primary' : 'btn-secondary'}`}
            >
              全部
            </button>
          </div>
        </div>

        <TrendChart records={records} days={statsDaysRange} />
        <StatisticsSummary records={records} profile={profile} days={statsDaysRange} />
      </div>
    );
  };

  // Goals Page
  const GoalsPage = () => {
    const [currentGoal, setCurrentGoal] = useState<Goal | null>(goal);
    const [showSettingsModal, setShowSettingsModal] = useState(false);

    const handleGoalChange = (newGoal: Goal | null) => {
      setCurrentGoal(newGoal);
      setGoal(newGoal);
    };

    const handleProfileChange = (newProfile: UserProfile | null) => {
      setProfile(newProfile);
    };

    return (
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-heading text-deep-rose dark:text-dark-rose">目标追踪</h2>
            <p className="text-muted-plum dark:text-dark-textMuted mt-1">
              {currentGoal ? '追踪您的体重目标进度' : '设定目标开始您的旅程'}
            </p>
          </div>
          <button
            onClick={() => setShowSettingsModal(true)}
            className="btn-secondary flex items-center gap-2"
          >
            <Target className="w-4 h-4" />
            {showSettingsModal ? '收起设置' : '目标设置'}
          </button>
        </div>

        {/* Settings Modal - Inline within content area */}
        {showSettingsModal && (
          <div className="card-non-interactive animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-heading text-deep-rose dark:text-dark-rose">目标设置</h3>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="text-muted-plum hover:text-deep-rose dark:hover:text-dark-rose transition-colors p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <ProfileSetting onProfileChange={handleProfileChange} />
              <GoalSetting onGoalChange={handleGoalChange} />
            </div>
          </div>
        )}

        {/* Goal Progress - Always Visible */}
        {currentGoal ? (
          <GoalProgress goal={currentGoal} records={records} profile={profile} />
        ) : (
          <div className="card-non-interactive text-center py-16">
            <Target className="w-16 h-16 text-muted-plum dark:text-dark-textMuted mx-auto mb-4" />
            <h3 className="text-xl font-heading text-deep-rose dark:text-dark-rose mb-2">设定您的目标</h3>
            <p className="text-muted-plum dark:text-dark-textMuted mb-6 max-w-md mx-auto">
              设置目标体重和可选的目标日期，开始追踪您的健康旅程
            </p>
          </div>
        )}
      </div>
    );
  };

  // Settings Page
  const [operationMessage, setOperationMessage] = useState('');
  const operationComplete = (message: string) => {
    setOperationMessage(message);
    setTimeout(() => setOperationMessage(''), 3000);
  };

  const SettingsPage = () => {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-heading text-deep-rose dark:text-dark-rose mb-6">设置</h2>

        {operationMessage && (
          <div className={`card p-4 ${operationMessage.includes('失败') || operationMessage.includes('错误') ? 'text-red-400' : 'text-sage-500'}`}>
            {operationMessage}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ImportData
            onImportComplete={(_success, message) => operationComplete(message)}
            onRecordsUpdated={() => loadData(true)}
          />
          <BackupRestore
            onOperationComplete={operationComplete}
            onRecordsUpdated={() => loadData(true)}
          />
        </div>

        <div className="mt-6">
          <ExportData records={records} onExportComplete={operationComplete} />
        </div>
      </div>
    );
  };

  // Handle edit modal close
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingRecord(null);
  };

  // Handle edit success
  const handleEditSuccess = () => {
    loadData(true);
    handleCloseEditModal();
  };

  return (
    <div className="h-screen bg-cream dark:bg-dark-bg flex overflow-hidden">
      <ThemeToggle />
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-4xl min-h-full">
          {renderContent()}
        </div>
      </main>

      {/* Edit Modal */}
      {showEditModal && editingRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card-non-interactive max-w-md w-full max-h-[90vh] overflow-auto">
            <h3 className="text-lg font-heading text-deep-rose dark:text-dark-rose mb-4">
              {editingRecord.id ? '编辑记录' : '添加记录'}
            </h3>
            <RecordForm
              existingRecord={editingRecord.id ? editingRecord : undefined}
              initialDate={editingRecord.date}
              onSuccess={handleEditSuccess}
            />
            <div className="flex gap-3 mt-4">
              {editingRecord.id && (
                <button
                  onClick={async () => {
                    if (confirm('确定要删除这条记录吗？')) {
                      try {
                        await api.deleteRecord(editingRecord.id);
                        showToast('记录已删除', 'success');
                        loadData();
                        handleCloseEditModal();
                      } catch (err) {
                        showToast(err instanceof Error ? err.message : '删除失败', 'error');
                      }
                    }
                  }}
                  className="btn-secondary flex-1 text-red-400 border-red-300 hover:bg-red-50"
                >
                  删除
                </button>
              )}
              <button
                onClick={handleCloseEditModal}
                className={editingRecord.id ? 'btn-secondary flex-1' : 'btn-secondary flex-1 ml-auto'}
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
      {toast}
    </div>
  );
}

export default App;
