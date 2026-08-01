import React from 'react';
import {
  Shirt,
  Umbrella,
  Car,
  Activity,
  Flower2,
  HeartPulse,
  Lightbulb,
  Compass,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import {
  getClothingRecommendation,
  getUmbrellaRecommendation,
  getDrivingConditions,
  getOutdoorActivities,
  getPollenRisk,
  getHealthRecommendations
} from '../utils/lifestyleCalc';

export default function LifestyleHealthGrid({ currentWeather, pollutionData }) {
  if (!currentWeather) return null;

  const tempC = currentWeather?.main?.temp;
  const humidity = currentWeather?.main?.humidity;
  const windSpeed = currentWeather?.wind?.speed || 0;
  const mainCond = currentWeather?.weather?.[0]?.main || 'Clear';
  const cloudsAll = currentWeather?.clouds?.all || 0;
  const vis = currentWeather?.visibility || 10000;
  const uvi = currentWeather?.uvi || 4;

  const aqiVal = pollutionData?.list?.[0]?.main?.aqi || 1;

  const clothing = getClothingRecommendation(tempC, mainCond, windSpeed);
  const umbrella = getUmbrellaRecommendation(mainCond, cloudsAll);
  const driving = getDrivingConditions(vis, windSpeed, mainCond);
  const activities = getOutdoorActivities(tempC, humidity, windSpeed, mainCond, uvi);
  const pollen = getPollenRisk(humidity, windSpeed, mainCond);
  const healthTips = getHealthRecommendations(tempC, humidity, uvi, aqiVal);

  return (
    <div style={{ marginBottom: '2rem' }}>
      <div className="section-heading">
        <Activity size={22} style={{ color: 'var(--color-primary)' }} />
        <h3>Lifestyle, Health & Weather Insights</h3>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {/* 1. Clothing Suggestions */}
        <div className="metric-card animate-slideUp">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.85rem' }}>
            <div style={{ padding: '8px', borderRadius: 'var(--radius-md)', background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8' }}>
              <Shirt size={20} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: '700', textTransform: 'uppercase' }}>
                Clothing Suggestion
              </span>
              <h4 style={{ fontSize: '1rem', fontWeight: '800', color: '#FFF' }}>What to Wear</h4>
            </div>
          </div>
          <p style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--color-primary)', marginBottom: '4px' }}>
            {clothing.outfit}
          </p>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', lineHeight: '1.4' }}>
            {clothing.tip}
          </p>
        </div>

        {/* 2. Umbrella Recommendation */}
        <div className="metric-card animate-slideUp delay-1">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.85rem' }}>
            <div style={{ padding: '8px', borderRadius: 'var(--radius-md)', background: `${umbrella.color}20`, color: umbrella.color }}>
              <Umbrella size={20} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: '700', textTransform: 'uppercase' }}>
                Umbrella Advisory
              </span>
              <h4 style={{ fontSize: '1rem', fontWeight: '800', color: '#FFF' }}>{umbrella.status}</h4>
            </div>
          </div>
          <div style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 'var(--radius-pill)', background: `${umbrella.color}25`, color: umbrella.color, fontSize: '0.78rem', fontWeight: '700', marginBottom: '6px' }}>
            {umbrella.badge}
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', lineHeight: '1.4' }}>
            {umbrella.detail}
          </p>
        </div>

        {/* 3. Driving Conditions */}
        <div className="metric-card animate-slideUp delay-2">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.85rem' }}>
            <div style={{ padding: '8px', borderRadius: 'var(--radius-md)', background: `${driving.color}20`, color: driving.color }}>
              <Car size={20} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: '700', textTransform: 'uppercase' }}>
                Road Safety
              </span>
              <h4 style={{ fontSize: '1rem', fontWeight: '800', color: '#FFF' }}>{driving.rating}</h4>
            </div>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', lineHeight: '1.4' }}>
            {driving.advice}
          </p>
        </div>

        {/* 4. Pollen Information */}
        <div className="metric-card animate-slideUp delay-3">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.85rem' }}>
            <div style={{ padding: '8px', borderRadius: 'var(--radius-md)', background: `${pollen.color}20`, color: pollen.color }}>
              <Flower2 size={20} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: '700', textTransform: 'uppercase' }}>
                Allergen Index
              </span>
              <h4 style={{ fontSize: '1rem', fontWeight: '800', color: '#FFF' }}>{pollen.level}</h4>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <div style={{ flex: 1, height: '6px', borderRadius: 'var(--radius-pill)', background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
              <div style={{ width: `${(pollen.score / 10) * 100}%`, height: '100%', background: pollen.color, borderRadius: 'var(--radius-pill)' }} />
            </div>
            <span style={{ fontSize: '0.78rem', fontWeight: '800', color: pollen.color }}>{pollen.score}/10</span>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', lineHeight: '1.4' }}>
            {pollen.detail}
          </p>
        </div>

        {/* 5. Outdoor Activity Suggestions */}
        <div className="metric-card animate-slideUp delay-4" style={{ gridColumn: 'span 1 / -1' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            <div style={{ padding: '8px', borderRadius: 'var(--radius-md)', background: 'rgba(251, 191, 36, 0.2)', color: 'var(--color-primary)' }}>
              <Compass size={20} />
            </div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#FFF' }}>
              Outdoor Activity Ratings
            </h4>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '0.85rem',
            }}
          >
            {activities.map((act) => (
              <div
                key={act.name}
                style={{
                  background: 'rgba(0, 0, 0, 0.25)',
                  border: '1px solid var(--card-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.2rem' }}>{act.icon}</span>
                  <span style={{ fontSize: '0.84rem', fontWeight: '700', color: 'var(--color-text)' }}>{act.name}</span>
                </div>
                <div
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: '800',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-pill)',
                    background: act.score >= 7 ? 'rgba(34, 197, 94, 0.2)' : act.score >= 4 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    color: act.score >= 7 ? '#22C55E' : act.score >= 4 ? '#F59E0B' : '#EF4444',
                  }}
                >
                  {act.score}/10
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Health & Wellness Tips */}
        <div className="metric-card animate-slideUp delay-4" style={{ gridColumn: 'span 1 / -1' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            <div style={{ padding: '8px', borderRadius: 'var(--radius-md)', background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444' }}>
              <HeartPulse size={20} />
            </div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#FFF' }}>
              Health & Wellness Recommendations
            </h4>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {healthTips.map((tip, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  borderLeft: `4px solid ${tip.color}`,
                }}
              >
                <CheckCircle2 size={16} style={{ color: tip.color, marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <span style={{ fontSize: '0.78rem', fontWeight: '800', color: tip.color, textTransform: 'uppercase' }}>
                    {tip.category}
                  </span>
                  <p style={{ fontSize: '0.86rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                    {tip.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
