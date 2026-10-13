import { User, Course, NoteTopic, InterviewResult, AssessmentResult } from '../types';

export const currentUser: User = {
  id: 'usr_98124',
  name: 'Alex Vance',
  email: 'alex.vance@hireiq.io',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  readinessScore: 84,
  credits: 12,
  streakDays: 7,
  interviewsCompleted: 6,
  assessmentsCompleted: 14,
  learningHours: 32.5,
  weakSkills: ['Raft Consensus', 'Memory Leaks & V8 Profiling', 'Database Sharding Strategies'],
  strongSkills: ['TypeScript Generics', 'System Design & Load Balancing', 'React 19 Concurrency', 'Smart Contract Auditing']
};

export const sampleRoles = [
  'Senior Full Stack Engineer',
  'Distributed Systems Architect',
  'AI / ML Infrastructure Engineer',
  'Web3 Smart Contract Lead',
  'Senior Frontend Tech Lead',
  'Cloud Native DevOps Specialist'
];

export const sampleJobDescriptions: Record<string, string> = {
  'Distributed Systems Architect': `We are seeking a Distributed Systems Architect to lead the scale-out of our high-throughput consensus layer.
Requirements:
- Deep expertise with Raft/Paxos consensus protocols, vector clocks, and event-driven architectures.
- Experience tuning low-latency message brokers (Kafka, Redpanda) handling 100k+ msg/sec.
- Proven track record with distributed database partitioning, multi-region replication, and fault tolerance.
- Mastery of Go or Rust with solid grasp of zero-copy buffers and memory allocation.`,

  'Senior Full Stack Engineer': `Looking for a Senior Full Stack Engineer to build next-generation Web3 developer tooling and analytics.
Requirements:
- 5+ years of React, Next.js, and TypeScript building complex interactive UIs.
- Deep understanding of Node.js event loops, microservices, and PostgreSQL query optimization.
- Familiarity with EVM state machines and WebSocket streaming protocols.
- Passion for low-latency interfaces and resilient offline-first states.`
};

export const initialInterviewResults: InterviewResult[] = [
  {
    id: 'int_7721',
    role: 'Distributed Systems Architect',
    date: 'Oct 12, 2026',
    overallScore: 88,
    recommendation: 'Ready',
    pillars: {
      technicalAccuracy: 92,
      communicationClarity: 85,
      confidencePacing: 88,
      problemSolving: 87
    },
    strongSkills: [
      { skill: 'Distributed Consensus', quote: '"Accurately explained leader election and log compaction in Raft without hesitation."' },
      { skill: 'Data Partitioning', quote: '"Crisply identified consistent hashing virtual nodes to prevent hot spots."' }
    ],
    weakSkills: [
      { skill: 'Failover Edge Cases', gap: 'Overlooked network split-brain recovery under asymmetric network partitions.' },
      { skill: 'Vector Clock Pruning', gap: 'Did not detail strategies for garbage collecting unbounded vector clock actors.' }
    ],
    questions: [
      {
        id: 'q1',
        question: 'Explain how Raft handles network partitioning when a leader becomes isolated from the majority cluster.',
        category: 'System Design',
        candidateAnswer: 'When a network partition occurs, if the current leader is in the minority partition, it will still receive write requests from clients but cannot replicate log entries to a quorum. Meanwhile, nodes in the majority partition will time out on heartbeats, initiate an election with an incremented term number, and elect a new leader. When the partition heals, the old leader receives higher-term heartbeats, steps down as follower, and uncommitted writes in its log are rolled back.',
        aiFeedback: 'Superb technical precision. You correctly outlined both majority quorum election and the roll-back mechanism of uncommitted entries.',
        modelAnswer: 'A leader isolated in a minority partition fails to reach quorum for log entry commits. The majority partition times out heartbeats, triggers election for a higher term, and commits writes. Once connectivity restores, the old leader receives the higher term appendEntries RPC, converts to follower, and overwrites uncommitted logs with the authoritative majority logs.',
        score: 95
      },
      {
        id: 'q2',
        question: 'How do you prevent hot-spotting in distributed key-value caches under sudden traffic spikes?',
        category: 'Architecture',
        candidateAnswer: 'I would employ consistent hashing with virtual nodes to distribute keys evenly, along with local in-memory L1 caches (like LRU) on application servers for highly frequent keys. For extreme read skew, we can append a random salt or shard identifier to hot keys to distribute read traffic across multiple replica nodes.',
        aiFeedback: 'Great answer. Mentioning multi-tier caching (L1 + L2) and salted keys demonstrated real-world production battle scars.',
        modelAnswer: 'Key mitigations: 1) Consistent hashing with ~256 virtual nodes per physical host; 2) Local ephemeral near-caches (L1 micro-cache with TTL ~1s); 3) Hot-key replication through salted keys (key_1, key_2, ...); 4) Proactive probabilistic early expiration (XFetch algorithm) to prevent cache stampedes.',
        score: 90
      },
      {
        id: 'q3',
        question: 'Walk me through a scenario where you made an architectural trade-off between strict serializability and availability.',
        category: 'System Design',
        candidateAnswer: 'In our financial ledger service, we enforced strict serializability using CockroachDB Raft-based consensus. However, for audit telemetry and real-time dashboard analytics, we relaxed consistency to eventual consistency via asynchronous Kafka change data capture (CDC), accepting up to a 500ms lag to preserve sub-10ms UI query latency.',
        aiFeedback: 'Clear separation of transaction invariants versus reporting read-paths. Could strengthen by specifying how reconciliation handles edge cases.',
        modelAnswer: 'Architectures should split the transactional core (ACID/strict serializability via 2PC or Paxos) from read projections (CQRS pattern with eventual consistency). Using CDC to feed denormalized search indices provides high availability for analytics without compromising financial ledger integrity.',
        score: 86
      }
    ],
    recommendedCourses: ['crs_sys_design_99', 'crs_distributed_consensus'],
    recommendedNotes: ['note_raft_consensus', 'note_cap_theorem']
  }
];

