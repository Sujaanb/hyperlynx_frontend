import React from 'react';

interface ComplianceGaugeProps {
  score: number;
  framework?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function ComplianceGauge({ score, framework, size = 'md' }: ComplianceGaugeProps) {
  const radius = size === 'sm' ? 40 : size === 'md' ? 60 : 80;
  const strokeWidth = size === 'sm' ? 8 : size === 'md' ? 10 : 12;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = (score: number) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-36 h-36',
    lg: 'w-48 h-48'
  };

  const textSize = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl'
  };

  return (
    <div className={`relative ${sizeClasses[size]} flex items-center justify-center`}>
      <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
        <circle
          stroke="#e5e7eb"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={getColor(score)}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease' }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`${textSize[size]}`} style={{ color: getColor(score) }}>
          {score}%
        </span>
        {framework && <span className="text-xs text-gray-500 mt-1">{framework}</span>}
      </div>
    </div>
  );
}
