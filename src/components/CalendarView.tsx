import { useState, useMemo } from 'react';
import { memo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { WeightRecord } from '../types';

interface CalendarViewProps {
  records: WeightRecord[];
  onRecordClick?: (record: WeightRecord) => void;
  onDateClick?: (date: string) => void;
}

function CalendarViewComponent({ records, onRecordClick, onDateClick }: CalendarViewProps) {
  // Current viewing month
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  // Group records by date and calculate changes
  const calendarData = useMemo(() => {
    const sortedRecords = [...records].sort((a, b) => a.date.localeCompare(b.date));
    const data = new Map<string, WeightRecord & { change: number; changePercent: number }>();

    sortedRecords.forEach((record, index) => {
      let change = 0;
      let changePercent = 0;

      if (index > 0) {
        const prevRecord = sortedRecords[index - 1];
        change = record.weight - prevRecord.weight;
        changePercent = prevRecord.weight > 0 ? (change / prevRecord.weight) * 100 : 0;
      }

      data.set(record.date, {
        ...record,
        change,
        changePercent,
      });
    });

    return data;
  }, [records]);

  // Get days of month for calendar grid
  const getDaysOfMonth = (year: number, month: number) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Sunday

    const days = [];

    // Add empty cells for days before the first day of month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }

    // Add actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      days.push(dateStr);
    }

    return days;
  };

  // Navigate to previous month
  const goToPrevMonth = () => {
    if (viewMonth === 0) {
      setViewYear(viewYear - 1);
      setViewMonth(11);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  // Navigate to next month
  const goToNextMonth = () => {
    if (viewMonth === 11) {
      setViewYear(viewYear + 1);
      setViewMonth(0);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  // Go to today
  const goToToday = () => {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
  };

  const days = getDaysOfMonth(viewYear, viewMonth);

  return (
    <div className="space-y-4">
      {/* Month navigation */}
      <div className="flex items-center justify-between card">
        <button
          onClick={goToPrevMonth}
          className="btn-secondary px-4 py-2 flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          上月
        </button>

        <div className="flex items-center gap-3">
          <h2 className="text-xl font-heading text-deep-rose">
            {viewYear}年{viewMonth + 1}月
          </h2>
          <button
            onClick={goToToday}
            className="text-sm text-muted-plum hover:text-deep-rose transition-colors px-2 py-1 rounded-lg hover:bg-pink-100"
          >
            今天
          </button>
        </div>

        <button
          onClick={goToNextMonth}
          className="btn-secondary px-4 py-2 flex items-center gap-2"
        >
          下月
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-2">
        {['日', '一', '二', '三', '四', '五', '六'].map((day) => (
          <div key={day} className="text-center text-sm text-muted-plum py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((dateStr, index) => {
          if (!dateStr) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const record = calendarData.get(dateStr);
          const day = parseInt(dateStr.split('-')[2]);
          const isToday = dateStr === today.toISOString().split('T')[0];

          if (!record) {
            // Empty date - clickable to add new record
            return (
              <div
                key={dateStr}
                onClick={() => onDateClick?.(dateStr)}
                className={`
                  aspect-square flex items-center justify-center rounded-xl cursor-pointer
                  text-muted-plum/40 hover:text-muted-plum hover:bg-pink-50 transition-all
                  ${isToday ? 'ring-2 ring-pink-300' : ''}
                `}
              >
                {day}
              </div>
            );
          }

          const isPositive = record.change > 0;
          const isNegative = record.change < 0;

          return (
            <div
              key={dateStr}
              onClick={() => onRecordClick?.({
                id: record.id,
                date: record.date,
                weight: record.weight,
                note: record.note,
                created_at: record.created_at,
              })}
              className={`
                card aspect-square p-2 cursor-pointer hover:shadow-softLg transition-all flex flex-col
                ${isToday ? 'ring-2 ring-pink-400' : ''}
              `}
            >
              {/* Top left: date */}
              <div className="text-xs text-muted-plum">
                {day}日
              </div>

              {/* Center: weight */}
              <div className="text-xl font-heading text-deep-rose flex-1 flex items-center justify-center">
                {record.weight.toFixed(1)}
              </div>

              {/* Bottom: change info row */}
              <div className="flex justify-between items-end text-xs mt-auto">
                {/* Bottom left: weight change */}
                <div>
                  <span className={isNegative ? 'text-sage-500' : isPositive ? 'text-red-400' : 'text-muted-plum'}>
                    {isNegative ? '' : isPositive ? '+' : ''}{record.change.toFixed(1)}
                  </span>
                </div>

                {/* Bottom right: percentage */}
                <div>
                  <span className={isNegative ? 'text-sage-500' : isPositive ? 'text-red-400' : 'text-muted-plum'}>
                    {isNegative ? '' : isPositive ? '+' : ''}{record.changePercent.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const CalendarView = memo(CalendarViewComponent);