export const initialAssessmentResults: AssessmentResult[] = [
  {
    id: 'asm_301',
    topic: 'System Design & High Availability',
    difficulty: 'Advanced',
    date: 'Oct 11, 2026',
    passed: true,
    scorePercent: 90,
    percentile: 96,
    timeSpentSeconds: 780,
    accuracyRate: 90,
    attemptedCount: 10,
    skippedCount: 0,
    topicMastery: [
      { topic: 'Load Balancing & Anycast', score: 95 },
      { topic: 'Consensus Algorithms', score: 85 },
      { topic: 'Database Sharding', score: 90 },
      { topic: 'Cache Stampede Prevention', score: 92 }
    ],
    questions: [
      {
        id: 'asm_q1',
        type: 'mcq',
        prompt: 'In a distributed hash table utilizing Consistent Hashing, what is the primary benefit of deploying virtual nodes (vnodes)?',
        options: [
          'It eliminates the need for replication factors entirely',
          'It ensures a more uniform key distribution and balances load across heterogeneous hardware',
          'It guarantees zero-downtime database schema migrations',
          'It converts O(log N) lookup time to deterministic O(1)'
        ],
        userAnswer: 1,
        correctOptionIndex: 1,
        explanation: 'Virtual nodes map a single physical server to multiple points on the hash ring, mitigating load variance and enabling proportional capacity allocation for servers with differing CPU/memory.',
        subtopic: 'Load Balancing & Anycast'
      }
    ],
    targetedRevisionNotes: ['note_cap_theorem', 'note_raft_consensus']
  }
];

