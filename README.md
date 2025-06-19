# System Diagrams

## High-Level System Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        UI[React Frontend]
        WF[Workflow Form]
        WV[Workflow Viewer]
        WC[Workflow Canvas]
    end
    
    subgraph "Application Layer"
        API[Hono API Server]
        CTRL[Controllers]
        SVC[Services]
        VAL[Validators]
    end
    
    subgraph "Data Layer"
        DB[(MongoDB)]
        CACHE[(Redis Cache)]
    end
    
    UI --> WF
    UI --> WV
    UI --> WC
    
    WF --> API
    WV --> API
    WC --> API
    
    API --> CTRL
    CTRL --> SVC
    SVC --> VAL
    SVC --> DB
    SVC --> CACHE
    
    style UI fill:#e1f5fe
    style API fill:#f3e5f5
    style DB fill:#e8f5e8
```

## Component Data Flow

```mermaid
sequenceDiagram
    participant User
    participant WorkflowForm
    participant API_Service
    participant HonoAPI
    participant WorkflowService
    participant MongoDB
    participant WorkflowViewer
    
    User->>WorkflowForm: Fill workflow details
    WorkflowForm->>WorkflowForm: Validate input
    WorkflowForm->>API_Service: createWorkflow(data)
    API_Service->>HonoAPI: POST /workflows
    HonoAPI->>WorkflowService: processWorkflow(data)
    WorkflowService->>WorkflowService: Apply business rules
    WorkflowService->>MongoDB: Save workflow
    MongoDB-->>WorkflowService: Return saved workflow
    WorkflowService-->>HonoAPI: Return response
    HonoAPI-->>API_Service: HTTP 201 + workflow data
    API_Service-->>WorkflowForm: Success response
    WorkflowForm->>WorkflowViewer: Pass workflow data
    WorkflowViewer->>User: Display workflow
```

## Clean Architecture Layers

```mermaid
graph TD
    subgraph "Presentation Layer"
        A[React Components]
        B[UI State Management]
        C[Form Validation]
    end
    
    subgraph "Application Layer"
        D[API Services]
        E[Use Cases]
        F[DTOs/Interfaces]
    end
    
    subgraph "Domain Layer"
        G[Business Logic]
        H[Domain Models]
        I[Validation Rules]
    end
    
    subgraph "Infrastructure Layer"
        J[HTTP Client]
        K[Database Access]
        L[Environment Config]
    end
    
    A --> D
    B --> E
    C --> F
    D --> G
    E --> H
    F --> I
    G --> J
    H --> K
    I --> L
    
    style A fill:#ffeb3b
    style G fill:#4caf50
    style J fill:#2196f3
