# Tripverse System Architecture Overview

## Table of Contents

- [System Overview](#system-overview)
- [Architecture Diagrams](#architecture-diagrams)
- [Component Architecture](#component-architecture)
- [Data Flow](#data-flow)
- [Technology Stack](#technology-stack)
- [Deployment Architecture](#deployment-architecture)
- [Security Architecture](#security-architecture)
- [Integration Points](#integration-points)

## System Overview

Tripverse is a comprehensive travel community platform built with a modern architecture. The system includes a React-based frontend, a Node.js/Express backend, and optional integration with WSO2 API Manager to enable enterprise-level API management for the Tripverse Discover service.


### Key Components

1. **Frontend (React)**: User interface and client-side logic
2. **Backend (Node.js/Express)**: API server and business logic
3. **Database (MongoDB)**: Data persistence
4. **WSO2 API Manager**: API gateway and management (optional)
5. **External APIs**: Weather, Places, Currency services
6. **Real-time (Socket.IO)**: WebSocket communication
7. **File Storage (Cloudinary)**: Image and media storage

## Architecture Diagrams

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Interface Layer                     │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │           React Frontend (Vite + React 18)               │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │   │
│  │  │  Pages   │  │Components│  │  Redux   │  │  Utils   │  │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/HTTPS
                              │ WebSocket (Socket.IO)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    API Gateway Layer                            │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │         WSO2 API Manager (Gateway)                       │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐                │   │
│  │  │ OAuth2   │  │Throttling│  │ Caching  │                │   │
│  │  │  Auth    │  │ Policies │  │ Policies │                │   │
│  │  └──────────┘  └──────────┘  └──────────┘                │   │
│  │  ┌─────────────────────────────────────────────────┐     │   │
│  │  │        Mediation Sequences                      │     │   │
│  │  │  (discover-aggregate-sequence.xml)              │     │   │
│  │  └─────────────────────────────────────────────────┘     │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Application Layer                          │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │         Express.js Backend (Node.js)                     │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │   │
│  │  │ Routes   │  │Controllers│  │Middleware│  │  Utils  │  │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │   │
│  │  ┌──────────────────────────────────────────────────┐    │   │
│  │  │         Socket.IO Server                         │    │   │
│  │  │    (Real-time Chat & Notifications)              │    │   │
│  │  └──────────────────────────────────────────────────┘    │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   MongoDB    │    │  Cloudinary  │    │ External APIs│
│  Database    │    │  File Storage│    │              │
│              │    │              │    │ - Weather    │
│ - Users      │    │ - Images     │    │ - Places     │
│ - Posts      │    │ - Media      │    │ - Currency   │
│ - Profiles   │    │              │    │              │
│ - Comments   │    │              │    │              │
│ - Chats      │    │              │    │              │
└──────────────┘    └──────────────┘    └──────────────┘
```

### Architecture with WSO2 - TripverseDiscover API

```
┌──────────────────────────────────────────────────────────────────┐
│                         React Frontend                           │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │  Discover Page                                           │    │
│  │  ┌────────────────────────────────────────────────────┐  │    │
│  │  │  discoverApi.js → wso2Auth.js                      │  │    │
│  │  │  (OAuth2 Token Management)                         │  │    │
│  │  └────────────────────────────────────────────────────┘  │    │
│  └──────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS
                              │ OAuth2 Bearer Token
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│                    WSO2 API Gateway (8243)                       │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │  TripverseDiscover API                                   │    │
│  │  Context: /tripverse/discover/v1                         │    │
│  │                                                          │    │
│  │  ┌────────────────────────────────────────────────────┐  │    │
│  │  │  GET /aggregate/{location}                         │  │    │
│  │  │  ├─ OAuth2 Validation                              │  │    │
│  │  │  ├─ Throttling Check                               │  │    │
│  │  │  ├─ Cache Check                                    │  │    │
│  │  │  └─ Mediation Sequence                             │  │    │
│  │  └────────────────────────────────────────────────────┘  │    │
│  │                                                          │    │
│  │  ┌────────────────────────────────────────────────────┐  │    │
│  │  │  Mediation: discover-aggregate-sequence            │  │    │
│  │  │  ├─ Call /weather/{location}                       │  │    │
│  │  │  ├─ Call /attractions/{location}                   │  │    │
│  │  │  ├─ Call /currency/USD                             │  │    │
│  │  │  └─ Aggregate responses                            │  │    │
│  │  └────────────────────────────────────────────────────┘  │    │
│  └──────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP
                              │ Proxy to Backend
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│              Express Backend (localhost:5000)                    │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │  /api/discover/aggregate/:location                       │    │
│  │  ┌────────────────────────────────────────────────────┐  │    │
│  │  │  discoverController.js                             │  │    │
│  │  │  ├─ Parallel API Calls (Promise.allSettled)        │  │    │
│  │  │  ├─ Error Handling                                 │  │    │
│  │  │  └─ Response Aggregation                           │  │    │
│  │  └────────────────────────────────────────────────────┘  │    │
│  └──────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ OpenWeather  │    │ Google Places│    │ExchangeRate  │
│     API      │    │     API      │    │     API      │
└──────────────┘    └──────────────┘    └──────────────┘
```

### Data Flow: Discover Feature Request

```
1. User enters location in Discover page
   │
   ▼
2. Frontend calls discoverApi.getAggregatedInfo(location)
   │
   ▼
3. wso2Auth.js checks for valid OAuth2 token
   │
   ├─ Token valid? ──YES──> Use existing token
   │
   └─ NO ──> Acquire new token from WSO2
   │
   ▼
4. Request sent to WSO2 Gateway
   │
   │ POST /oauth2/token (if needed)
   │ GET /tripverse/discover/v1/aggregate/{location}
   │
   ▼
5. WSO2 Gateway validates OAuth2 token
   │
   ├─ Valid? ──YES──> Check throttling policies
   │
   └─ NO ──> Return 401 Unauthorized
   │
   ▼
6. WSO2 checks cache
   │
   ├─ Cache hit? ──YES──> Return cached response
   │
   └─ NO ──> Execute mediation sequence
   │
   ▼
7. Mediation sequence calls backend endpoints in parallel
   │
   ├─ GET /api/discover/weather/{location}
   ├─ GET /api/discover/attractions/{location}
   └─ GET /api/discover/currency/USD
   │
   ▼
8. Backend makes external API calls
   │
   ├─ OpenWeatherMap API
   ├─ Google Places API
   └─ ExchangeRate API
   │
   ▼
9. Backend aggregates responses
   │
   ▼
10. Response flows back through WSO2
    │
    ├─ Cache response (1 hour TTL)
    └─ Transform response format
    │
    ▼
11. Frontend receives aggregated data
    │
    ▼
12. UI displays weather, attractions, currency
```

## Component Architecture

### Frontend Components

```
client/
├── src/
│   ├── pages/
│   │   ├── Discover.jsx          # Discover page component
│   │   ├── Home.jsx               # Home feed
│   │   ├── Profile.jsx            # User profile
│   │   └── ...
│   ├── components/
│   │   ├── Navbar.jsx             # Navigation with Discover link
│   │   └── ...
│   ├── utils/
│   │   ├── discoverApi.js         # WSO2 Gateway API calls
│   │   ├── wso2Auth.js            # OAuth2 token management
│   │   └── api.js                 # Base API configuration
│   ├── features/
│   │   └── ...                    # Redux slices
│   └── contexts/
│       └── SocketContext.jsx      # Socket.IO context
```

### Backend Components

```
server/
├── routes/
│   ├── discoverRoutes.js          # Discover API routes
│   └── ...
├── controllers/
│   ├── discoverController.js      # Discover business logic
│   └── ...
├── middleware/
│   ├── authMiddleware.js          # JWT authentication
│   └── ...
├── utils/
│   ├── wso2Integration.js         # WSO2 utilities
│   └── ...
└── models/
    └── ...                        # MongoDB schemas
```

### WSO2 Components

```
wso2-mediation/
└── discover-aggregate-sequence.xml  # Aggregation mediation sequence

docs/
├── WSO2_INTEGRATION.md              # WSO2 setup guide
└── ARCHITECTURE.md                   # This file
```

## Data Flow

### Authentication Flow

```
1. User Login
   │
   ▼
2. Backend validates credentials
   │
   ├─ Valid? ──YES──> Generate JWT token
   │
   └─ NO ──> Return 401
   │
   ▼
3. Frontend stores JWT token
   │
   ▼
4. For Discover API calls:
   │
   ├─ JWT token for Tripverse auth (existing)
   └─ OAuth2 token for WSO2 Gateway (new)
   │
   ▼
5. WSO2 validates OAuth2 token
   │
   ├─ Valid? ──YES──> Forward to backend
   │
   └─ NO ──> Return 401
   │
   ▼
6. Backend validates JWT token (if needed)
   │
   ▼
7. Process request
```

### Real-time Communication Flow

```
1. User connects to Socket.IO
   │
   ▼
2. Socket.IO validates JWT token
   │
   ├─ Valid? ──YES──> Join user room
   │
   └─ NO ──> Reject connection
   │
   ▼
3. User joins chat room
   │
   ▼
4. Messages broadcast to room
   │
   ▼
5. Real-time updates via WebSocket
```

## Technology Stack

### Frontend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18+ | UI framework |
| Vite | Latest | Build tool |
| Redux Toolkit | Latest | State management |
| React Router | v7 | Routing |
| Axios | Latest | HTTP client |
| Socket.IO Client | Latest | WebSocket client |
| Tailwind CSS | Latest | Styling |
| Material-UI | Latest | UI components |
| Lucide React | Latest | Icons |

### Backend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 16+ | Runtime |
| Express.js | 4.21+ | Web framework |
| MongoDB | Latest | Database |
| Mongoose | 8.10+ | ODM |
| Socket.IO | 4.8+ | WebSocket server |
| JWT | Latest | Authentication |
| Axios | Latest | HTTP client |
| Cloudinary | Latest | File storage |
| Express Rate Limit | Latest | Rate limiting |

### API Gateway

| Technology | Version | Purpose |
|------------|---------|---------|
| WSO2 API Manager | 4.2.0+ | API Gateway |
| Java | 11 or 17 | WSO2 Runtime |

### External Services

| Service | Purpose |
|---------|---------|
| OpenWeatherMap API | Weather data |
| Google Places API | Attractions data |
| ExchangeRate API | Currency data |
| Cloudinary | Image storage |

## Deployment Architecture

### Development Environment

```
┌─────────────────┐
│  React Dev      │
│  localhost:5173 │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  WSO2 Gateway   │
│  localhost:8243 │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Express Server │
│  localhost:5000 │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  MongoDB        │
│  localhost:27017│
└─────────────────┘
```

### Production Environment

```
                    ┌─────────────────┐
                    │  Load Balancer  │
                    │   (HTTPS/443)   │
                    └────────┬────────┘
                             │
            ┌────────────────┼────────────────┐
            │                │                │
            ▼                ▼                ▼
    ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
    │  WSO2 GW 1  │  │  WSO2 GW 2  │  │  WSO2 GW 3  │
    │   (8243)    │  │   (8243)    │  │   (8243)    │
    └──────┬──────┘  └──────┬──────┘  └──────┬──────┘
           │                │                │
           └────────────────┼────────────────┘
                            │
                            ▼
                    ┌─────────────────┐
                    │  Express Servers│
                    │  (Cluster Mode) │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  MongoDB Atlas  │
                    │  (Replica Set)  │
                    └─────────────────┘
```

## Security Architecture

### Authentication Layers

1. **Frontend Authentication**
   - JWT token stored in localStorage
   - Token expiration handling
   - Automatic token refresh

2. **WSO2 Gateway Authentication**
   - OAuth2 client credentials flow
   - Token validation
   - Token refresh mechanism

3. **Backend Authentication**
   - JWT token validation
   - Role-based access control (RBAC)
   - Admin middleware

### Security Measures

```
┌─────────────────────────────────────┐
│  Security Layers                    │
├─────────────────────────────────────┤
│  1. HTTPS/TLS Encryption            │
│  2. OAuth2 Token Validation         │
│  3. JWT Token Validation            │
│  4. Rate Limiting (WSO2 + Express)  │
│  5. CORS Protection                 │
│  6. Input Validation                │
│  7. SQL Injection Prevention        │
│  8. XSS Protection                  │
│  9. CSRF Protection                 │
│  10. API Key Management             │
└─────────────────────────────────────┘
```

## Integration Points

### WSO2 Integration

- **Gateway URL**: `https://localhost:8243/tripverse/discover/v1`
- **Token URL**: `https://localhost:9443/oauth2/token`
- **Publisher URL**: `https://localhost:9443/publisher`
- **Developer Portal**: `https://localhost:9443/devportal`

### External API Integrations

- **OpenWeatherMap**: Weather data
- **Google Places**: Tourist attractions
- **ExchangeRate API**: Currency exchange rates

### Internal Services

- **MongoDB**: User data, posts, profiles, comments, chats
- **Cloudinary**: Image and media storage
- **Socket.IO**: Real-time communication

## Scalability Considerations

### Horizontal Scaling

- **Frontend**: Stateless, can be replicated
- **Backend**: Stateless, can be clustered
- **WSO2 Gateway**: Can be clustered
- **MongoDB**: Replica sets for read scaling

### Caching Strategy

- **WSO2 Gateway**: Response caching (1 hour TTL)
- **Backend**: In-memory caching for external APIs
- **Frontend**: Redux state management

### Load Balancing

- **WSO2 Gateway**: Built-in load balancing
- **Backend**: External load balancer (Nginx, AWS ALB)
- **Database**: MongoDB replica sets

## Monitoring & Observability

### Logging

- **Frontend**: Browser console, error tracking
- **Backend**: Console logs, structured logging
- **WSO2**: Carbon logs, analytics

### Metrics

- **API Usage**: WSO2 analytics
- **Performance**: Response times, throughput
- **Errors**: Error rates, failure tracking

### Health Checks

- **Backend**: `/api/health`
- **WSO2**: `/health` endpoint
- **Database**: Connection health checks

## Future Enhancements

### Planned Features

1. **Microservices Architecture**
   - Separate services for different domains
   - Service mesh integration

2. **Advanced Analytics**
   - Real-time analytics dashboard
   - User behavior tracking
   - API usage patterns

3. **Enhanced Security**
   - API key rotation
   - Advanced threat detection
   - Security monitoring

4. **Performance Optimization**
   - CDN integration
   - Advanced caching strategies
   - Database optimization

## References

- [WSO2 Integration Guide](WSO2_INTEGRATION.md)
- [API Documentation](../api_docs/openapi.yaml)
- [Project README](../README.md)
