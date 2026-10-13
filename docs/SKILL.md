---
name: engineering-excellence
description: Staff/principal-level engineering and architecture standards for any software project or product. Use this skill whenever the user starts, designs, builds, reviews, refactors, scales, or debugs any software — apps, APIs, services, libraries, data pipelines, ML systems, mobile, web, infra, scripts that may grow — even if they never mention "architecture", "best practices", or "scalability". Trigger on requests like "build me an app", "design a system", "set up a project", "write a service", "review my code", "make this production-ready", "how should I structure this", or "will this scale". Applies requirements analysis, system design, clean code, testing, security, reliability, observability, performance, CI/CD, and documentation, scaled to the size and stage of the project so small things stay simple and big things are built to last.
---

# Engineering Excellence

Think and build like a Google-level senior engineer and architect: understand the problem before the solution, choose the simplest design that meets the real requirements, make it easy to change, and make failure observable and survivable.

## The core stance

1. **Problem before solution.** Most expensive mistakes are building the wrong thing. Clarify who the users are, what outcome matters, and how success is measured before choosing technology.
2. **Simplicity is the scaling strategy.** Every component is future maintenance, failure modes, and onboarding cost. Add complexity only when a concrete requirement forces it, and write down why.
3. **Design for change, not for prediction.** You cannot forecast the future, but you can keep boundaries clean so decisions are cheap to reverse. Prefer reversible ("two-way door") decisions made fast; spend design effort on irreversible ("one-way door") ones: data models, public APIs, security boundaries, vendor lock-in.
4. **Everything fails.** Assume networks partition, dependencies slow down, disks fill, inputs are hostile, and deploys go wrong. Design the failure behavior deliberately.
5. **If you can't measure it, you can't operate it.** Observability, tests, and SLOs are features, not afterthoughts.
6. **Code is read far more than written.** Optimize for the next reader, who is often you in six months.

## Step 0: Calibrate to project tier (prevents over- and under-engineering)

Pick a tier at the start, state it to the user in one line, and revisit when it changes. Rigor should match stakes.

| Tier | Examples | What to apply |
|---|---|---|
| **T0 Throwaway / script / prototype** | One-off script, spike, hackathon | Working code, clear naming, README with run steps, no secrets in code. Skip heavy architecture. |
| **T1 Small product / internal tool** | Side project, MVP, small team tool | T0 + modular structure, tests on core logic, linting, CI, config via env, basic logging, simple deploy, migrations. |
| **T2 Production service / customer-facing product** | SaaS, public API, mobile app with real users | T1 + design doc, API contracts, threat model, observability + alerts, SLOs, load testing, staged rollout, runbooks, backups, IaC. |
| **T3 Large-scale / critical / multi-team platform** | High traffic, money/health data, many teams | T2 + capacity planning, multi-region/DR, formal ADRs, SLO error budgets, chaos/failure testing, compliance, data governance, service ownership, deprecation policy. |

Default to T1 if unclear. Never apply T3 machinery to a T1 problem. Do design T1 code so it can graduate to T2 without a rewrite (clean boundaries, config, tests).

## Workflow

Follow these phases. For small tasks, compress them mentally and keep the output short; for larger ones, produce the artifacts named.

### Phase 1: Understand and frame

Gather (ask at most a few high-leverage questions; otherwise state assumptions explicitly and proceed):

- **Users and use cases**: who, what jobs-to-be-done, top 3 user journeys.
- **Functional requirements**: must / should / could (MoSCoW). Explicit non-goals.
- **Non-functional requirements (NFRs)**, quantified where possible:
  - Scale: users, QPS (average and peak), data volume and growth, read/write ratio
  - Latency targets (p50/p95/p99), throughput
  - Availability target and acceptable downtime/data loss (RTO/RPO)
  - Consistency needs (strong vs eventual, per data type)
  - Security, privacy, compliance (PII, GDPR, HIPAA, PCI, SOC 2)
  - Cost envelope, team size and skills, timeline
  - Platforms, i18n/l10n, accessibility
- **Constraints**: existing systems, mandated tech, budget, deadlines.
- **Risks and unknowns**: list them and de-risk the largest first with a spike.

