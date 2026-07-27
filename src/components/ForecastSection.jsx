import React, { useState, useMemo } from 'react';
import { Calendar, Clock, TrendingUp, BarChart2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { formatTemp, formatHour, formatDayName, convertTemp } from '../utils/formatters';
import { useWeatherContext } from '../context/WeatherContext';

export default function ForecastSection({ forecastData, timezoneOffset = 0 }) {
  const { unit } = useWeatherContext();
  const [viewMode, setViewMode] = useState('hourly'); // 'hourly' | 'daily' | 'chart'

  const hourlyList = useMemo(() => {
    if (!forecastData?.list) return [];
    // First 12 3-hour entries (36 hours)
    return forecastData.list.slice(0, 12);
  }, [forecastData]);

  // Aggregate 5-day daily min/max summaries
  const dailyList = useMemo(() => {
    if (!forecastData?.list) return [];
    const daysMap = {};

    forecastData.list.forEach((item) => {
      const dateStr = item.dt_txt ? item.dt_txt.split(' ')[0] : new Date(item.dt * 1000).toISOString().split('T')[0];
      if (!daysMap[dateStr]) {
        daysMap[dateStr] = {
          dt: item.dt,
          temps: [],
          conditions: [],
          icons: [],
        };
      }
      daysMap[dateStr].temps.push(item.main.temp);
      daysMap[dateStr].conditions.push(item.weather?.[0]?.description || item.weather?.[0]?.main || '');
      daysMap[dateStr].icons.push(item.weather?.[0]?.icon || '01d');
    });

    return Object.keys(daysMap).slice(0, 5).map((dateStr) => {
      const dayData = daysMap[dateStr];
      const min = Math.min(...dayData.temps);
      const max = Math.max(...dayData.temps);
      // Pick middle icon for representative condition
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
  }, [forecastData]);

  // Prepare chart dataset
  const chartData = useMemo(() => {
    return hourlyList.map((item) => ({
      time: formatHour(item.dt, timezoneOffset),
      rawTemp: item.main.temp,
      temp: convertTemp(item.main.temp, unit),
      condition: item.weather?.[0]?.main || '',
    }));
  }, [hourlyList, unit, timezoneOffset]);

  if (!forecastData?.list) return null;

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
      {/* Header & Tabs */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={22} style={{ color: 'var(--color-primary)' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff' }}>Forecast & Temperature Trend</h3>
        </div>

        {/* View Switcher Tabs */}
        <div
          style={{
            display: 'inline-flex',
            background: 'rgba(0,0,0,0.25)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '9999px',
            padding: '3px',
          }}
        >
          <button
            type="button"
            onClick={() => setViewMode('hourly')}
            style={{
              background: viewMode === 'hourly' ? 'var(--color-primary)' : 'transparent',
              color: viewMode === 'hourly' ? '#1a1a1a' : '#fff',
              border: 'none',
              borderRadius: '9999px',
              padding: '6px 14px',
              fontWeight: '600',
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.2s ease',
            }}
          >
            <Clock size={14} /> Hourly
          </button>

          <button
            type="button"
            onClick={() => setViewMode('daily')}
            style={{
              background: viewMode === 'daily' ? 'var(--color-primary)' : 'transparent',
              color: viewMode === 'daily' ? '#1a1a1a' : '#fff',
              border: 'none',
              borderRadius: '9999px',
              padding: '6px 14px',
              fontWeight: '600',
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.2s ease',
            }}
          >
            <Calendar size={14} /> 5-Day
          </button>

          <button
            type="button"
            onClick={() => setViewMode('chart')}
            style={{
              background: viewMode === 'chart' ? 'var(--color-primary)' : 'transparent',
              color: viewMode === 'chart' ? '#1a1a1a' : '#fff',
              border: 'none',
              borderRadius: '9999px',
              padding: '6px 14px',
              fontWeight: '600',
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.2s ease',
            }}
          >
            <BarChart2 size={14} /> Trend Curve
          </button>
        </div>
      </div>

      {/* 1. HOURLY CARDS SCROLL ROW */}
      {viewMode === 'hourly' && (
        <div
          style={{
            display: 'flex',
            gap: '0.85rem',
            overflowX: 'auto',
            paddingBottom: '0.5rem',
            scrollbarWidth: 'thin',
          }}
        >
          {hourlyList.map((item, idx) => {
            const iconUrl = item.weather?.[0]?.icon
              ? `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`
              : null;
            return (
              <div
                key={item.dt || idx}
                className="glass-card-sm"
                style={{
                  minWidth: '100px',
                  flex: '0 0 auto',
                  textAlign: 'center',
                  padding: '1rem 0.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', fontWeight: '500' }}>
                  {formatHour(item.dt, timezoneOffset)}
                </div>

                {iconUrl && (
                  <img
                    src={iconUrl}
                    alt={item.weather?.[0]?.main}
                    style={{ width: '48px', height: '48px', margin: '4px 0' }}
                  />
                )}

                <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff' }}>
                  {formatTemp(item.main.temp, unit)}
                </div>

                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', textTransform: 'capitalize' }}>
                  {item.weather?.[0]?.main}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. 5-DAY DAILY SUMMARY ROW */}
      {viewMode === 'daily' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.85rem' }}>
          {dailyList.map((day) => {
            const iconUrl = day.icon ? `https://openweathermap.org/img/wn/${day.icon}@2x.png` : null;
            return (
              <div
                key={day.dateStr}
                className="glass-card-sm"
                style={{
                  padding: '1.25rem 0.85rem',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <div style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--color-primary)' }}>
                  {formatDayName(day.dt, timezoneOffset)}
                </div>

                {iconUrl && <img src={iconUrl} alt={day.condition} style={{ width: '56px', height: '56px' }} />}

                <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', textTransform: 'capitalize' }}>
                  {day.condition}
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '6px', fontSize: '0.9rem', fontWeight: '600' }}>
                  <span style={{ color: '#ff6b6b' }}>{formatTemp(day.max, unit)}</span>
                  <span style={{ color: 'rgba(255,255,255,0.4)' }}>|</span>
                  <span style={{ color: '#4dabf7' }}>{formatTemp(day.min, unit)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. RECHARTS AREA CHART */}
      {viewMode === 'chart' && (
        <div style={{ width: '100%', height: 220, marginTop: '0.5rem' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 11 }} />
              <YAxis stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 11 }} unit={`°${unit}`} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div
                        style={{
                          background: 'rgba(15, 20, 30, 0.9)',
                          border: '1px solid rgba(255,255,255,0.2)',
                          padding: '8px 12px',
                          borderRadius: '10px',
                          color: '#fff',
                          fontSize: '0.82rem',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                        }}
                      >
                        <div style={{ fontWeight: '600', color: 'var(--color-primary)' }}>{data.time}</div>
                        <div>
                          Temp: {data.temp}°{unit}
                        </div>
                        <div style={{ color: 'rgba(255,255,255,0.7)' }}>{data.condition}</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="temp"
                stroke="var(--color-primary)"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#tempGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
