import { useState } from 'react';
import { Save, RotateCcw, AlertTriangle } from 'lucide-react';
import { open, save } from '@tauri-apps/plugin-dialog';
import { api } from '../services/api';

interface BackupRestoreProps {
  onOperationComplete?: (message: string) => void;
  onRecordsUpdated?: () => void;
}

export function BackupRestore({ onOperationComplete, onRecordsUpdated }: BackupRestoreProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);

  const handleCreateBackup = async () => {
    setIsProcessing(true);

    try {
      const date = new Date();
      const fileName = `weightlogger_backup_${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}_${String(date.getHours()).padStart(2, '0')}${String(date.getMinutes()).padStart(2, '0')}.json`;

      const filePath = await save({
        defaultPath: fileName,
        filters: [
          {
            name: 'JSON Files',
            extensions: ['json'],
          },
        ],
      });

      if (!filePath) {
        // User cancelled
        setIsProcessing(false);
        return;
      }

      await api.createBackup(filePath);
      onOperationComplete?.(`备份已创建：${filePath}`);
    } catch (err) {
      onOperationComplete?.(err instanceof Error ? err.message : '创建备份失败');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRestoreBackup = async () => {
    setShowRestoreConfirm(false);
    setIsProcessing(true);

    try {
      const filePath = await open({
        multiple: false,
        filters: [
          {
            name: 'JSON Files',
            extensions: ['json'],
          },
        ],
      });

      if (!filePath) {
        // User cancelled
        setIsProcessing(false);
        return;
      }

      await api.restoreBackup(filePath);
      onOperationComplete?.('数据已从备份恢复');
      onRecordsUpdated?.();
    } catch (err) {
      onOperationComplete?.(err instanceof Error ? err.message : '恢复备份失败');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <Save className="w-5 h-5 text-pink-400" />
        <h3 className="text-lg font-heading text-deep-rose">备份与恢复</h3>
      </div>

      <div className="space-y-4">
        {/* Create Backup */}
        <div>
          <h4 className="text-md font-heading text-deep-rose mb-2">创建备份</h4>
          <button
            onClick={handleCreateBackup}
            disabled={isProcessing}
            className="btn-secondary w-full flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            创建完整备份
          </button>
          <p className="text-xs text-muted-plum mt-2">
            备份包含所有记录、个人资料和目标设置
          </p>
        </div>

        {/* Restore Backup */}
        <div className="pt-4 border-t border-pink-200">
          <h4 className="text-md font-heading text-deep-rose mb-2">恢复备份</h4>
          {!showRestoreConfirm ? (
            <button
              onClick={() => setShowRestoreConfirm(true)}
              disabled={isProcessing}
              className="btn-secondary w-full flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              从备份恢复
            </button>
          ) : (
            <div className="space-y-2">
              <div className="flex items-start gap-2 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-yellow-800">确认恢复</p>
                  <p className="text-xs text-yellow-700 mt-1">
                    恢复备份将覆盖当前所有数据，此操作不可撤销。
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleRestoreBackup}
                  disabled={isProcessing}
                  className="btn-primary flex-1 text-sm"
                >
                  确认恢复
                </button>
                <button
                  onClick={() => setShowRestoreConfirm(false)}
                  disabled={isProcessing}
                  className="btn-secondary flex-1 text-sm"
                >
                  取消
                </button>
              </div>
            </div>
          )}
          <p className="text-xs text-muted-plum mt-2">
            选择之前创建的备份文件恢复数据
          </p>
        </div>
      </div>

      {/* Info */}
      <div className="mt-4 pt-4 border-t border-pink-200">
        <h4 className="text-md font-heading text-deep-rose mb-2">使用说明</h4>
        <div className="text-sm text-muted-plum space-y-1">
          <p>• 定期创建备份以防止数据丢失</p>
          <p>• 备份文件名包含日期和时间戳</p>
          <p>• 恢复前请确认选择了正确的备份文件</p>
          <p>• 建议在恢复前先创建当前数据的备份</p>
        </div>
      </div>
    </div>
  );
}