Do a quick back-of-envelope estimate for T2+: e.g. 1M DAU x 20 requests/day = ~230 QPS average, ~1k peak; 1 KB x 1M records/day = ~365 GB/year. Numbers decide whether you need sharding or just an index.

### Phase 2: Design

For T2+, write a concise design doc (template at the end). For T1, a short architecture note in the README is enough. Always cover:

1. **Context and goals/non-goals**
2. **High-level architecture** (a diagram: components, data flow, trust boundaries)
3. **Data model and storage choice** with justification
4. **API contracts**
5. **Key trade-offs and alternatives considered** (at least two, with why rejected)
6. **Failure modes, security, observability, rollout and rollback plan**
7. **Open questions**

Record significant decisions as lightweight **ADRs** (Architecture Decision Records): context, decision, consequences, status.

### Phase 3: Build incrementally

- Deliver a thin **vertical slice** end-to-end first (UI/API to storage to deploy), then widen. This surfaces integration and deployment risk early.
- Keep changes small, reviewable, and independently shippable. Use feature flags for incomplete work.
- Write tests alongside code, not after.

### Phase 4: Verify and harden

Run the quality gates (see checklist). Test failure paths, not just happy paths. Load-test T2+ against the NFRs.

### Phase 5: Ship and operate

Automated pipeline, staged rollout, dashboards and alerts live before launch, runbook written, rollback rehearsed. Post-incident, write blameless postmortems and fix systemic causes.

## Architecture principles

### Structure and boundaries
- **Separation of concerns and high cohesion/low coupling.** Group code by domain/feature, not only by technical layer. Each module has one reason to change.
- **Layering with dependency direction pointing inward**: domain logic does not depend on frameworks, databases, or transport. Use ports/adapters (hexagonal/clean architecture) when the domain is non-trivial; do not impose it on CRUD.
- **Start as a well-structured modular monolith.** Split into services only for real reasons: independent scaling, team autonomy, differing availability or tech needs, blast-radius isolation. Premature microservices add distributed-systems problems (latency, partial failure, consistency, deployment coupling) for no benefit.
- **Define module/service contracts first** (interfaces, schemas); hide internals. Avoid shared databases between services.
- **Domain-driven thinking** for complex domains: ubiquitous language, bounded contexts, aggregates with clear transactional boundaries.

### Scalability toolkit (apply when NFRs demand it)
- **Stateless services** behind a load balancer so you can scale horizontally; push state to databases, caches, queues, object storage.
- **Caching layers**: client/CDN, application, database. Define key design, TTL, invalidation strategy, stampede protection (request coalescing, jittered TTL), and what happens on cache failure. "There are only two hard things: cache invalidation and naming."
- **Asynchronous processing**: move slow or non-critical work to queues/streams. Require idempotent consumers, retries with exponential backoff + jitter, dead-letter queues, and backpressure.
- **Database scaling ladder** (climb only as needed): proper indexes and query tuning, then connection pooling, then read replicas, then partitioning/sharding (choose a shard key that avoids hotspots), then purpose-built stores. Plan for replication lag when reading from replicas.
- **Data partitioning and hot keys**: avoid sequential keys that concentrate load; consider consistent hashing.
- **Rate limiting, quotas, load shedding, and admission control** to protect the system from overload and abusive clients.
- **Pagination everywhere** for list endpoints (cursor-based for large/changing sets). Never return unbounded results.
- **Batching and fan-out control**; avoid N+1 queries and chatty service calls.
- **CAP/PACELC awareness**: decide per data type what to sacrifice during partitions and what latency/consistency you trade in normal operation.
- **Multi-region / DR** (T3): active-active vs active-passive, data replication strategy, failover tests, region-aware routing.

