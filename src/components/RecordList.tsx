import { Trash, Pencil } from 'lucide-react';
import { useState } from 'react';
import type { WeightRecord } from '../types';
import { api } from '../services/api';
import { formatDate } from '../utils/helpers';
import { RecordForm } from './RecordForm';

interface RecordListProps {
  records: WeightRecord[];
  onRecordsChange?: () => void;
}

export function RecordList({ records, onRecordsChange }: RecordListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这条记录吗？')) {
      return;
    }

    setDeletingId(id);
    try {
      await api.deleteRecord(id);
      onRecordsChange?.();
    } catch (err) {
      alert(err instanceof Error ? err.message : '删除失败');
    } finally {
      setDeletingId(null);
    }
  };

  if (records.length === 0) {
    return (
      <div className="card text-center py-12">
        <p className="text-muted-plum mb-2">还没有任何记录</p>
        <p className="text-muted-plum text-sm">添加第一条体重记录开始追踪吧！</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {records.map((record) => {
        if (editingId === record.id) {
          return (
            <div key={record.id} className="card">
              <RecordForm
                existingRecord={record}
                onSuccess={() => {
                  setEditingId(null);
                  onRecordsChange?.();
                }}
              />
              <button
                onClick={() => setEditingId(null)}
                className="btn-secondary w-full mt-4"
              >
                取消编辑
              </button>
            </div>
          );
        }

        return (
          <div key={record.id} className="card group relative">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-2xl font-heading text-deep-rose">
                    {record.weight.toFixed(1)}
                  </span>
                  <span className="text-sm text-muted-plum">kg</span>
                  <span className="text-sm text-muted-plum">
                    {formatDate(record.date)}
                  </span>
                </div>
                {record.note && (
                  <p className="text-sm text-muted-plum">{record.note}</p>
                )}
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setEditingId(record.id)}
                  className="p-2 rounded-lg hover:bg-pink-200 text-deep-rose transition-colors"
                  title="编辑"
                >
                  <Pencil className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(record.id)}
                  disabled={deletingId === record.id}
                  className="p-2 rounded-lg hover:bg-red-200 text-red-400 transition-colors disabled:opacity-50"
                  title="删除"
                >
                  <Trash className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
