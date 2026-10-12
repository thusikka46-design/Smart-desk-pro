import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PageId,
  UserRole,
  Ticket,
  Asset,
  CodeSnippet,
  DocArticle,
  SystemService,
  ActivityItem,
  AiChatMessage,
  IncidentStatus,
  IncidentSeverity,
  HealthTimelineEvent
} from '../types';
import {
  INITIAL_TICKETS,
  INITIAL_ASSETS,
  INITIAL_SNIPPETS,
  INITIAL_DOCS,
  INITIAL_SERVICES,
  INITIAL_ACTIVITY,
  INITIAL_HEALTH_EVENTS,
  USER_PROFILES
} from '../data/mockData';

interface AppContextType {
  currentPage: PageId;
  navigateTo: (page: PageId) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  currentUserRole: UserRole;
  setUserRole: (role: UserRole) => void;
  currentUser: { name: string; avatar: string; email: string; team: string };
  tickets: Ticket[];
  assets: Asset[];
  snippets: CodeSnippet[];
  docs: DocArticle[];
  services: SystemService[];
  activity: ActivityItem[];
  healthEvents: HealthTimelineEvent[];
  aiMessages: AiChatMessage[];
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  quickAiOpen: boolean;
  setQuickAiOpen: (open: boolean) => void;
  logIncidentModalOpen: boolean;
  setLogIncidentModalOpen: (open: boolean) => void;
  prefilledIncidentData: Partial<Ticket> | null;
  diagnosticModalOpen: boolean;
  setDiagnosticModalOpen: (open: boolean) => void;
  activeDiagnosticAsset: Asset | null;
  accessModalOpen: boolean;
  setAccessModalOpen: (open: boolean) => void;
  activeAccessAsset: Asset | null;
  addSnippetModalOpen: boolean;
  setAddSnippetModalOpen: (open: boolean) => void;
  activeDocArticle: DocArticle | null;
  setActiveDocArticle: (doc: DocArticle | null) => void;
  