### Reliability patterns
- **Timeouts on every network call**, deadlines propagated across calls, bounded retries with backoff and jitter, retry budgets to prevent retry storms.
- **Circuit breakers, bulkheads, fallbacks, graceful degradation**: serve stale or partial results rather than failing completely when possible.
- **Idempotency keys** for any operation clients may retry (payments, orders, writes via queues).
- **Exactly-once is a myth**: design for at-least-once delivery plus idempotent handling.
- **Transactions and distributed consistency**: prefer a single transactional boundary; for cross-service workflows use sagas/outbox pattern rather than distributed two-phase commit.
- **Safe deploys**: canary, blue/green, progressive rollout with automatic rollback on SLO regression. Backward- and forward-compatible changes; expand/contract (parallel change) for schema and API migrations.
- **Define SLIs/SLOs**, derive error budgets, alert on symptoms (user-visible burn rate), not every cause.
- **Backups with tested restores.** An untested backup is not a backup.
- **Health checks**: separate liveness from readiness; shut down gracefully (drain connections).

### API design
- Choose the style deliberately: REST for resource-oriented public APIs, gRPC for internal low-latency service calls, GraphQL when clients need flexible aggregation, events/streams for decoupled async flows.
- **Contract-first** (OpenAPI / protobuf / JSON Schema). Generate clients and validate in CI.
- Consistent naming, error model (stable machine-readable codes plus human message), correct status codes, and structured validation errors.
- **Versioning and compatibility**: additive changes by default; never repurpose fields; deprecate with a timeline and telemetry on usage.
- **Idempotency, pagination, filtering, sorting, partial responses, and rate-limit headers** as standard.
- Authenticate and authorize every endpoint; apply least privilege and object-level authorization checks (prevent IDOR/BOLA).

### Data design
- Model from access patterns and invariants. Normalize by default; denormalize deliberately for read performance with a clear ownership of the source of truth.
- Choose storage by need: relational (transactions, integrity, ad-hoc queries; default choice), document/key-value (simple access patterns, massive scale), wide-column, search index, time-series, graph, object store, data warehouse for analytics. Justify any non-relational pick.
- **Schema migrations**: versioned, reviewed, reversible where possible, zero-downtime (add, backfill, switch, remove). Test migrations on production-sized data.
- Define data lifecycle: retention, archival, deletion (including "right to be forgotten"), PII classification, encryption, audit trails.
- Use constraints (NOT NULL, FK, UNIQUE, CHECK) to enforce invariants at the lowest level. Use appropriate types (money as integer minor units or decimal, never float; timestamps in UTC with timezone handling at the edges).
- Separate OLTP from analytics workloads; use CDC/ETL rather than heavy queries on the primary database.

### Security (build in, don't bolt on)
- **Threat model** T2+ (STRIDE or similar): assets, entry points, trust boundaries, abuse cases.
- **Defense in depth, least privilege, secure by default, fail closed.**
- **AuthN/AuthZ**: use proven standards (OIDC/OAuth2), short-lived tokens, MFA for sensitive paths, RBAC/ABAC with centralized policy; never roll your own crypto or auth.
- **Validate and encode all input/output**: parameterized queries, output escaping, CSRF/XSS/SSRF/deserialization defenses, file-upload restrictions, size limits.
- **Secrets management**: never in code, images, or logs; use a secret manager, rotate regularly, scan in CI.
- **Encryption** in transit (TLS everywhere) and at rest; key management with rotation.
- **Supply chain**: pin and audit dependencies, lockfiles, SBOM, signed artifacts, minimal base images, dependency and container scanning, SAST/DAST in CI.
- **Privacy by design**: collect the minimum, log no PII/secrets, document data flows, honor consent and deletion.
- **Audit logging** for security-relevant events; rate limiting and abuse detection on auth endpoints.
- Follow the OWASP Top 10 and OWASP ASVS as baseline checklists.

### Observability and operations
- **Three pillars plus context**: structured logs (JSON, correlation/trace IDs, no secrets), metrics (RED for services: Rate, Errors, Duration; USE for resources: Utilization, Saturation, Errors), distributed traces (OpenTelemetry).
- Build dashboards around the SLOs and the golden signals (latency, traffic, errors, saturation).
- Alerts must be actionable, tied to runbooks, and paged only for user-impacting conditions; everything else goes to tickets.
- **Operational readiness**: runbooks, on-call ownership, capacity dashboards, feature flags/kill switches, config changes treated like code, incident process with blameless postmortems.
- **Infrastructure as Code** (Terraform/Pulumi/etc.), reproducible environments, environment parity (dev/staging/prod), immutable infrastructure, containerization when appropriate.
- **Cost awareness (FinOps)**: tag resources, set budgets and alerts, right-size, use autoscaling and lifecycle policies; know the unit cost per request/user.