export const mockCourses: Course[] = [
  {
    id: 'crs_sys_design_99',
    title: 'Distributed Systems & High-Throughput Architecture',
    description: 'Master large-scale distributed architectures, consensus protocols, fault-tolerant message queues, and zero-downtime sharding designed for Web3 and Tier-1 tech.',
    category: 'System Design',
    difficulty: 'Advanced',
    instructor: {
      name: 'Dr. Elena Rostova',
      role: 'Principal Systems Architect, Ex-Cloudflare',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
    },
    rating: 4.96,
    enrolledStudents: 14200,
    durationHours: 18.5,
    thumbnail: '/src/assets/images/course_system_design_1791911819427.jpg',
    progressPercent: 65,
    lastUpdated: 'October 2026',
    learningOutcomes: [
      'Design fault-tolerant distributed services handling millions of concurrent connections',
      'Implement and debug Raft, Paxos, and Gossip consensus implementations',
      'Architect resilient event streaming pipelines with Kafka, Redpanda, and CDC',
      'Eliminate hot-spotting through dynamic consistent hashing & tiered caching'
    ],
    prerequisites: [
      'Proficiency in a systems programming language (Go, Rust, or C++) or advanced Node.js/Java',
      'Fundamental understanding of TCP/IP, sockets, and basic relational databases'
    ],
    modules: [
      {
        id: 'mod_1',
        title: '01. Foundational Distributed Invariants',
        lessons: [
          {
            id: 'les_101',
            title: 'Network Partitions & CAP/PACELC Trade-offs',
            duration: '24m',
            isPreview: true,
            completed: true,
            summary: 'A deep architectural dive into the realities of asymmetric network partitions, fallacies of distributed computing, and the PACELC theorem.',
            keyTakeaways: [
              'Latency is an unavoidable cost of consensus across geographic zones.',
              'Under normal operation (no partition), PACELC forces a trade-off between Latency (L) and Consistency (C).',
              'Heartbeat intervals must be calibrated against network jitter to prevent false leader elections.'
            ],
            codeSnippets: [
              {
                title: 'Heartbeat & Election Timeout Jitter Algorithm',
                language: 'typescript',
                code: `// Randomized election timeout prevents split-vote cycles\nfunction getRandomElectionTimeout(baseMs: number, jitterMs: number): number {\n  return baseMs + Math.floor(Math.random() * jitterMs);\n}\n\nconst HEARTBEAT_INTERVAL_MS = 50;\nconst ELECTION_TIMEOUT_MS = getRandomElectionTimeout(150, 150); // 150-300ms`
              }
            ],
            resources: [
              { title: 'PACELC Theorem Whitepaper', type: 'PDF', url: '#' },
              { title: 'Raft Paper by Ongaro & Ousterhout', type: 'Link', url: 'https://raft.github.io' }
            ]
          },
          {
            id: 'les_102',
            title: 'Raft Consensus: Log Replication & State Machine Safety',
            duration: '38m',
            completed: true,
            summary: 'Step-by-step walkthrough of AppendEntries RPCs, commit indices, term reconciliation, and log compaction snapshots.',
            keyTakeaways: [
              'Log entries are only committed when safely replicated on a majority of cluster nodes.',
              'The leader never commits log entries from previous terms by counting replicas directly; only through current term progression.',
              'Snapshotting compacts state machines while pruning obsolete log segments.'
            ],
            codeSnippets: [
              {
                title: 'Raft AppendEntries RPC Structure',
                language: 'typescript',
                code: `interface AppendEntriesArgs {\n  term: number;\n  leaderId: string;\n  prevLogIndex: number;\n  prevLogTerm: number;\n  entries: LogEntry[];\n  leaderCommit: number;\n}\n\ninterface AppendEntriesReply {\n  term: number;\n  success: boolean;\n  matchIndex: number;\n}`
              }
            ]
          },
          {
            id: 'les_103',
            title: 'Gossip Protocols & Anti-Entropy Synchronization',
            duration: '31m',
            completed: false,
            summary: 'Scalable node discovery and peer health gossiping across thousands of ephemeral nodes without central coordinator bottlenecks.',
            keyTakeaways: [
              'Gossip networks scale logarithmically with respect to cluster membership size.',
              'Scuttlebutt and SWIM protocols provide rapid failure detection with low network overhead.'
            ]
          }
        ]
      },
      {
        id: 'mod_2',
        title: '02. High-Throughput Sharding & Partitioning',
        lessons: [
          {
            id: 'les_201',
            title: 'Virtual Nodes & Consistent Hashing in Production',
            duration: '42m',
            completed: false,
            summary: 'Implementing production consistent hashing rings with binary search token maps and weighted node balancing.',
            keyTakeaways: [
              'Virtual nodes evenly spread keys across disks, minimizing rebalancing overhead upon node departures.',
              'Token rings use fast 64-bit MurmurHash3 or HighwayHash algorithms.'
            ]
          },
          {
            id: 'les_202',
            title: 'Mitigating Cache Stampedes: XFetch & Singleflight',
            duration: '29m',
            completed: false,
            summary: 'Preventing thundering herds when high-traffic cache entries expire under 100,000 req/sec spikes.',
            keyTakeaways: [
              'Singleflight pattern collapses concurrent in-flight upstream fetches into a single shared promise.',
              'Probabilistic early cache recomputation (XFetch) refreshes data before hard TTL expiration.'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'crs_frontend_arch_88',
    title: 'Advanced Frontend Architecture & React 19 Internals',
    description: 'Deep dive into React 19 Server Components, Concurrent Fiber scheduling, memory leak profiling, micro-frontends, and ultra-smooth WebGL integrations.',
    category: 'Frontend',
    difficulty: 'Advanced',
    instructor: {
      name: 'Julian Sterling',
      role: 'Staff Frontend Engineer, Next.js Contributor',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
    },
    rating: 4.98,
    enrolledStudents: 19800,
    durationHours: 14.0,
    thumbnail: '/src/assets/images/course_frontend_architecture_1791911819493.jpg',
    progressPercent: 30,
    lastUpdated: 'September 2026',
    learningOutcomes: [
      'Master React 19 Actions, useTransition concurrency, and Server Actions mechanics',
      'Diagnose detached DOM nodes and V8 memory heap allocations using Chrome DevTools',
      'Build resilient offline-first Web3 user experiences with Optimistic UI updates',
      'Optimize 60FPS fluid canvas interactions and WebGL shader pipelines'
    ],
    prerequisites: [
      'Solid command of modern TypeScript and standard React hooks',
      'Understanding of browser rendering pipelines (Layout, Paint, Composite)'
    ],
    modules: [
      {
        id: 'mod_fe_1',
        title: '01. React 19 Concurrency & Fiber Internals',
        lessons: [
          {
            id: 'les_fe_101',
            title: 'Scheduler Priorities, Lanes & Time-Slicing',
            duration: '35m',
            isPreview: true,
            completed: true,
            summary: 'How React Fiber splits long rendering loops into non-blocking chunks using MessageChannel and discrete priority lanes.',
            keyTakeaways: [
              'Lanes represent bitmasks of update priorities (Sync, InputContinuous, Default, Idle).',
              'useTransition downgrades render work to non-urgent lanes, keeping input typing responsive.'
            ]
          },
          {
            id: 'les_fe_102',
            title: 'Memory Leaks: Detached DOM Trees & Closure Traps',
            duration: '28m',
            completed: false,
            summary: 'Hunting down retained objects, event listener leaks, and circular closures with heap snapshots.',
            keyTakeaways: [
              'Always clean up AbortController and custom event listeners in effect cleanup functions.',
              'Closures retaining large arrays inside uncollected promises are the #1 source of memory leaks.'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'crs_web3_audit_77',
    title: 'Web3 Smart Contract Security & DeFi Protocols',
    description: 'Identify reentrancy vulnerabilities, oracle manipulation, flash loan exploits, and design production EVM contracts in Solidity and Foundry.',
    category: 'Web3 & Distributed',
    difficulty: 'Advanced',
    instructor: {
      name: 'Kaelen Thorne',
      role: 'Lead Security Auditor, Paradigm Fellow',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
    },
    rating: 4.94,
    enrolledStudents: 9100,
    durationHours: 16.0,
    thumbnail: '/src/assets/images/notes_algorithms_bg_1791911820410.jpg',
    progressPercent: 10,
    lastUpdated: 'October 2026',
    learningOutcomes: [
      'Audit Solidity codebases against standard exploit vectors (Reentrancy, Read-only Reentrancy, Front-running)',
      'Construct invariant test suites using Foundry and fuzzing techniques',
      'Design secure TWAP and Chainlink price oracle consumer contracts'
    ],
    prerequisites: [
      'Basic Solidity knowledge',
      'Understanding of EVM storage layout, slots, and gas mechanics'
    ],
    modules: [
      {
        id: 'mod_web3_1',
        title: '01. Attack Vectors & Defensive Patterns',
        lessons: [
          {
            id: 'les_w1',
            title: 'Checks-Effects-Interactions & Transient Storage (EIP-1153)',
            duration: '30m',
            completed: true,
            summary: 'Using TSTORE/TLOAD for gas-efficient reentrancy locks and secure state updates.',
            keyTakeaways: [
              'Always update internal balances before external calls (CEI pattern).',
              'Transient storage wipes clean at the end of the transaction, saving 90% gas on reentrancy guards.'
            ]
          }
        ]
      }
    ]
  }
];

export const mockNotes: NoteTopic[] = [
  {
    id: 'note_raft_consensus',
    title: 'Raft Distributed Consensus: Comprehensive Cheat Sheet',
    category: 'Distributed Systems',
    readTimeMinutes: 7,
    tags: ['#Consensus', '#Raft', '#HighAvailability', '#Quorum'],
    summary: 'The ultimate quick-reference on Raft leader election, heartbeats, log invariants, term transitions, and split-brain resolution for engineering interviews.',
    assessmentTopicRef: 'System Design',
    isBookmarked: true,
    keyFormulasAndTraps: [
      { label: 'Quorum Rule', detail: 'Quorum = floor(N / 2) + 1. Cluster of 5 nodes survives 2 failures.' },
      { label: 'Split-Vote Trap', detail: 'Without randomized election timeouts (e.g. 150ms-300ms), simultaneous candidate elections can lock the cluster.' },
      { label: 'Commit Invariant', detail: 'Leader only commits current term log entries by majority counting; previous term logs are committed indirectly.' },
      { label: 'Split-Brain Defense', detail: 'A isolated minority leader accepts writes but can NEVER commit them; clients receive timeout error.' }
    ],
    contentMarkdown: `## 1. Core Invariants of the Raft Algorithm

In distributed systems, achieving consensus across unreliable networks is the cornerstone of fault tolerance. Raft decomposes consensus into three independent subproblems:

1. **Leader Election**: When an existing leader fails, a new leader must be elected promptly.
2. **Log Replication**: The leader accepts log entries from clients and replicates them across followers.
3. **Safety**: If any server has applied a particular log entry to its state machine, no other server may apply a different log entry for the same index.

\`\`\`typescript
// Raft State Transitions
enum NodeState {
  FOLLOWER = 'FOLLOWER',
  CANDIDATE = 'CANDIDATE',
  LEADER = 'LEADER'
}
\`\`\`

### 2. Leader Election Protocol
- Every node initializes as a **Follower** with a randomized heartbeat timeout (typically between \`150ms\` and \`300ms\`).
- If no heartbeat is received from the leader before the timeout fires, the follower transitions to **Candidate**, increments the current term, votes for itself, and sends \`RequestVote\` RPCs in parallel to all other cluster peers.
- A candidate becomes Leader if it receives votes from a strict quorum (\`N/2 + 1\`).

> **Interview Tip**: Interviewers will often ask: *"What happens if two candidates request votes at the exact same millisecond?"* The answer is: randomized timeouts break symmetry; one candidate's timeout will expire sooner and win the next round.

### 3. Log Matching Property
If two entries in different logs have the same index and term:
- They store the same command.
- Their logs are identical in all preceding entries up to that index.

If a follower's log diverges, the leader resolves conflicts by finding the latest index where the two agree, deletes conflicting follower entries, and replicates all following leader entries.`
  },
  {
    id: 'note_cap_theorem',
    title: 'CAP & PACELC Theorems in Real Production Systems',
    category: 'System Design',
    readTimeMinutes: 5,
    tags: ['#CAPTheorem', '#PACELC', '#Consistency', '#Latency'],
    summary: 'Clear distinction between Consistency vs Availability under network partitions, and Latency vs Consistency during normal operations.',
    assessmentTopicRef: 'System Design',
    isBookmarked: false,
    keyFormulasAndTraps: [
      { label: 'CAP Reality', detail: 'Network partitions (P) are physically inevitable. You choose either C (safety) or A (liveness).' },
      { label: 'PACELC Formula', detail: 'If Partition (P) choose Availability (A) or Consistency (C); Else (E) choose Latency (L) or Consistency (C).' },
      { label: 'CP Systems', detail: 'Zookeeper, etcd, Spanner, CockroachDB (prioritize absolute linearizability).' },
      { label: 'AP Systems', detail: 'DynamoDB, Cassandra, Couchbase (prioritize continuous reads/writes with eventual sync).' }
    ],
    contentMarkdown: `## Understanding CAP & PACELC in High Scale Design

When designing globally distributed microservices, network partitions are an unavoidable reality of fiber cuts, hardware degradation, and routing table reconfigurations.

### The PACELC Refinement (Daniel Abadi)
CAP only explains trade-offs **when a partition occurs**. But 99.9% of the time, the network is operating normally!

- **If Partition (P)**:
  - **Availability (A)**: Accept writes even if un-replicated to other partitions.
  - **Consistency (C)**: Refuse or stall writes until quorum is reached.
- **Else (E)**:
  - **Latency (L)**: Return immediately without synchronous cross-datacenter round-trips.
  - **Consistency (C)**: Wait for synchronous replication (e.g. Paxos cross-region wait), incurring higher latency.

\`\`\`
Examples:
- DynamoDB (Configurable): AP / EL (low latency)
- Google Spanner: CP / EC (synchronous atomic clock TrueTime commits)
- Cassandra: AP / EL by default, tunable to CP per query
\`\`\``
  },
  {
    id: 'note_big_o_complexity',
    title: 'Algorithmic Complexity, Memory Bounds & V8 Profiling',
    category: 'Algorithms',
    readTimeMinutes: 6,
    tags: ['#BigO', '#MemoryLeaks', '#V8', '#DataStructures'],
    summary: 'Comprehensive reference of standard data structure time/space boundaries, hardware cache friendliness, and memory garbage collection models.',
    assessmentTopicRef: 'Algorithms',
    isBookmarked: true,
    keyFormulasAndTraps: [
      { label: 'Hash Map Trap', detail: 'Worst-case hash map lookup is O(N) under pathological collision attacks unless balanced trees are used (Java 8+ Red-Black).' },
      { label: 'Array vs Linked List', detail: 'Arrays possess O(1) random access AND sequential CPU cache line locality, outperforming pointer-chasing linked lists in modern CPUs.' },
      { label: 'Amortized O(1)', detail: 'Dynamic array doubling is amortized O(1) per insert, but individual resizing operations take O(N) memory copies.' }
    ],
    contentMarkdown: `## Data Structure Cost Matrix

| Data Structure | Access (Avg) | Search (Avg) | Insertion (Avg) | Deletion (Avg) | Space Complexity |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Array** | \`O(1)\` | \`O(n)\` | \`O(n)\` | \`O(n)\` | \`O(n)\` |
| **Hash Table** | \`N/A\` | \`O(1)\` | \`O(1)\` | \`O(1)\` | \`O(n)\` |
| **B-Tree** | \`O(log n)\` | \`O(log n)\` | \`O(log n)\` | \`O(log n)\` | \`O(n)\` |
| **Skip List** | \`O(log n)\` | \`O(log n)\` | \`O(log n)\` | \`O(log n)\` | \`O(n log n)\` |

### V8 Engine Memory Optimization Tips
1. Avoid hidden class transitions by instantiating object properties in the exact same order in constructors.
2. Beware of closures capturing outer function scopes when passing event handlers.
3. Clean up WeakMap and AbortSignal listeners when tearing down long-lived subscriptions.`
  }
];

export const sampleAssessmentsPool = [
  {
    id: 'q_asm_1',
    type: 'mcq' as const,
    subtopic: 'Distributed Systems',
    prompt: 'In a microservice mesh, what is the primary purpose of the "Circuit Breaker" pattern?',
    options: [
      'To cryptographically encrypt gRPC traffic passing between edge proxies',
      'To fail fast and prevent cascading system outages when an upstream dependency is failing',
      'To load balance traffic strictly round-robin across worker nodes',
      'To compress large JSON payloads before transmission over HTTP/2'
    ],
    correctOptionIndex: 1,
    explanation: 'The Circuit Breaker pattern detects failures and encapsulates the logic of preventing an operation from repeatedly executing during maintenance or transient faults, halting cascade failure.'
  },
  {
    id: 'q_asm_2',
    type: 'coding' as const,
    subtopic: 'Data Structures & Algorithms',
    prompt: 'Implement an in-memory Rate Limiter using a Sliding Window Log or Token Bucket algorithm that checks if a client request should be allowed.',
    starterCode: `class TokenBucketRateLimiter {
  private capacity: number;
  private refillRatePerSec: number;
  private tokens: number;
  private lastRefillTimestamp: number;

  constructor(capacity: number, refillRatePerSec: number) {
    this.capacity = capacity;
    this.refillRatePerSec = refillRatePerSec;
    this.tokens = capacity;
    this.lastRefillTimestamp = Date.now();
  }

  public allowRequest(tokensRequested: number = 1): boolean {
    this.refill();
    if (this.tokens >= tokensRequested) {
      this.tokens -= tokensRequested;
      return true;
    }
    return false;
  }

  private refill(): void {
    const now = Date.now();
    const elapsedTimeSec = (now - this.lastRefillTimestamp) / 1000;
    const tokensToAdd = elapsedTimeSec * this.refillRatePerSec;
    this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
    this.lastRefillTimestamp = now;
  }
}
`,
    explanation: 'The Token Bucket algorithm tracks available tokens and lazily refills them based on the elapsed time since the previous request, offering O(1) memory and time efficiency without storing individual timestamps.'
  },
  {
    id: 'q_asm_3',
    type: 'mcq' as const,
    subtopic: 'Database Optimization',
    prompt: 'When indexing a relational database with B+ Trees, why are composite index column orders critical?',
    options: [
      'The database only reads indexes from right to left alphabetically',
      'Queries can only benefit from the index if they match the leftmost prefix of columns',
      'Composite indexes convert table scans into random hash scans',
      'Column order determines the disk cluster partition size'
    ],
    correctOptionIndex: 1,
    explanation: 'B+ Tree composite indexes are sorted hierarchically by column 1, then column 2, etc. The index can only be navigated if the leftmost prefix is supplied in the query condition.'
  },
  {
    id: 'q_asm_4',
    type: 'mcq' as const,
    subtopic: 'React 19 & Frontend Architecture',
    prompt: 'How does React 19 useTransition differentiate from standard state updates?',
    options: [
      'It executes the state mutation synchronously in a Web Worker thread',
      'It marks state updates as non-blocking transitions, permitting high-priority user inputs to interrupt rendering',
      'It forces React to bypass the Virtual DOM and mutate the DOM directly',
      'It converts functional components into static HTML cached at the edge'
    ],
    correctOptionIndex: 1,
    explanation: 'useTransition marks state updates inside its callback as low-priority transitions. If a user types into an input during the render, React immediately pauses the transition to process the typing.'
  },
  {
    id: 'q_asm_5',
    type: 'mcq' as const,
    subtopic: 'Web3 & EVM Security',
    prompt: 'Which pattern is the most fundamental defensive measure against standard reentrancy attacks in smart contracts?',
    options: [
      'Storing all variables in memory rather than storage',
      'Checks-Effects-Interactions (updating state balances BEFORE transferring external value)',
      'Calling block.timestamp before every transaction',
      'Using assembly jump instructions'
    ],
    correctOptionIndex: 1,
    explanation: 'The Checks-Effects-Interactions pattern ensures that all condition checks occur first, then internal contract state is updated, and only after state is safe are external contract calls initiated.'
  }
];