  // Actions
  addTicket: (ticket: {
    title: string;
    service: string;
    priority: 'P1' | 'P2' | 'P3' | 'P4';
    severity: IncidentSeverity;
    department: any;
    description: string;
    snippet?: string;
    assigneeName?: string;
  }) => void;
  updateTicketStatus: (ticketId: string, status: IncidentStatus) => void;
  updateTicketSeverity: (ticketId: string, severity: IncidentSeverity) => void;
  addTicketComment: (ticketId: string, content: string) => void;
  openDiagnostic: (asset: Asset) => void;
  openAccessRequest: (asset: Asset) => void;
  openReportFault: (asset: Asset) => void;
  addSnippet: (snippet: {
    title: string;
    language: any;
    category: string;
    description: string;
    code: string;
    tags: string[];
  }) => void;
  incrementSnippetCopy: (snippetId: string) => void;
  markDocHelpful: (docId: string) => void;
  sendAiMessage: (content: string) => Promise<void>;
  refreshSystemPings: () => void;
  simulateHealthRecovery: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<PageId>(() => {
    return (localStorage.getItem('smartdesk_page') as PageId) || 'dashboard';
  });

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('smartdesk_theme') as 'dark' | 'light') || 'dark';
  });

  const [currentUserRole, setCurrentUserRole] = useState<UserRole>(() => {
    return (localStorage.getItem('smartdesk_role') as UserRole) || 'Lead SRE';
  });

  const [tickets, setTickets] = useState<Ticket[]>(() => {
    const saved = localStorage.getItem('smartdesk_tickets');
    return saved ? JSON.parse(saved) : INITIAL_TICKETS;
  });

  const [assets, setAssets] = useState<Asset[]>(() => {
    const saved = localStorage.getItem('smartdesk_assets');
    return saved ? JSON.parse(saved) : INITIAL_ASSETS;
  });

  const [snippets, setSnippets] = useState<CodeSnippet[]>(() => {
    const saved = localStorage.getItem('smartdesk_snippets');
    return saved ? JSON.parse(saved) : INITIAL_SNIPPETS;
  });

  const [docs, setDocs] = useState<DocArticle[]>(() => {
    const saved = localStorage.getItem('smartdesk_docs');
    return saved ? JSON.parse(saved) : INITIAL_DOCS;
  });

  const [healthEvents, setHealthEvents] = useState<HealthTimelineEvent[]>(() => {
    const saved = localStorage.getItem('smartdesk_health_events');
    return saved ? JSON.parse(saved) : INITIAL_HEALTH_EVENTS;
  });

  const [services, setServices] = useState<SystemService[]>(INITIAL_SERVICES);
  const [activity, setActivity] = useState<ActivityItem[]>(INITIAL_ACTIVITY);

  const [aiMessages, setAiMessages] = useState<AiChatMessage[]>([
    {
      id: 'ai-welcome',
      sender: 'assistant',
      content: 'SmartDesk Diagnostic Intelligence online. I am integrated with AWS CloudWatch, Datadog traces, and Kubernetes telemetry. How can I assist with your infrastructure or developer workflows today?',
      timestamp: '10:00 AM'
    }
  ]);

  // Modals state
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [quickAiOpen, setQuickAiOpen] = useState(false);
  const [logIncidentModalOpen, setLogIncidentModalOpen] = useState(false);
  const [prefilledIncidentData, setPrefilledIncidentData] = useState<Partial<Ticket> | null>(null);
  const [diagnosticModalOpen, setDiagnosticModalOpen] = useState(false);
  const [activeDiagnosticAsset, setActiveDiagnosticAsset] = useState<Asset | null>(null);
  const [accessModalOpen, setAccessModalOpen] = useState(false);
  const [activeAccessAsset, setActiveAccessAsset] = useState<Asset | null>(null);
  const [addSnippetModalOpen, setAddSnippetModalOpen] = useState(false);
  const [activeDocArticle, setActiveDocArticle] = useState<DocArticle | null>(null);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('smartdesk_page', currentPage);
  }, [currentPage]);

  useEffect(() => {
    localStorage.setItem('smartdesk_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('smartdesk_role', currentUserRole);
  }, [currentUserRole]);

  useEffect(() => {
    localStorage.setItem('smartdesk_tickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem('smartdesk_snippets', JSON.stringify(snippets));
  }, [snippets]);

  useEffect(() => {
    localStorage.setItem('smartdesk_docs', JSON.stringify(docs));
  }, [docs]);

  useEffect(() => {
    localStorage.setItem('smartdesk_health_events', JSON.stringify(healthEvents));
  }, [healthEvents]);

  // Global keydown for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const navigateTo = (page: PageId) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentUser = USER_PROFILES[currentUserRole];

  const addTicket = (data: {
    title: string;
    service: string;
    priority: 'P1' | 'P2' | 'P3' | 'P4';
    severity: IncidentSeverity;
    department: any;
    description: string;
    snippet?: string;
    assigneeName?: string;
  }) => {
    const newId = `INC-${4090 + tickets.length + 1}`;
    const newTicket: Ticket = {
      id: newId,
      title: data.title,
      service: data.service,
      priority: data.priority,
      severity: data.severity,
      status: 'Open',
      department: data.department || 'Infrastructure',
      assignee: {
        name: data.assigneeName || currentUser.name,
        avatar: currentUser.avatar,
        role: currentUserRole
      },
      reporter: currentUser.name,
      description: data.description,
      snippet: data.snippet,
      slaDueMinutes: data.severity === 'Critical' ? 60 : data.severity === 'High' ? 240 : 720,
      slaTargetHours: data.severity === 'Critical' ? 1 : data.severity === 'High' ? 4 : 12,
      createdAt: 'Just now',
      updatedAt: 'Just now',
      comments: [],
      tags: [data.service.split(' ')[0], data.priority, data.severity]
    };

    setTickets(prev => [newTicket, ...prev]);

    // Add activity
    const newAct: ActivityItem = {
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
      user: {
        name: currentUser.name,
        avatar: currentUser.avatar
      },
      action: 'created incident ticket',
      target: `${newId} (${data.title.substring(0, 32)}...)`,
      category: 'ticket',
      severity: data.severity === 'Critical' ? 'critical' : 'warning'
    };
    setActivity(prev => [newAct, ...prev]);
  };

  const updateTicketStatus = (ticketId: string, status: IncidentStatus) => {
    setTickets(prev =>
      prev.map(t => {
        if (t.id === ticketId) {
          return {
            ...t,
            status,
            updatedAt: 'Just now'
          };
        }
        return t;
      })
    );

    const targetTicket = tickets.find(t => t.id === ticketId);
    if (targetTicket) {
      const newAct: ActivityItem = {
        id: `act-${Date.now()}`,
        timestamp: 'Just now',
        user: { name: currentUser.name, avatar: currentUser.avatar },
        action: `updated status to ${status} on`,
        target: `${targetTicket.id} (${targetTicket.title.substring(0, 24)}...)`,
        category: 'ticket',
        severity: status === 'Resolved' ? 'info' : 'warning'
      };
      setActivity(prev => [newAct, ...prev]);
    }
  };

  const updateTicketSeverity = (ticketId: string, severity: IncidentSeverity) => {
    setTickets(prev =>
      prev.map(t => {
        if (t.id === ticketId) {
          return {
            ...t,
            severity,
            updatedAt: 'Just now'
          };
        }
        return t;
      })
    );
  };

  const addTicketComment = (ticketId: string, content: string) => {
    if (!content.trim()) return;
    const newComment = {
      id: `c-${Date.now()}`,
      author: currentUser.name,
      avatar: currentUser.avatar,
      role: currentUserRole,
      content,
      createdAt: 'Just now'
    };

    setTickets(prev =>
      prev.map(t => {
        if (t.id === ticketId) {
          return {
            ...t,
            comments: [...t.comments, newComment],
            updatedAt: 'Just now'
          };
        }
        return t;
      })
    );
  };

  const openDiagnostic = (asset: Asset) => {
    setActiveDiagnosticAsset(asset);
    setDiagnosticModalOpen(true);
  };

  const openAccessRequest = (asset: Asset) => {
    setActiveAccessAsset(asset);
    setAccessModalOpen(true);
  };

  const openReportFault = (asset: Asset) => {
    setPrefilledIncidentData({
      service: asset.name,
      title: `Fault Report: ${asset.name} (${asset.id})`,
      description: `Reported issue on ${asset.name} located at ${asset.location}. Current IP: ${asset.ip}. Uptime is ${asset.uptimePercent}%.`,
      priority: 'P2',
      severity: 'High'
    });
    setLogIncidentModalOpen(true);
  };

  const addSnippet = (snippet: {
    title: string;
    language: any;
    category: string;
    description: string;
    code: string;
    tags: string[];
  }) => {
    const newSnippet: CodeSnippet = {
      id: `snp-${Date.now()}`,
      ...snippet,
      copyCount: 1
    };
    setSnippets(prev => [newSnippet, ...prev]);

    const newAct: ActivityItem = {
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
      user: { name: currentUser.name, avatar: currentUser.avatar },
      action: 'published developer snippet',
      target: snippet.title,
      category: 'asset',
      severity: 'info'
    };
    setActivity(prev => [newAct, ...prev]);
  };

  const incrementSnippetCopy = (snippetId: string) => {
    setSnippets(prev =>
      prev.map(s => {
        if (s.id === snippetId) {
          return { ...s, copyCount: s.copyCount + 1 };
        }
        return s;
      })
    );
  };

  const markDocHelpful = (docId: string) => {
    setDocs(prev =>
      prev.map(d => {
        if (d.id === docId) {
          return { ...d, helpfulCount: d.helpfulCount + 1 };
        }
        return d;
      })
    );
  };

  const refreshSystemPings = () => {
    setServices(prev =>
      prev.map(s => ({
        ...s,
        latencyMs: Math.max(2, Math.round(s.latencyMs + (Math.random() * 6 - 3))),
        cpuPercent: Math.min(99, Math.max(10, Math.round(s.cpuPercent + (Math.random() * 8 - 4)))),
        lastPing: 'Just now'
      }))
    );
  };

  const simulateHealthRecovery = () => {
    const scenarios = [
      {
        serviceId: 'svc-redis',
        serviceName: 'Redis Sentinel Cluster (Cache/Session)',
        region: 'AWS us-east-1b',
        type: 'recovered' as const,
        title: 'Autonomous Key Eviction & Slab Cache Sanitization',
        description: 'Sentinel autonomous controller purged 1.8GB unindexed volatile keys and returned shard-03 memory utilization to nominal 74.2%.',
        durationSeconds: 19,
        triggerMechanism: 'Sentinel Failover' as const,
        status: 'Resolved Automatically' as const,
        metricsBefore: 'RAM: 91.2% · Latency: 48ms',
        metricsAfter: 'RAM: 74.2% · Latency: 6ms',
        automatedRemediationScript: `redis-cli -h redis-prod-03.internal UNLINK $(redis-cli --scan --pattern "tmp:sess:*")
redis-cli -h redis-prod-03.internal memory purge`,
        rootCauseTag: 'Slab Purge'
      },
      {
        serviceId: 'svc-k8s-fleet',
        serviceName: 'EKS Kubernetes Production Fleet',
        region: 'AWS Multi-AZ (us-east-1a/b/c)',
        type: 'autoscaled' as const,
        title: 'Predictive Horizontal Pod Autoscaler Scaled Worker Fleet',
        description: 'Anticipated queue backlog spike in message-broker consumers. Controller auto-provisioned 8 additional Spot instances with zero request throttling.',
        durationSeconds: 45,
        triggerMechanism: 'Kubernetes Controller' as const,
        status: 'Resolved Automatically' as const,
        metricsBefore: 'Queue Depth: 14,200 · Workers: 8',
        metricsAfter: 'Queue Depth: 420 · Workers: 16',
        automatedRemediationScript: `kubectl scale deployment queue-worker --replicas=16 -n streaming
kubectl rollout status deployment/queue-worker -n streaming`,
        rootCauseTag: 'Spot Autoscaling'
      },
      {
        serviceId: 'svc-auth',
        serviceName: 'Auth0 / Okta Federation Gateway',
        region: 'Cloudflare Edge / Global',
        type: 'recovered' as const,
        title: 'JWKS Keystore Hot-Reload & Route Invalidation Complete',
        description: 'Downstream Envoy edge cache cleared stale token signatures and successfully fetched freshly rotated public keys.',
        durationSeconds: 12,
        triggerMechanism: 'Automated SRE Agent' as const,
        status: 'Resolved Automatically' as const,
        metricsBefore: 'Cache Age: 86,400s · Stale Rate: 1.4%',
        metricsAfter: 'Cache Age: 2s · Stale Rate: 0.0%',
        automatedRemediationScript: `curl -X POST http://localhost:9901/runtime_modify?overrides.reload_jwks=true
curl -s https://auth.smartdesk.internal/healthz/jwks`,
        rootCauseTag: 'JWKS Rotation'
      }
    ];

    const pick = scenarios[Math.floor(Math.random() * scenarios.length)];
    const newEvent: HealthTimelineEvent = {
      id: `evt-${Date.now()}`,
      timestamp: 'Just now',
      exactTime: new Date().toISOString().substring(11, 19) + ' UTC',
      ...pick
    };

    setHealthEvents(prev => [newEvent, ...prev]);

    // Register in activity audit feed
    const newAct: ActivityItem = {
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
      user: {
        name: 'SmartDesk Auto-Heal',
        avatar: '/src/assets/images/avatar_sre_lead_1791782949477.jpg'
      },
      action: 'executed automated recovery script on',
      target: pick.serviceName,
      category: 'diagnostic',
      severity: 'info'
    };
    setActivity(prev => [newAct, ...prev]);
  };

  const sendAiMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMsg: AiChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setAiMessages(prev => [...prev, userMsg]);

    // Generate intelligent AI response based on intent
    setTimeout(() => {
      let replyContent = '';
      let codeBlock: { lang: string; code: string } | undefined = undefined;
      let diagnosticData: any = undefined;

      const lower = content.toLowerCase();

      if (lower.includes('redis') || lower.includes('memory') || lower.includes('eviction')) {
        replyContent = 'Analysis complete for Redis Sentinel Cluster. Shard-03 is currently at 91% memory utilization with volatile-lru eviction overhead. The spike is driven by unexpired background report serialization keys.';
        codeBlock = {
          lang: 'bash',
          code: `# Immediate remediation: Set maxmemory-samples and flush temporary reporting keys
redis-cli -h redis-prod-03.internal --scan --pattern "report:batch:*" | xargs redis-cli -h redis-prod-03.internal unlink
# Verify memory reclamation
redis-cli -h redis-prod-03.internal info memory | grep used_memory_human`
        };
        diagnosticData = {
          service: 'Redis Sentinel Cluster',
          status: 'Degraded',
          latency: '48ms',
          metrics: ['Used Memory: 27.47 GB / 30.0 GB', 'Fragment Ratio: 1.07', 'Evicted Keys: 4,120/sec']
        };
      } else if (lower.includes('sql') || lower.includes('postgres') || lower.includes('database') || lower.includes('query')) {
        replyContent = 'Generated optimized PostgreSQL query for table partition health and indexing optimization with tabular metrics:';
        codeBlock = {
          lang: 'sql',
          code: `SELECT 
    schemaname,
    relname AS table_name,
    pg_size_pretty(pg_total_relation_size(relid)) AS total_size,
    n_dead_tup AS dead_tuples,
    last_vacuum,
    last_autovacuum
FROM pg_stat_user_tables
ORDER BY pg_total_relation_size(relid) DESC
LIMIT 10;`
        };
      } else if (lower.includes('health') || lower.includes('server') || lower.includes('cluster') || lower.includes('status')) {
        replyContent = 'Executed comprehensive multi-region infrastructure telemetry probe. 3 out of 4 core production clusters are fully nominal. 1 cluster (Redis Sentinel Cache) is under active memory triage.';
        diagnosticData = {
          service: 'Enterprise Core Services (4 monitored)',
          status: 'Warning: 1 Degraded',
          latency: 'Average 16ms',
          metrics: ['Postgres Primary: 4ms latency (Nominal)', 'Auth0 Gateway: 12ms latency (Nominal)', 'Redis Cluster: 48ms latency (Degraded)', 'Kubernetes Fleet: 8ms latency (Nominal)']
        };
      } else if (lower.includes('token') || lower.includes('credential') || lower.includes('reset') || lower.includes('access')) {
        replyContent = 'Zero Trust security policy check passed. Created ephemeral IAM grant request with 60-minute automated expiry. Teleport bastions will accept signed certificates.';
        codeBlock = {
          lang: 'bash',
          code: `# Ephemeral IAM grant generated for ${currentUser.name}
tsh login --proxy=bastion.smartdesk.internal:443 --auth=sso
tsh ssh --cluster=production-cluster admin@bastion-01`
        };
      } else {
        replyContent = `Processed diagnostic query regarding: "${content}". System telemetry indicates all downstream load balancers and Envoy ingress gateways are routing traffic with healthy TLS handshakes. Recommendation: verify application error rates in Datadog and review open tickets for active team investigations.`;
      }

      const assistantMsg: AiChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        content: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        codeBlock,
        diagnosticData
      };

      setAiMessages(prev => [...prev, assistantMsg]);
    }, 600);
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        navigateTo,
        theme,
        toggleTheme,
        currentUserRole,
        setUserRole: setCurrentUserRole,
        currentUser,
        tickets,
        assets,
        snippets,
        docs,
        services,
        activity,
        healthEvents,
        aiMessages,
        commandPaletteOpen,
        setCommandPaletteOpen,
        quickAiOpen,
        setQuickAiOpen,
        logIncidentModalOpen,
        setLogIncidentModalOpen,
        prefilledIncidentData,
        diagnosticModalOpen,
        setDiagnosticModalOpen,
        activeDiagnosticAsset,
        accessModalOpen,
        setAccessModalOpen,
        activeAccessAsset,
        addSnippetModalOpen,
        setAddSnippetModalOpen,
        activeDocArticle,
        setActiveDocArticle,
        addTicket,
        updateTicketStatus,
        updateTicketSeverity,
        addTicketComment,
        openDiagnostic,
        openAccessRequest,
        openReportFault,
        addSnippet,
        incrementSnippetCopy,
        markDocHelpful,
        sendAiMessage,
        refreshSystemPings,
        simulateHealthRecovery
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
