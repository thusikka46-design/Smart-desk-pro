export type PageId = 'dashboard' | 'incidents' | 'assets' | 'vault' | 'docs' | 'ai-hub';

export type UserRole = 'Lead SRE' | 'DevOps Architect' | 'SecOps Specialist' | 'Developer';

export type IncidentStatus = 'Open' | 'In Progress' | 'Pending Review' | 'Resolved';
export type IncidentSeverity = 'Critical' | 'High' | 'Medium' | 'Low';
export type Department = 'Infrastructure' | 'Frontend' | 'DevOps' | 'Security' | 'Database';

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  role: string;
  content: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  title: string;
  service: string;
  priority: 'P1' | 'P2' | 'P3' | 'P4';
  severity: IncidentSeverity;
  status: IncidentStatus;
  department: Department;
  assignee: {
    name: string;
    avatar: string;
    role: string;
  };
  reporter: string;
  description: string;
  snippet?: string;
  slaDueMinutes: number; // minutes remaining
  slaTargetHours: number;
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
  tags: string[];
}

export type AssetType = 'Cloud' | 'Hardware' | 'Database' | 'Software License';
export type HealthStatus = 'Nominal' | 'Degraded' | 'Offline';

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  ip: string;
  assignedUser: {
    name: string;
    avatar: string;
    role: string;
  };
  uptimePercent: number;
  specs: {
    label: string;
    value: string;
  }[];
  healthStatus: HealthStatus;
  location: string;
  lastChecked: string;
  latencyMs: number;
  loadPercent: number;
}

export type CodeLanguage = 'sql' | 'docker' | 'bash' | 'python' | 'javascript' | 'k8s';

export interface CodeSnippet {
  id: string;
  title: string;
  language: CodeLanguage;
  category: string;
  code: string;
  description: string;
  copyCount: number;
  tags: string[];
  outputExample?: string;
}

export type DocCategory = 'Onboarding Guides' | 'Security Protocols' | 'API Integration Docs' | 'Troubleshooting Runbooks';

export interface DocArticle {
  id: string;
  title: string;
  category: DocCategory;
  readTime: string;
  summary: string;
  author: string;
  lastUpdated: string;
  helpfulCount: number;
  steps: {
    step: number;
    title: string;
    content: string;
  }[];
  codeSnippets?: {
    lang: string;
    code: string;
  }[];
  warnings?: string[];
}

export interface SystemService {
  id: string;
  name: string;
  region: string;
  status: 'operational' | 'degraded' | 'maintenance';
  latencyMs: number;
  cpuPercent: number;
  memoryPercent: number;
  uptimePercent: number;
  lastPing: string;
}

export interface ActivityItem {
  id: string;
  timestamp: string;
  user: {
    name: string;
    avatar: string;
  };
  action: string;
  target: string;
  category: 'ticket' | 'asset' | 'diagnostic' | 'security';
  severity?: 'critical' | 'warning' | 'info';
}

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  codeBlock?: {
    lang: string;
    code: string;
  };
  diagnosticData?: {
    service: string;
    status: string;
    latency: string;
    metrics: string[];
  };
}

export type HealthEventType = 'recovered' | 'degraded' | 'autoscaled' | 'failover' | 'maintenance';

export interface HealthTimelineEvent {
  id: string;
  timestamp: string;
  exactTime: string;
  serviceId: string;
  serviceName: string;
  region: string;
  type: HealthEventType;
  title: string;
  description: string;
  durationSeconds: number;
  triggerMechanism: 'Automated SRE Agent' | 'Kubernetes Controller' | 'AWS Auto Scaling' | 'Sentinel Failover' | 'Cloudflare WAF Rule';
  status: 'Resolved Automatically' | 'Mitigated' | 'In Progress';
  metricsBefore?: string;
  metricsAfter?: string;
  automatedRemediationScript?: string;
  rootCauseTag: string;
}
