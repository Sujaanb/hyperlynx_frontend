export const ScanningIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="12" fill="url(#gradient1)" fillOpacity="0.1"/>
    <g transform="translate(12, 12)">
      <path d="M3 3h4M17 3h4M3 21h4M17 21h4" stroke="url(#gradient1)" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="12" cy="12" r="8" stroke="url(#gradient1)" strokeWidth="2" strokeDasharray="4 4">
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 12 12"
          to="360 12 12"
          dur="8s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="12" cy="12" r="3" fill="url(#gradient1)"/>
    </g>
    <defs>
      <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8b5cf6"/>
        <stop offset="100%" stopColor="#6366f1"/>
      </linearGradient>
    </defs>
  </svg>
);

export const ChangeManagementIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="12" fill="url(#gradient2)" fillOpacity="0.1"/>
    <g transform="translate(12, 12)">
      <path d="M4 4h7v7H4z" stroke="url(#gradient2)" strokeWidth="2" fill="none"/>
      <path d="M13 4h7v7h-7z" stroke="url(#gradient2)" strokeWidth="2" fill="none"/>
      <path d="M4 13h7v7H4z" stroke="url(#gradient2)" strokeWidth="2" fill="none"/>
      <path d="M13 13h7v7h-7z" stroke="url(#gradient2)" strokeWidth="2" fill="url(#gradient2)" fillOpacity="0.3"/>
      <circle cx="16.5" cy="16.5" r="1.5" fill="#8b5cf6"/>
    </g>
    <defs>
      <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8b5cf6"/>
        <stop offset="100%" stopColor="#6366f1"/>
      </linearGradient>
    </defs>
  </svg>
);

export const GapAnalysisIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="12" fill="url(#gradient3)" fillOpacity="0.1"/>
    <g transform="translate(12, 12)">
      <path d="M2 2h20v20H2z" stroke="url(#gradient3)" strokeWidth="2" strokeDasharray="3 3" fill="none"/>
      <rect x="5" y="5" width="6" height="6" fill="url(#gradient3)" fillOpacity="0.3" stroke="url(#gradient3)" strokeWidth="1.5"/>
      <rect x="13" y="13" width="6" height="6" fill="url(#gradient3)" fillOpacity="0.3" stroke="url(#gradient3)" strokeWidth="1.5"/>
      <path d="M11 7.5h2M7.5 11v2M13 16.5h2M16.5 13v2" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round"/>
    </g>
    <defs>
      <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8b5cf6"/>
        <stop offset="100%" stopColor="#6366f1"/>
      </linearGradient>
    </defs>
  </svg>
);

export const AIAssistantIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="12" fill="url(#gradient4)" fillOpacity="0.1"/>
    <g transform="translate(12, 12)">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="url(#gradient4)" strokeWidth="2" fill="none"/>
      <path d="M8 10h8M8 14h5" stroke="url(#gradient4)" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="6" cy="2" r="1.5" fill="#8b5cf6">
        <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="12" cy="2" r="1.5" fill="#8b5cf6">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="18" cy="2" r="1.5" fill="#8b5cf6">
        <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite"/>
      </circle>
    </g>
    <defs>
      <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8b5cf6"/>
        <stop offset="100%" stopColor="#6366f1"/>
      </linearGradient>
    </defs>
  </svg>
);
