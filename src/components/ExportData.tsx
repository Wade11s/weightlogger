import { useState } from 'react';
import { Download } from 'lucide-react';
import { open } from '@tauri-apps/plugin-dialog';
import type { WeightRecord } from '../types';
import { api } from '../services/api';

interface ExportDataProps {
  records: WeightRecord[];
  onExportComplete?: (message: string) => void;
}

export function ExportData({ records, onExportComplete }: ExportDataProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: 'json' | 'csv') => {
    if (records.length === 0) {
      onExportComplete?.('暂无数据可导出');
      return;
    }

    setIsExporting(true);

    try {
      const date = new Date();
      const fileName = `weight_data_${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}.${format}`;

      const filePath = await open({
        defaultPath: fileName,
        filters: [
          {
            name: `${format.toUpperCase()} Files`,
            extensions: [format],
          },
        ],
      });

      if (!filePath) {
        // User cancelled
        setIsExporting(false);
        return;
      }

      await api.exportData(format, filePath);
      onExportComplete?.(`数据已成功导出到：${filePath}`);
    } catch (err) {
      onExportComplete?.(err instanceof Error ? err.message : '导出失败');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <Download className="w-5 h-5 text-pink-400" />
        <h3 className="text-lg font-heading text-deep-rose">数据导出</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => handleExport('json')}
          disabled={isExporting || records.length === 0}
          className="btn-secondary flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          JSON
        </button>

        <button
          onClick={() => handleExport('csv')}
          disabled={isExporting || records.length === 0}
          className="btn-secondary flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          CSV
        </button>
      </div>

      {records.length === 0 && (
        <p className="text-sm text-muted-plum mt-2">
          暂无数据可导出
        </p>
      )}

      <div className="mt-4 pt-4 border-t border-pink-200">
        <h4 className="text-md font-heading text-deep-rose mb-2">导出说明</h4>
        <div className="text-sm text-muted-plum space-y-1">
          <p>• JSON 格式：包含所有记录的完整数据</p>
          <p>• CSV 格式：包含日期、体重、备注三列</p>
          <p>• 文件名格式：weight_data_YYYYMMDD.json/csv</p>
        </div>
      </div>
    </div>
  );
}
