import { useMemo, useEffect, useRef } from 'react';
import { memo } from 'react';
import Plotly from 'plotly.js-dist-min';
import type { WeightRecord } from '../types';
import { kgToJin, getWeightLabel } from '../utils/helpers';

interface TrendChartProps {
  records: WeightRecord[];
  days?: number; // 7, 30, or undefined for all
  weightUnit?: 'kg' | 'jin';
}

function TrendChartComponent({ records, days, weightUnit = 'jin' }: TrendChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  // Filter and sort records by date
  const chartData = useMemo(() => {
    let filtered = [...records].sort((a, b) => a.date.localeCompare(b.date));

    if (days) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      const cutoffISO = cutoffDate.toISOString().split('T')[0];
      filtered = filtered.filter(r => r.date >= cutoffISO);
    }

    return filtered.map(r => ({
      date: r.date,
      weight: r.weight,
      displayDate: new Date(r.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
      fullDate: new Date(r.date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }),
    }));
  }, [records, days]);

  const unitLabel = getWeightLabel(weightUnit);

  // Convert weights for display
  const displayWeights = useMemo(() => {
    return chartData.map(d => weightUnit === 'jin' ? kgToJin(d.weight) : d.weight);
  }, [chartData, weightUnit]);

  // Create Plotly chart
  useEffect(() => {
    if (chartData.length < 2 || !chartRef.current) return;

    const weights = displayWeights;
    const dates = chartData.map(d => d.fullDate);

    // Calculate min and max for better y-axis range
    const minWeight = Math.floor(Math.min(...weights));
    const maxWeight = Math.ceil(Math.max(...weights));
    const padding = (maxWeight - minWeight) * 0.15;

    const trace: Plotly.Data = {
      x: dates,
      y: weights,
      type: 'scatter',
      mode: 'lines+markers',
      name: '体重',
      line: {
        color: '#FF7690',
        width: 3,
        shape: 'spline',
      },
      marker: {
        color: '#FFB6C1',
        size: 10,
        line: {
          color: '#FF7690',
          width: 2,
        },
      },
      hovertemplate:
        '<b>%{x}</b><br>' +
        `体重: %{y:.1f} ${unitLabel}<extra></extra>`,
    };

    const layout: Partial<Plotly.Layout> = {
      margin: { t: 20, r: 20, b: 40, l: 50 },
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(255,240,245,0.3)',
      font: {
        family: 'Nunito Sans, sans-serif',
        color: '#8B475D',
      },
      xaxis: {
        gridcolor: '#FFD6E0',
        showgrid: true,
        zeroline: false,
      },
      yaxis: {
        title: { text: `体重 (${unitLabel})`, font: { size: 14 } },
        gridcolor: '#FFD6E0',
        showgrid: true,
        zeroline: false,
        range: [minWeight - padding, maxWeight + padding],
      },
      hovermode: 'closest',
      showlegend: false,
    };

    const config: Partial<Plotly.Config> = {
      responsive: true,
      displayModeBar: false,
    };

    Plotly.newPlot(chartRef.current, [trace], layout, config);

    // Cleanup
    return () => {
      if (chartRef.current) {
        Plotly.purge(chartRef.current);
      }
    };
  }, [chartData, displayWeights, unitLabel]);

  // Handle dark mode changes
  useEffect(() => {
    const updateTheme = () => {
      if (!chartRef.current) return;

      const isDark = document.documentElement.classList.contains('dark');
      const bgColor = isDark ? 'rgba(26, 26, 46, 0.5)' : 'rgba(255,240,245,0.3)';
      const gridColor = isDark ? '#0F3460' : '#FFD6E0';
      const textColor = isDark ? '#EAEAEA' : '#8B475D';

      const update: Partial<Plotly.Layout> = {
        plot_bgcolor: bgColor,
        xaxis: { gridcolor: gridColor },
        yaxis: { gridcolor: gridColor },
        font: { color: textColor },
      };

      Plotly.relayout(chartRef.current, update);
    };

    updateTheme();

    // Listen for theme changes
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, [chartData]);

  if (chartData.length < 2) {
    return (
      <div className="card-non-interactive h-64 flex items-center justify-center">
        <p className="text-muted-plum dark:text-dark-textMuted">需要至少两条记录才能显示趋势图</p>
      </div>
    );
  }

  const weights = displayWeights;

  return (
    <div className="card-non-interactive">
      <h3 className="text-lg font-heading text-deep-rose dark:text-dark-rose mb-4">体重趋势</h3>

      {/* Plotly Chart */}
      <div
        ref={chartRef}
        style={{ width: '100%', height: '320px' }}
        className="rounded-xl overflow-hidden"
      />

      {/* Statistics Summary */}
      {chartData.length > 1 && (
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div className="p-3 rounded-xl bg-pink-50 dark:bg-dark-input">
            <p className="text-xs text-muted-plum dark:text-dark-textMuted mb-1">最高体重</p>
            <p className="text-lg font-heading text-deep-rose dark:text-dark-rose">
              {Math.max(...weights).toFixed(1)} {unitLabel}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-pink-50 dark:bg-dark-input">
            <p className="text-xs text-muted-plum dark:text-dark-textMuted mb-1">最低体重</p>
            <p className="text-lg font-heading text-deep-rose dark:text-dark-rose">
              {Math.min(...weights).toFixed(1)} {unitLabel}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-pink-50 dark:bg-dark-input">
            <p className="text-xs text-muted-plum dark:text-dark-textMuted mb-1">变化</p>
            <p className={`text-lg font-heading ${
              weights[weights.length - 1] - weights[0] > 0
                ? 'text-red-400'
                : 'text-sage-500'
            }`}>
              {(weights[weights.length - 1] - weights[0]).toFixed(1)} {unitLabel}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export const TrendChart = memo(TrendChartComponent);