### Performance
- **Measure first** (profile, trace, benchmark), optimize the bottleneck, re-measure. Avoid micro-optimizing without data.
- Choose algorithms and data structures with known complexity; watch memory allocation, serialization costs, and N+1 patterns.
- Set performance budgets (latency, bundle size, memory) and enforce them in CI where possible.
- Use connection pooling, compression, HTTP/2+, CDN and edge caching, and lazy loading appropriately.
- For concurrency: prefer immutability and message passing; document thread-safety; avoid shared mutable state; beware deadlocks, race conditions, and unbounded queues/goroutines/threads.

## Code quality standards

### Clean code and design
- **Names reveal intent.** Functions do one thing at one level of abstraction; keep them short. Prefer pure functions and explicit inputs/outputs.
- **SOLID, used pragmatically**; prefer composition over inheritance; program to interfaces at real boundaries, not everywhere.
- **DRY with judgment**: duplication is cheaper than the wrong abstraction. Apply the rule of three before abstracting.
- **YAGNI**: do not build for hypothetical requirements. Make code easy to extend instead of already extended.
- **Make illegal states unrepresentable**: use types, enums, value objects, and validation at boundaries; parse, don't validate, then trust internal types.
- **Explicit error handling**: no swallowed errors, no stringly-typed errors; add context, distinguish retryable from fatal, never leak internals to clients.
- **Immutability and side-effect isolation**: push I/O to the edges; keep the core deterministic and testable.
- **Dependency injection** for testability and configurability; avoid hidden globals and singletons with mutable state.
- **Comments explain why, not what.** Public APIs get doc comments with contracts, edge cases, and examples.
- **Configuration**: 12-factor style, environment-driven, validated at startup, with safe defaults; no environment-specific code branches scattered through the codebase.
- **Language idioms win.** Follow the established style guide for the language (Google style guides, PEP 8, Effective Go, etc.) and enforce with formatters/linters so style is never debated in review.

### Testing strategy
- **Test pyramid / trophy**: many fast unit tests, a solid layer of integration tests (real DB/queue via containers where it matters), few end-to-end tests on critical journeys.
- **Test behavior, not implementation.** Tests are specifications; they should fail only when behavior breaks.
- **Deterministic and hermetic**: no reliance on wall-clock time, network, ordering, or shared state; fix or quarantine flaky tests immediately.
- Cover edge cases, boundaries, error paths, concurrency, and idempotency. Use property-based testing and fuzzing for parsers and invariants.
- **Contract tests** between services/clients; **golden/snapshot tests** sparingly.
- Add **non-functional tests**: load/stress/soak, chaos/fault injection (T3), security tests, accessibility checks, migration tests.
- Every bug fix ships with a regression test. Track coverage as a signal, not a goal; prioritize risk-based coverage of critical logic.

### Version control and review
- Trunk-based or short-lived branches; small PRs with clear descriptions (what, why, how tested, risks, rollout).
- Conventional commits (`feat:`, `fix:`, `refactor:`...) for readable history and automated changelogs.
- Review for correctness, design, readability, tests, security, and operability. Be kind, specific, and focus on the code. Automate the rest (format, lint, type-check, tests, security scans).
- Protected main branch, required checks, CODEOWNERS for sensitive areas.

### CI/CD
Pipeline stages: format and lint, then type-check, then unit tests, then build, then integration tests, then security/dependency scans, then package (versioned immutable artifact), then deploy to staging with smoke tests, then progressive production rollout with automatic rollback. Keep the pipeline fast (parallelize, cache), reproducible, and the only path to production. Build once, promote the same artifact across environments.

## Layer-specific standards: Frontend, Backend, Database

Apply the relevant layer(s) in full. These build on the general principles above.

### Frontend (web and UI)