```

## Database Schema Design

```mermaid
erDiagram
    WORKFLOW ||--o{ NODE : contains
    WORKFLOW ||--o{ TRANSITION : contains
    NODE ||--o{ TRANSITION : "from/to"
    
    WORKFLOW {
        ObjectId _id PK
        string name
        number __v
        date createdAt
        date updatedAt
    }
    
    NODE {
        ObjectId _id PK
        string id "User-defined ID"
        string name
        ObjectId workflow_id FK
    }
    
    TRANSITION {
        ObjectId _id PK
        string from "Source node ID"
        string to "Target node ID"
        ObjectId workflow_id FK
    }
```

## API Request/Response Flow

```mermaid
graph LR
    subgraph "Client Side"
        CF[Component Form]
        AS[API Service]
        AX[Axios/Fetch]
    end
    
    subgraph "Server Side"
        HN[Hono Router]
        CT[Controller]
        SV[Service Layer]
        MD[MongoDB]
    end
    
    CF -->|User Input| AS
    AS -->|HTTP Request| AX
    AX -->|POST /workflows| HN
    HN -->|Route Handler| CT
    CT -->|Business Logic| SV
    SV -->|Database Query| MD
    MD -->|Workflow Data| SV
    SV -->|Response Data| CT
    CT -->|JSON Response| HN
    HN -->|HTTP Response| AX
    AX -->|Parse Response| AS
    AS -->|Update State| CF
    
    style CF fill:#e3f2fd
    style HN fill:#f3e5f5
    style MD fill:#e8f5e8
```

## Finite State Machine (FSM) Model

```mermaid
stateDiagram-v2
    [*] --> StartNode
    StartNode --> TaskNode1
    TaskNode1 --> TaskNode2
    TaskNode2 --> EndNode
    EndNode --> [*]
    
    TaskNode1 --> TaskNode3
    TaskNode3 --> EndNode
    
    note right of StartNode
        Entry point
        No incoming transitions
    end note
    
    note left of EndNode
        Exit point
        No outgoing transitions
    end note
    
    note top of TaskNode2
        Processing nodes
        Have both incoming
        and outgoing transitions
    end note
```

## Scalability Architecture

```mermaid
graph TB
    subgraph "Load Balancer Tier"
        LB[Nginx Load Balancer]
        CDN[CDN - Static Assets]
    end
    
    subgraph "Application Tier"
        APP1[Hono Server 1]
        APP2[Hono Server 2]
        APP3[Hono Server 3]
    end
    
    subgraph "Caching Tier"
        REDIS[Redis Cluster]
        MEMCACHE[Memory Cache]
    end
    
    subgraph "Database Tier"
        PRIMARY[(MongoDB Primary)]
        SECONDARY1[(MongoDB Secondary 1)]
        SECONDARY2[(MongoDB Secondary 2)]
    end
    
    subgraph "Monitoring"
        METRICS[Metrics Collection]
        LOGS[Log Aggregation]
        ALERTS[Alerting System]
    end
    
    LB --> APP1
    LB --> APP2
    LB --> APP3
    
    APP1 --> REDIS
    APP2 --> REDIS
    APP3 --> REDIS
    
    APP1 --> PRIMARY
    APP2 --> SECONDARY1
    APP3 --> SECONDARY2
    
    PRIMARY --> SECONDARY1
    PRIMARY --> SECONDARY2
    
    APP1 --> METRICS
    APP2 --> LOGS
    APP3 --> ALERTS
    
    style LB fill:#ff9800
    style REDIS fill:#f44336
    style PRIMARY fill:#4caf50
```

## Component Interaction Flow

```mermaid
graph TD
    subgraph "Frontend Components"
        APP[App.tsx]
        FORM[WorkflowForm.tsx]
        VIEWER[WorkflowViewer.tsx]
        CANVAS[WorkflowCanvas.tsx]
    end
    
    subgraph "Services Layer"
        API[api.ts]
        TYPES[workflow.ts]
    end
    
    subgraph "Backend Controllers"
        CONTROLLER[WorkflowController]
        SERVICE[WorkflowService]
        REPO[WorkflowRepository]
    end
    
    APP --> FORM
    APP --> VIEWER
    APP --> CANVAS
    
    FORM --> API
    VIEWER --> API
    CANVAS --> API
    
    API --> TYPES
    
    API -.->|HTTP| CONTROLLER
    CONTROLLER --> SERVICE
    SERVICE --> REPO
    
    style APP fill:#2196f3,color:#fff
    style API fill:#ff9800,color:#fff
    style CONTROLLER fill:#4caf50,color:#fff
```

## Error Handling Flow

```mermaid
graph TD
    A[User Action] --> B{Validation}
    B -->|Valid| C[API Call]
    B -->|Invalid| D[Client Error]
    
    C --> E{Server Response}
    E -->|Success| F[Update UI]
    E -->|Error| G[Server Error]
    
    D --> H[Show Error Message]
    G --> H
    F --> I[Success State]
    H --> J[Error State]
    
    I --> K[User Continues]
    J --> L[User Retries]
    L --> A
    
    style D fill:#ffcdd2
    style G fill:#ffcdd2
    style H fill:#ffcdd2
    style F fill:#c8e6c9
    style I fill:#c8e6c9
```

## Deployment Architecture

```mermaid
graph TB
    subgraph "Development"
        DEV_FE[React Dev Server]
        DEV_BE[Bun Dev Server]
        DEV_DB[(Local MongoDB)]
    end
    
    subgraph "Production"
        PROD_CDN[CDN]
        PROD_LB[Load Balancer]
        PROD_APP[Application Servers]
        PROD_DB[(MongoDB Cluster)]
        PROD_CACHE[(Redis)]
    end
    
    subgraph "CI/CD Pipeline"
        GIT[Git Repository]
        BUILD[Build Process]
        TEST[Test Suite]
        DEPLOY[Deployment]
    end
    
    DEV_FE -.->|Development| GIT
    DEV_BE -.->|Development| GIT
    
    GIT --> BUILD
    BUILD --> TEST
