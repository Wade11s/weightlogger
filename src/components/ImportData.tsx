import { useState } from 'react';
import { Upload, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { open } from '@tauri-apps/plugin-dialog';
import { api } from '../services/api';
import type { ImportStrategy, ImportResult } from '../types';

interface ImportDataProps {
  onImportComplete?: (success: boolean, message: string) => void;
  onRecordsUpdated?: () => void;
}

export function ImportData({ onImportComplete, onRecordsUpdated }: ImportDataProps) {
  const [isImporting, setIsImporting] = useState(false);
  const [conflictStrategy, setConflictStrategy] = useState<'overwrite' | 'keep' | 'skip'>('keep');
  const [showConflictOption, setShowConflictOption] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  const handleImport = async (format: 'json' | 'csv') => {
    setIsImporting(true);
    setImportResult(null);

    try {
      const filePath = await open({
        multiple: false,
        filters: [
          {
            name: `${format.toUpperCase()} Files`,
            extensions: [format],
          },
        ],
      });

      if (!filePath) {
        // User cancelled
        setIsImporting(false);
        return;
      }

      const resolution: ImportStrategy = { onConflict: conflictStrategy };
      let result: ImportResult;

      if (format === 'json') {
        result = await api.importDataJson(filePath, resolution);
      } else {
        result = await api.importDataCsv(filePath, resolution);
      }

      setImportResult(result);

      // Generate summary message
      const parts: string[] = [];
      if (result.success > 0) parts.push(`成功导入 ${result.success} 条记录`);
      if (result.failed > 0) parts.push(`失败 ${result.failed} 条`);
      if (result.skipped > 0) parts.push(`跳过 ${result.skipped} 条`);

      const message = parts.join('，');
      const success = result.failed === 0 && result.success > 0;

      onImportComplete?.(success, message);
      if (success) {
        onRecordsUpdated?.();
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '导入失败';
      onImportComplete?.(false, errorMsg);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <Upload className="w-5 h-5 text-pink-400" />
        <h3 className="text-lg font-heading text-deep-rose">数据导入</h3>
      </div>

      {/* Conflict Strategy Selection */}
      <div className="mb-4">
        <button
          onClick={() => setShowConflictOption(!showConflictOption)}
          className="w-full text-left px-3 py-2 rounded-lg bg-pink-50 hover:bg-pink-100 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-deep-rose">冲突处理方式</span>
            <span className="text-xs text-muted-plum">
              {conflictStrategy === 'overwrite' && '覆盖现有记录'}
              {conflictStrategy === 'keep' && '保留两条记录'}
              {conflictStrategy === 'skip' && '跳过冲突记录'}
            </span>
          </div>
        </button>

        {showConflictOption && (
          <div className="mt-2 space-y-2">
            <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-pink-50 cursor-pointer">
              <input
                type="radio"
                name="conflict"
                value="keep"
                checked={conflictStrategy === 'keep'}
                onChange={(e) => setConflictStrategy(e.target.value as 'keep')}
                className="text-pink-400 focus:ring-pink-400"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-deep-rose">保留两者</span>
                <p className="text-xs text-muted-plum">同时保留导入和现有记录</p>
              </div>
            </label>

            <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-pink-50 cursor-pointer">
              <input
                type="radio"
                name="conflict"
                value="overwrite"
                checked={conflictStrategy === 'overwrite'}
                onChange={(e) => setConflictStrategy(e.target.value as 'overwrite')}
                className="text-pink-400 focus:ring-pink-400"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-deep-rose">覆盖现有</span>
                <p className="text-xs text-muted-plum">用导入的记录替换现有记录</p>
              </div>
            </label>

            <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-pink-50 cursor-pointer">
              <input
                type="radio"
                name="conflict"
                value="skip"
                checked={conflictStrategy === 'skip'}
                onChange={(e) => setConflictStrategy(e.target.value as 'skip')}
                className="text-pink-400 focus:ring-pink-400"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-deep-rose">跳过冲突</span>
                <p className="text-xs text-muted-plum">不导入有日期冲突的记录</p>
              </div>
            </label>
          </div>
        )}
      </div>

      {/* Import Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => handleImport('json')}
          disabled={isImporting}
          className="btn-secondary flex items-center justify-center gap-2"
        >
          <Upload className="w-4 h-4" />
          JSON
        </button>

        <button
          onClick={() => handleImport('csv')}
          disabled={isImporting}
          className="btn-secondary flex items-center justify-center gap-2"
        >
          <Upload className="w-4 h-4" />
          CSV
        </button>
      </div>

      {/* Import Result */}
      {importResult && (
        <div className="mt-4 p-3 rounded-lg bg-sage-50 border border-sage-200">
          <h4 className="text-sm font-medium text-sage-700 mb-2">导入结果</h4>
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2 text-sage-600">
              <CheckCircle2 className="w-4 h-4" />
              <span>成功导入：{importResult.success} 条</span>
            </div>
            {importResult.failed > 0 && (
              <div className="flex items-center gap-2 text-red-500">
                <XCircle className="w-4 h-4" />
                <span>失败：{importResult.failed} 条</span>
              </div>
            )}
            {importResult.skipped > 0 && (
              <div className="flex items-center gap-2 text-muted-plum">
                <AlertCircle className="w-4 h-4" />
                <span>跳过：{importResult.skipped} 条</span>
              </div>
            )}
          </div>

          {importResult.errors.length > 0 && (
            <div className="mt-2 pt-2 border-t border-sage-200">
              <p className="text-xs font-medium text-red-500 mb-1">错误详情：</p>
              <ul className="text-xs text-red-400 space-y-1 max-h-20 overflow-y-auto">
                {importResult.errors.map((error, idx) => (
                  <li key={idx}>• {error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="mt-4 pt-4 border-t border-pink-200">
        <h4 className="text-md font-heading text-deep-rose mb-2">导入说明</h4>
        <div className="text-sm text-muted-plum space-y-1">
          <p>• JSON 格式：支持本应用导出的 JSON 文件</p>
          <p>• CSV 格式：需包含日期和体重列，备注列为可选</p>
          <p>• 日期格式：YYYY-MM-DD（如 2024-01-15）</p>
          <p>• 体重范围：20kg - 300kg</p>
        </div>
      </div>
    </div>
  );
}