**Architecture**
- Organize by feature/domain (`features/checkout/`), each owning its components, state, API calls, and tests; keep a small shared UI/design-system layer.
- Separate presentation (dumb components) from data fetching and business logic (hooks/services/stores). Components render; they do not own business rules.
- Keep state minimal and as local as possible. Classify it: UI state (local), server state (use a cache layer such as TanStack Query/SWR/Apollo, not hand-rolled), global app state (small store), URL state (filters, tabs, pagination belong in the URL so links are shareable). Derive values rather than storing duplicates.
- Use a design system with tokens (color, spacing, type) and reusable, documented components; avoid one-off styling.
- Choose rendering strategy per page: SSG for static, SSR/streaming for SEO and fast first paint, CSR for app-like dashboards; use islands/partial hydration or edge rendering where it pays off.
- Talk to the backend through a typed API client generated from the contract (OpenAPI/GraphQL codegen); never scatter raw `fetch` calls.

**Quality**
- TypeScript in strict mode; lint, format, and type-check in CI; avoid `any`.
- Every async view has loading, empty, error, and partial states; handle offline and slow networks; use optimistic updates only with rollback.
- Forms: validate on client for UX and again on server for safety; preserve input on failure; accessible error messages.
- Error boundaries and global error reporting (Sentry or similar) with release tagging and source maps.

**Performance**
- Budget Core Web Vitals (LCP, INP, CLS) and bundle size in CI; code-split by route, lazy-load below-the-fold and heavy components, tree-shake, prefer lighter dependencies.
- Optimize images (modern formats, responsive sizes, lazy loading), fonts (subset, preload, `font-display`), and critical CSS; virtualize long lists; debounce/throttle expensive handlers; avoid unnecessary re-renders (measure before memoizing).
- Cache aggressively with a CDN and content-hashed assets; set sensible cache headers; use a service worker only when offline support is a real requirement.

**Accessibility, i18n, security**
- WCAG 2.2 AA: semantic HTML first, ARIA only to fill gaps, full keyboard navigation, visible focus, sufficient contrast, labels for all controls, reduced-motion support, screen-reader testing, automated checks (axe) in CI.
- Externalize strings from day one, support RTL, locale-aware dates/numbers/currency, and avoid text baked into images.
- Prevent XSS (never inject unsanitized HTML; sanitize rich text), set a strict CSP, use SameSite/HttpOnly/Secure cookies, avoid storing tokens in localStorage when cookies are viable, never ship secrets in the bundle (anything in client code is public).

**Testing**
- Unit tests for logic and hooks; component tests that exercise behavior the way users do (Testing Library); a few e2e tests (Playwright/Cypress) for critical journeys; visual regression for the design system; accessibility and performance checks in CI.

### Backend (services and APIs)

**Architecture**
- Layered flow: transport (HTTP/gRPC handler: parse, authenticate, validate, map errors) then application/service layer (use cases, orchestration, transactions) then domain (rules, entities) then infrastructure (DB, cache, queues, third parties). Handlers stay thin; no business logic in controllers or SQL scattered around.
- Define interfaces at boundaries (repositories, gateways) so storage and vendors can be swapped and tests can fake them.
- Model long-running work as jobs/workflows with durable state, retries, and visibility (queue plus worker, or a workflow engine for multi-step processes); never hold an HTTP request open for slow work.
- Treat third-party calls as unreliable: wrap each in a client with timeout, retry policy, circuit breaker, and metrics; map their errors to your domain errors; isolate behind an adapter.
- Use the outbox pattern when a DB change must reliably produce an event; version event schemas and keep consumers tolerant of unknown fields.

**API behavior**
- Validate every input at the edge (schema-based), enforce size and rate limits, return consistent error envelopes with stable codes and request IDs.
- Authenticate then authorize on every request, including object-level checks; keep authorization logic centralized and testable.
- Make writes idempotent (idempotency keys) and concurrency-safe (optimistic locking with version/ETag, or appropriate DB locks); define behavior for duplicate and out-of-order requests.
- Paginate, filter, and sort with indexed fields only; cap page size; avoid exposing internal IDs or leaking existence through error differences where it matters.

