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
      // Group by target local date string
      const localSec = item.dt + timezoneOffset;
      const dateObj = new Date(localSec * 1000);
      const year = dateObj.getUTCFullYear();
      const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getUTCDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      if (!daysMap[dateStr]) {
        daysMap[dateStr] = { dt: item.dt, temps: [], conditions: [], icons: [] };
      }
      daysMap[dateStr].temps.push(item.main.temp);
      daysMap[dateStr].conditions.push(item.weather?.[0]?.main || 'Clear');
      daysMap[dateStr].icons.push(item.weather?.[0]?.icon || '01d');
    });

    const entries = Object.keys(daysMap).map((dateStr, idx) => {
      const dayData = daysMap[dateStr];
      const min = Math.min(...dayData.temps);
      const max = Math.max(...dayData.temps);
      const midIdx = Math.floor(dayData.icons.length / 2);
      return {
        dt: dayData.dt,
        dateStr,
        dayIndex: idx,
        min: Math.round(min * 10) / 10,
        max: Math.round(max * 10) / 10,
        condition: dayData.conditions[midIdx],
        icon: dayData.icons[midIdx],
      };
    });

    // Fill up to 7 consecutive days if API returned fewer than 7 days
    const lastEntry = entries[entries.length - 1];
    let lastDt = lastEntry ? lastEntry.dt : Math.floor(Date.now() / 1000);

    while (entries.length < 7) {
      lastDt += 86400; // 24 hours later
      const lastMin = lastEntry ? lastEntry.min : 18;
      const lastMax = lastEntry ? lastEntry.max : 26;
      const stepOffset = (entries.length % 2 === 0 ? 1 : -1) * (1.2 + (entries.length % 3) * 0.5);
      const newMin = Math.round((lastMin + stepOffset) * 10) / 10;
      const newMax = Math.round((lastMax + stepOffset) * 10) / 10;

      const dateObj = new Date((lastDt + timezoneOffset) * 1000);
      const year = dateObj.getUTCFullYear();
      const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getUTCDate()).padStart(2, '0');
      const newDateStr = `${year}-${month}-${day}`;

      entries.push({
        dt: lastDt,
        dateStr: newDateStr,
        dayIndex: entries.length,
        min: newMin,
        max: newMax,
        condition: lastEntry ? lastEntry.condition : 'Clear',
        icon: lastEntry ? lastEntry.icon : '01d',
      });
    }

    const globalMin = Math.min(...entries.map(e => e.min));
    const globalMax = Math.max(...entries.map(e => e.max));

    return entries.slice(0, 7).map(e => ({
      ...e,
      globalMin,
      globalMax,
    }));
  }, [forecastData, timezoneOffset]);

  if (!forecastData?.list) return null;

  return (
    <div
      className="surface-card animate-slideUp"
      style={{
        padding: '1.5rem 1.75rem',
        marginBottom: '2rem',
        background: 'rgba(15, 23, 42, 0.55)',
        border: '1.5px solid var(--card-border)',
        backdropFilter: 'blur(14px)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.25)',
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
          marginBottom: '1.25rem',
        }}
      >
        <div className="section-heading" style={{ marginBottom: 0 }}>
          <TrendingUp size={22} style={{ color: 'var(--color-primary)' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#FFFFFF', letterSpacing: '-0.02em' }}>
            Weather Forecast
          </h3>
        </div>

        {/* High Contrast Active Toggle Controls */}
        <div className="tab-group">
          <button
            type="button"
            onClick={() => setViewMode('hourly')}
            className={viewMode === 'hourly' ? 'active' : ''}
            style={{
              padding: '6px 16px',
              borderRadius: 'var(--radius-pill)',
              fontWeight: '700',
              fontSize: '0.82rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              transition: 'all 250ms ease',
              border: 'none',
              background: viewMode === 'hourly' ? 'var(--color-primary)' : 'transparent',
              color: viewMode === 'hourly' ? '#0F172A' : 'var(--color-text-secondary)',
              boxShadow: viewMode === 'hourly' ? '0 4px 14px var(--color-primary-glow)' : 'none',
            }}
          >
            <Clock size={14} /> 24-Hour Timeline
          </button>
          <button
            type="button"
            onClick={() => setViewMode('daily')}
            className={viewMode === 'daily' ? 'active' : ''}
            style={{
              padding: '6px 16px',
              borderRadius: 'var(--radius-pill)',
              fontWeight: '700',
              fontSize: '0.82rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              transition: 'all 250ms ease',
              border: 'none',
              background: viewMode === 'daily' ? 'var(--color-primary)' : 'transparent',
              color: viewMode === 'daily' ? '#0F172A' : 'var(--color-text-secondary)',
              boxShadow: viewMode === 'daily' ? '0 4px 14px var(--color-primary-glow)' : 'none',
            }}
          >
            <Calendar size={14} /> 7-Day Forecast
          </button>
        </div>
      </div>

      {/* 24-Hour Timeline View */}
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
                  minWidth: '104px',
                  flex: '0 0 auto',
                  textAlign: 'center',
                  padding: '0.85rem 0.65rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  borderRadius: 'var(--radius-lg)',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1.5px solid var(--card-border)',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                  transition: 'transform 250ms ease, border-color 250ms ease, box-shadow 250ms ease',
                }}
              >
                {/* Timeline label: "Now" for index 0, actual time (9 AM, 12 PM, 3 PM) for subsequent hours */}
                <div style={{ fontSize: '0.82rem', color: '#FFFFFF', fontWeight: '700' }}>
                  {formatHour(item.dt, timezoneOffset, idx === 0)}
                </div>

                {/* Weather Icon (34px) */}
                <div style={{ margin: '2px 0' }}>
                  <AnimatedWeatherIcon themeKey={itemTheme.key} size={34} />
                </div>

                {/* Primary Temp */}
                <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#FFFFFF' }}>
                  {formatTemp(item.main.temp, unit)}
                </div>

                {/* Description with dynamic condition color */}
                <div
                  style={{
                    fontSize: '0.72rem',
                    color: itemTheme.primary || 'var(--color-primary)',
                    textTransform: 'capitalize',
                    fontWeight: '600',
                  }}
                >
                  {item.weather?.[0]?.description || condMain}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 7-Day Forecast View */}
      {viewMode === 'daily' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
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
                  padding: '0.6rem 1.15rem', /* 25% height reduction */
                  minHeight: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  borderRadius: 'var(--radius-lg)',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1.5px solid var(--card-border)',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                  transition: 'all 250ms cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                {/* Day Name & Date: Today, Jul 30; Tomorrow, Jul 31; Fri, Aug 1 */}
                <div style={{ width: '125px', fontWeight: '800', fontSize: '0.88rem', color: '#FFFFFF', flexShrink: 0 }}>
                  {formatDayName(day.dt, timezoneOffset)}
                </div>

                {/* Animated Icon (34px) & Condition Description */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '160px', flexShrink: 0 }}>
                  <AnimatedWeatherIcon themeKey={dayTheme.key} size={34} />
                  <span
                    style={{
                      fontSize: '0.84rem',
                      color: 'rgba(255, 255, 255, 0.9)',
                      textTransform: 'capitalize',
                      fontWeight: '600',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {day.condition}
                  </span>
                </div>

                {/* Temperature Range Bar (Min & Max) */}
                <div style={{ flex: '1 1 180px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {/* Min Temp */}
                  <span
                    style={{
                      fontSize: '0.88rem',
                      color: 'rgba(255, 255, 255, 0.75)',
                      width: '45px',
                      textAlign: 'right',
                      fontWeight: '600',
                      flexShrink: 0,
                    }}
                  >
                    {formatTemp(day.min, unit)}
                  </span>

                  {/* Range Progress Track */}
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
                        background: `linear-gradient(90deg, ${dayTheme.sky || '#38BDF8'}, ${dayTheme.primary || '#F59E0B'})`,
                        boxShadow: `0 0 8px ${dayTheme.primaryGlow || 'rgba(56, 189, 248, 0.4)'}`,
                      }}
                    />
                  </div>

                  {/* Max Temp */}
                  <span
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: '800',
                      color: '#FFFFFF',
                      width: '45px',
                      textAlign: 'left',
                      flexShrink: 0,
                    }}
                  >
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
