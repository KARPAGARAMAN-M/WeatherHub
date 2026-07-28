import React, { useState, useMemo } from 'react';
import { Calendar, Clock, TrendingUp } from 'lucide-react';
import { formatTemp, formatHour, formatDayName } from '../utils/formatters';
import { useWeatherContext } from '../context/WeatherContext';
import { getThemeForCondition } from '../utils/weatherTheme';
import AnimatedWeatherIcon from './AnimatedWeatherIcon';

export default function ForecastSection({ forecastData, timezoneOffset = 0 }) {
  const { unit } = useWeatherContext();
  const [viewMode, setViewMode] = useState('hourly');

  const hourlyList = useMemo(() => {
    if (!forecastData?.list) return [];
    return forecastData.list.slice(0, 12);
  }, [forecastData]);

  const dailyList = useMemo(() => {
    if (!forecastData?.list) return [];
    const daysMap = {};

    forecastData.list.forEach((item) => {
      const dateStr = item.dt_txt ? item.dt_txt.split(' ')[0] : new Date(item.dt * 1000).toISOString().split('T')[0];
      if (!daysMap[dateStr]) {
        daysMap[dateStr] = { dt: item.dt, temps: [], conditions: [], icons: [] };
      }
      daysMap[dateStr].temps.push(item.main.temp);
      daysMap[dateStr].conditions.push(item.weather?.[0]?.main || 'Clear');
      daysMap[dateStr].icons.push(item.weather?.[0]?.icon || '01d');
    });

    const entries = Object.keys(daysMap).slice(0, 7).map((dateStr) => {
      const dayData = daysMap[dateStr];
      const min = Math.min(...dayData.temps);
      const max = Math.max(...dayData.temps);
      const midIdx = Math.floor(dayData.icons.length / 2);
      return {
        dt: dayData.dt,
        dateStr,
        min,
        max,
        condition: dayData.conditions[midIdx],
        icon: dayData.icons[midIdx],
      };
    });

    // Calculate global min and max for scaling temperature progress bars
    const globalMin = Math.min(...entries.map(e => e.min));
    const globalMax = Math.max(...entries.map(e => e.max));

    return entries.map(e => ({
      ...e,
      globalMin,
      globalMax,
    }));
  }, [forecastData]);

  if (!forecastData?.list) return null;

  return (
    <div
      className="surface-card animate-slideUp"
      style={{
        padding: '1.75rem',
        marginBottom: '2rem',
      }}
    >
      {/* Header & View Mode Selector */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '1.35rem',
        }}
      >
        <div className="section-heading" style={{ marginBottom: 0 }}>
          <TrendingUp size={20} />
          <h3>Weather Forecast</h3>
        </div>

        {/* Tab Controls */}
        <div className="tab-group">
          <button
            type="button"
            onClick={() => setViewMode('hourly')}
            className={viewMode === 'hourly' ? 'active' : ''}
          >
            <Clock size={14} /> 24-Hour Timeline
          </button>
          <button
            type="button"
            onClick={() => setViewMode('daily')}
            className={viewMode === 'daily' ? 'active' : ''}
          >
            <Calendar size={14} /> 7-Day Forecast
          </button>
        </div>
      </div>

      {/* Hourly View */}
      {viewMode === 'hourly' && (
        <div
          style={{
            display: 'flex',
            gap: '0.75rem',
            overflowX: 'auto',
            paddingBottom: '0.75rem',
            scrollbarWidth: 'thin',
          }}
        >
          {hourlyList.map((item, idx) => {
            const condMain = item.weather?.[0]?.main || 'Clear';
            const iconCode = item.weather?.[0]?.icon || '01d';
            const itemTheme = getThemeForCondition(condMain, iconCode);

            return (
              <div
                key={item.dt || idx}
                className="metric-card"
                style={{
                  minWidth: '100px',
                  flex: '0 0 auto',
                  textAlign: 'center',
                  padding: '1rem 0.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', fontWeight: '600' }}>
                  {formatHour(item.dt, timezoneOffset)}
                </div>

                <div style={{ margin: '4px 0' }}>
                  <AnimatedWeatherIcon themeKey={itemTheme.key} size={42} />
                </div>

                <div style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--color-text)' }}>
                  {formatTemp(item.main.temp, unit)}
                </div>

                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', textTransform: 'capitalize' }}>
                  {item.weather?.[0]?.description || condMain}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 7-Day Forecast View */}
      {viewMode === 'daily' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {dailyList.map((day) => {
            const dayTheme = getThemeForCondition(day.condition, day.icon);
            const rangeSpan = Math.max(1, day.globalMax - day.globalMin);
            const leftPercent = Math.max(0, Math.min(80, ((day.min - day.globalMin) / rangeSpan) * 100));
            const widthPercent = Math.max(15, Math.min(100 - leftPercent, ((day.max - day.min) / rangeSpan) * 100));

            return (
              <div
                key={day.dateStr}
                className="metric-card"
                style={{
                  padding: '0.85rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  flexWrap: 'wrap',
                }}
              >
                {/* Day Name */}
                <div style={{ width: '90px', fontWeight: '700', fontSize: '0.92rem', color: 'var(--color-text)' }}>
                  {formatDayName(day.dt, timezoneOffset)}
                </div>

                {/* Animated Icon & Condition */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '150px' }}>
                  <AnimatedWeatherIcon themeKey={dayTheme.key} size={36} />
                  <span style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', textTransform: 'capitalize', fontWeight: '500' }}>
                    {day.condition}
                  </span>
                </div>

                {/* Temperature visual bar */}
                <div style={{ flex: '1 1 180px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {/* Min Temp */}
                  <span style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', width: '42px', textAlign: 'right', fontWeight: '600' }}>
                    {formatTemp(day.min, unit)}
                  </span>

                  {/* Progress track */}
                  <div
                    style={{
                      flex: 1,
                      height: '6px',
                      borderRadius: 'var(--radius-pill)',
                      background: 'rgba(255, 255, 255, 0.12)',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: `${leftPercent}%`,
                        width: `${widthPercent}%`,
                        height: '100%',
                        borderRadius: 'var(--radius-pill)',
                        background: 'linear-gradient(90deg, var(--color-sky), var(--color-primary))',
                        boxShadow: '0 0 8px var(--color-primary-glow)',
                      }}
                    />
                  </div>

                  {/* Max Temp */}
                  <span style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--color-text)', width: '42px' }}>
                    {formatTemp(day.max, unit)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