**Runtime and operations**
- Stateless processes; configuration from environment, validated at startup (fail fast); graceful shutdown (stop accepting, drain in-flight, close pools).
- Bound everything: connection pools, thread/worker counts, queue depths, request body sizes, timeouts. Unbounded resources become outages.
- Structured logging with request/trace IDs propagated across services; expose `/healthz` (liveness) and `/readyz` (readiness); emit RED metrics per endpoint and per dependency.
- Background jobs: idempotent, retried with backoff, dead-lettered, with alerts on queue age rather than only on errors.
- Scheduled work runs with leader election or a single scheduler so jobs do not double-fire across instances.
- Feature flags and kill switches for risky paths; per-tenant limits in multi-tenant systems (noisy neighbor protection).

**Testing**
- Unit tests for domain and services with fakes; integration tests against real dependencies via containers (DB, cache, queue); contract tests for consumed and exposed APIs; load tests on critical endpoints; failure-injection tests for timeouts and dependency outages.

### Database

**Design**
- Start from entities, relationships, invariants, and the top access patterns; confirm the engine fits them (default to PostgreSQL/MySQL-class relational unless a clear need says otherwise).
- Normalize to 3NF by default; denormalize or add materialized views only for measured read hot spots, with a documented source of truth and a refresh strategy.
- Use surrogate keys deliberately (UUIDv7/ULID for sortable distributed IDs, or bigints) and natural unique constraints for business uniqueness; avoid exposing sequential IDs publicly when enumeration is a risk.
- Enforce integrity in the database: PK, FK, UNIQUE, NOT NULL, CHECK, and appropriate types (decimal or integer minor units for money, timestamptz in UTC, enums or lookup tables for closed sets).
- Multi-tenancy: pick row-level (tenant_id on every table with enforced filtering/RLS), schema-per-tenant, or database-per-tenant based on isolation, scale, and compliance needs, and decide early because it is hard to change.
- Soft delete only when required (and index around it); prefer explicit archival; always add `created_at`/`updated_at`, and audit tables for sensitive changes.

**Indexing and queries**
- Index for real queries: B-tree on filter/join/sort columns, composite indexes ordered by selectivity and query shape, partial and covering indexes where useful; remove unused and duplicate indexes (indexes slow writes).
- Read query plans (`EXPLAIN ANALYZE`) before and after changes; eliminate N+1, `SELECT *`, unbounded scans, and offset pagination on large tables (use keyset/cursor pagination).
- Keep transactions short; choose the isolation level consciously; acquire locks in a consistent order; handle deadlock and serialization failures with retries.
- Use connection pooling (PgBouncer or equivalent) and set statement and lock timeouts so one slow query cannot cascade.

**Migrations and evolution**
- Versioned, code-reviewed migrations run by the pipeline; never edit applied migrations.
- Zero-downtime pattern (expand and contract): add nullable column or new table, dual-write, backfill in batches, switch reads, then remove the old one in a later release. Avoid long table locks (concurrent index creation, batched updates).
- Every migration is tested on production-like data volumes and has a rollback or roll-forward plan.

**Scale and reliability**
- Order of escalation: query/index tuning, then cache, then read replicas (handle replication lag and read-your-writes), then partitioning (time or key), then sharding with a carefully chosen shard key, then specialized stores (search, time-series, OLAP).
- Backups: automated, encrypted, off-site, point-in-time recovery enabled, restores rehearsed on a schedule; define and verify RPO/RTO. Plan HA (multi-AZ, automated failover) and test failover.
- Separate analytics from OLTP (replica, CDC into a warehouse); never run heavy reports on the primary.
- Monitor connections, replication lag, slow queries, lock waits, cache hit ratio, bloat/vacuum health, disk growth, and set capacity alerts well before limits.

**Security and governance**
- Least-privilege DB users per service (separate migration and runtime roles); no shared superuser credentials; credentials from a secret manager and rotated; TLS in transit; encryption at rest; network-isolated, never publicly exposed.
- Parameterized queries only; row-level security for tenant isolation where supported; column-level encryption or tokenization for the most sensitive fields; mask PII in non-production data.
- Define retention, archival, and deletion (including erasure requests) per data class, and keep an audit trail for access to sensitive data.

**Choosing a store (justify non-relational picks in an ADR)**

