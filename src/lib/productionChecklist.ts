export interface ChecklistItem {
  id: string;
  category: 'Security & Auth' | 'Database & Storage' | 'Hardware & IoT Integration' | 'Performance & PWA' | 'Compliance & Audit';
  title: string;
  description: string;
  status: 'Completed_In_Demo' | 'Pending_Production' | 'In_Progress';
  priority: 'Critical' | 'High' | 'Medium';
}

export const productionChecklist: ChecklistItem[] = [
  {
    id: 'chk-1',
    category: 'Security & Auth',
    title: 'Replace Mock Auth with NextAuth.js / Supabase Auth',
    description: 'Implement JWT/OAuth2 authentication with HTTP-only cookies, role-based access control (RBAC), and session expiration.',
    status: 'Pending_Production',
    priority: 'Critical',
  },
  {
    id: 'chk-2',
    category: 'Security & Auth',
    title: 'Enable Two-Factor Authentication (2FA / TOTP) for Admins',
    description: 'Require TOTP authenticator app verification for property managers and security supervisors before altering unit access rules.',
    status: 'Pending_Production',
    priority: 'High',
  },
  {
    id: 'chk-3',
    category: 'Database & Storage',
    title: 'Connect PostgreSQL Database via Prisma ORM',
    description: 'Migrate mock in-memory state store to a resilient PostgreSQL schema with proper foreign key indexes on Unit, VisitorPass, and ParkingBay.',
    status: 'Pending_Production',
    priority: 'Critical',
  },
  {
    id: 'chk-4',
    category: 'Hardware & IoT Integration',
    title: 'RTSP IP Camera Stream & Edge LPR SDK Setup',
    description: 'Hook up live RTSP streams from Hikvision/Dahua cameras to Plate Recognizer API or local OpenALPR edge SDK daemon.',
    status: 'Pending_Production',
    priority: 'High',
  },
  {
    id: 'chk-5',
    category: 'Hardware & IoT Integration',
    title: 'Relay Controller MQTT / Modbus Sync for Gates',
    description: 'Connect Raspberry Pi or Web Relay controller to physical barrier gates for sub-500ms trigger opening.',
    status: 'Pending_Production',
    priority: 'Critical',
  },
  {
    id: 'chk-6',
    category: 'Performance & PWA',
    title: 'Service Worker Offline Caching & Background Sync',
    description: 'Ensure guard tablet PWA buffers visitor entries locally in IndexedDB when guardhouse Wi-Fi drops, and syncs automatically when online.',
    status: 'Completed_In_Demo',
    priority: 'Critical',
  },
  {
    id: 'chk-7',
    category: 'Compliance & Audit',
    title: 'Data Privacy & Visitor PII Encrypted Archiving',
    description: 'Automatically mask visitor phone numbers and purge ID snapshot images after 30 days according to local privacy laws (GDPR/PDPA).',
    status: 'Pending_Production',
    priority: 'High',
  },
];