| Need | Typical fit |
|---|---|
| Transactions, relations, ad-hoc queries | PostgreSQL / MySQL |
| Simple key lookups, huge scale, low latency | DynamoDB / Cassandra / Redis |
| Flexible documents with moderate scale | MongoDB / Firestore (watch consistency and modeling) |
| Full-text and faceted search | Elasticsearch / OpenSearch (as a derived index, not source of truth) |
| Metrics and time-series | TimescaleDB / InfluxDB / Prometheus |
| Analytics and reporting | BigQuery / Snowflake / ClickHouse |
| Relationship-heavy traversal | Neo4j / graph layer |
| Files and blobs | Object storage (S3/GCS) with metadata in DB |
| Ephemeral cache, rate limits, locks | Redis / Memcached |

## Recommended repository layout (adapt to language/framework)

```
project/
├── README.md              # purpose, quickstart, architecture overview, links
├── CONTRIBUTING.md        # dev setup, workflow, conventions
├── SECURITY.md            # how to report vulnerabilities
├── CHANGELOG.md
├── LICENSE
├── docs/
│   ├── architecture.md    # diagrams, components, data flow
│   ├── adr/               # 0001-record-decisions.md, ...
│   ├── design/            # design docs for larger features
│   ├── runbooks/          # operational procedures per alert/failure
│   └── api/               # OpenAPI/proto specs
├── src/ (or app/, cmd/, internal/)
│   ├── <domain-or-feature>/   # cohesive modules with clear public interfaces
│   └── shared/                # truly cross-cutting utilities only
├── tests/                 # unit/, integration/, e2e/, fixtures/
├── scripts/               # dev and ops automation (idempotent, documented)
├── infra/                 # IaC, Dockerfiles, deployment manifests
├── .github/workflows/     # or equivalent CI definitions
├── .env.example           # documented config, no real secrets
├── Makefile / Taskfile    # one-command setup, test, lint, run, build
└── lockfiles, linter and formatter configs, pre-commit hooks
```

A new engineer should be able to clone, run one command, and have a working environment with passing tests.

## Documentation standards

- **README**: what and why, quickstart (copy-paste works), architecture summary, config reference, common tasks, troubleshooting, links to deeper docs.
- Keep docs next to code and update them in the same PR. Prefer diagrams-as-code (Mermaid/PlantUML) so they can be reviewed and versioned.
- Document the *why* (ADRs), the *contracts* (API specs), and the *operations* (runbooks). Avoid documenting what the code already says clearly.

## Special-domain addenda (apply when relevant)

- **Frontend/web, backend, database**: see the dedicated layer sections above.
- **Mobile**: offline-first and sync conflict resolution, battery/network awareness, secure local storage, staged rollouts with remote kill switches, backward compatibility with old app versions in the wild.
- **Data/ML pipelines**: idempotent, replayable, partitioned jobs; schema evolution and data contracts; data quality checks and lineage; reproducibility (versioned data, code, config, models); monitoring for drift; training/serving skew prevention; evaluation gates before deployment; responsible-AI review (bias, privacy, safety).
- **Libraries/SDKs**: minimal public surface, semantic versioning, stability guarantees, thorough docs and examples, no surprising global state, graceful deprecation.
- **CLI/tools**: predictable flags, helpful `--help`, exit codes, machine-readable output option, idempotent operations, safe defaults and `--dry-run` for destructive actions.
- **Infrastructure/platform**: declarative config, least-privilege IAM, network segmentation, policy-as-code, drift detection, tested disaster recovery.

## Anti-patterns to actively avoid

- Resume-driven architecture (microservices, Kubernetes, or a new database "because everyone uses it")
- Premature optimization and premature abstraction
- God classes/services, shared mutable global state, distributed monoliths
- Hardcoded secrets, config, or environment assumptions
- Swallowed exceptions, unbounded retries, missing timeouts, unbounded queues or result sets
- Dual writes without an outbox or transactional guarantee
- Big-bang rewrites and big-bang releases
- Tests coupled to implementation details; flaky tests left in the suite
- Logging sensitive data; alerting on noise
- "We'll add monitoring/security/tests later"

## Output expectations when using this skill

Match response size to the task:

- **Small request** (a function, a bug fix): give clean, idiomatic, tested code and a one- or two-line note on any important trade-off. Do not lecture.
- **New project or feature (T1-T2)**: state assumptions and tier; give the architecture in brief (diagram or bullet list), the proposed structure, then the code, tests, config, and README. Flag decisions the user should confirm.
- **Design or architecture question**: deliver a design doc using the template below, with explicit trade-offs, numbers where possible, and a phased rollout.
- **Review**: prioritize findings (blocker / major / minor / nit), explain the risk behind each, and suggest concrete fixes.

Always surface: key assumptions, the trade-offs behind major choices, known limitations, and the next logical steps. Be honest about what you did not verify. If a user's requested approach has a serious flaw, say so with reasoning and offer an alternative, then respect their decision.

## Pre-ship checklist

**Correctness and design**
- [ ] Requirements and non-goals clear; NFRs quantified
- [ ] Simplest design that meets them; alternatives considered
- [ ] Boundaries and contracts explicit; data model reviewed

**Code quality**
- [ ] Formatted, linted, type-checked; no dead code or TODOs without tickets
- [ ] Errors handled with context; inputs validated at boundaries
- [ ] Config externalized and validated; no secrets in repo

**Testing**
- [ ] Unit, integration, and critical-path e2e tests pass; failure paths tested
- [ ] Regression tests for fixed bugs; migrations tested

**Security and privacy**
- [ ] Threat model done (T2+); authN/authZ on every endpoint; least privilege
- [ ] Dependencies and images scanned; secrets managed; PII handled and minimized

**Reliability and scale**
- [ ] Timeouts, retries with backoff, idempotency, graceful degradation
- [ ] Load tested against NFRs (T2+); rate limits and pagination in place
- [ ] Backups and restore tested; rollback plan exists

**Operability**
- [ ] Structured logs, metrics, traces; dashboards and SLO-based alerts
- [ ] Runbooks, ownership, feature flags/kill switch; staged rollout configured
- [ ] IaC and reproducible deploys; cost visibility

**Documentation**
- [ ] README quickstart verified from scratch; architecture and ADRs current
- [ ] API specs published; changelog updated

## Design doc template (T2+)

```markdown
# <Title>
Status: Draft | In review | Approved | Implemented   Author:   Date:   Reviewers:

## 1. Summary
One paragraph: what we are building and why.

## 2. Context and problem
Background, users, current pain, why now.

## 3. Goals and non-goals
Goals (measurable). Explicit non-goals.

## 4. Requirements
Functional. Non-functional (scale, latency, availability, consistency, security, cost).

## 5. Proposed design
Architecture diagram; components and responsibilities; data flow;
data model and storage; API contracts; key algorithms.

## 6. Alternatives considered
Option, pros, cons, why not chosen.

## 7. Cross-cutting concerns
Security and privacy; reliability and failure modes; observability and SLOs;
performance and capacity estimates; cost; accessibility/i18n; compliance.

## 8. Rollout and migration
Phases, feature flags, backward compatibility, rollback plan, success metrics.

## 9. Testing plan
Unit, integration, load, failure injection, security.

## 10. Risks and open questions
Risk, likelihood, impact, mitigation. Unresolved decisions and owners.
```

## ADR template

```markdown
# ADR-NNNN: <Decision title>
Status: Proposed | Accepted | Superseded by ADR-XXXX    Date:
## Context
Forces at play, constraints, requirements.
## Decision
What we decided, in active voice.
## Consequences
Positive, negative, and follow-up work. What becomes easier or harder.
```

## Guiding questions to ask on every project

1. What problem are we solving, for whom, and how will we know it worked?
2. What is the simplest thing that could possibly work, and what would force us to outgrow it?
3. What happens when each dependency is slow, down, or wrong?
4. What is the blast radius of a bad deploy, and how fast can we undo it?
5. Where is the data, who can touch it, and how long do we keep it?
6. How will we find out something is broken before our users tell us?
7. Can a new teammate understand, run, and safely change this in their first day?
8. What will this cost at 10x scale, and does the architecture still make sense there?
