# WSO2 API Manager Integration Guide

This guide explains how to integrate WSO2 API Manager with Tripverse Discover feature

## Architecture Overview

```
Frontend (React) → WSO2 API Gateway → Express Backend → External APIs
```

All API calls go through WSO2 Gateway. No fallback to direct backend.

## Prerequisites

1. **WSO2 API Manager 4.2.0+** installed and running
2. **Java 11 or 17** installed
3. **Backend server** running on port 5000
4. **Valid API keys** for external services (OpenWeatherMap, Google Places)

## Phase 1: WSO2 Installation & Setup

### 1.1 Download WSO2 API Manager

```bash
# Download WSO2 API Manager 4.2.0
wget https://github.com/wso2/product-apim/releases/download/v4.2.0/wso2am-4.2.0.zip

# Extract
unzip wso2am-4.2.0.zip
cd wso2am-4.2.0
```

### 1.2 Configure WSO2

Edit `<WSO2_HOME>/repository/conf/deployment.toml`:

```toml
[server]
hostname = "localhost"
node_ip = "127.0.0.1"
base_path = "https://$ref{server.hostname}:${carbon.management.port}"

[super_admin]
username = "admin"
password = "admin"
create_admin_account = true

[transport.http]
properties.port = 9763
properties.proxyPort = 80

[transport.https.properties]
port = 9443
proxyPort = 443
```

### 1.3 Start WSO2

```bash
# Linux/Mac
./bin/wso2server.sh

# Windows
bin\wso2server.bat
```

Access:
- **Publisher**: https://localhost:9443/publisher
- **Developer Portal**: https://localhost:9443/devportal
- **Gateway**: https://localhost:8243

## Phase 2: Create API in WSO2 Publisher

### 2.1 Create New API

1. Login to Publisher: https://localhost:9443/publisher
2. Click **Create API** → **Design a New REST API**
3. Configure:
   - **Name**: `TripverseDiscover`
   - **Context**: `/tripverse/discover/v1`
   - **Version**: `1.0.0`
   - **Endpoint Type**: HTTP/REST endpoint
   - **Production Endpoint**: `http://localhost:5000/api/discover`
   - **Sandbox Endpoint**: `http://localhost:5000/api/discover`

### 2.2 Define API Resources

Add resources in **Resources** tab:

1. **GET /weather/{location}**
   - Resource path: `/weather/{location}`
   - Methods: GET

2. **GET /attractions/{location}**
   - Resource path: `/attractions/{location}`
   - Methods: GET

3. **GET /currency/{base}**
   - Resource path: `/currency/{base}`
   - Methods: GET

4. **GET /aggregate/{location}**
   - Resource path: `/aggregate/{location}`
   - Methods: GET
   - Attach mediation sequence: `discover-aggregate-sequence`

## Phase 3: Upload Mediation Sequence

### 3.1 Create Mediation Sequence

The mediation sequence file is located at:
- `wso2-mediation/discover-aggregate-sequence.xml`

### 3.2 Upload to WSO2

1. In Publisher, go to **Mediation Sequences**
2. Click **Add New Sequence**
3. Name: `discover-aggregate-sequence`
4. Copy content from `wso2-mediation/discover-aggregate-sequence.xml`
5. Save and deploy

### 3.3 Attach to API Resource

1. Go to API → **Resources** tab
2. Edit `/aggregate/{location}` resource
3. In **In Flow**, select **discover-aggregate-sequence**
4. Save

## Phase 4: Configure API Policies

### 4.1 Throttling Policies

1. Go to **Throttling Policies** → **Advanced Policies**
2. Create tiers:
   - **Bronze**: 100 requests/hour
   - **Silver**: 1000 requests/hour
   - **Gold**: 10000 requests/hour

3. Apply to API:
   - Go to API → **Runtime Configuration**
   - Select throttling tier

### 4.2 Caching Policy

1. Go to API → **Runtime Configuration**
2. Enable **Response Caching**
3. Set **Cache Timeout**: 3600 seconds (1 hour)
4. Select **Cache Scope**: Application

### 4.3 Security

1. Go to API → **Runtime Configuration**
2. Select **OAuth2** as authentication type
3. Save

## Phase 5: Publish API

### 5.1 Create Application

1. Go to Developer Portal: https://localhost:9443/devportal
2. Login
3. Go to **Applications** → **Create New Application**
4. Name: `Tripverse Frontend`
5. Note: Generate OAuth2 credentials

### 5.2 Subscribe to API

1. Go to **APIs** → Find `TripverseDiscover`
2. Click **Subscribe**
3. Select application: `Tripverse Frontend`
4. Select subscription tier (Bronze/Silver/Gold)
5. Click **Subscribe**

### 5.3 Generate OAuth2 Credentials

1. Go to **Applications** → `Tripverse Frontend`
2. Click **Production Keys**
3. Click **Generate Keys**
4. Copy **Consumer Key** and **Consumer Secret**

### 5.4 Publish API

1. Go back to Publisher
2. Click **Lifecycle** → **Publish**
3. API is now available in Developer Portal

## Phase 6: Configure Frontend

### 6.1 Environment Variables

Create or update `client/.env`:

```env
VITE_WSO2_GATEWAY_URL=https://localhost:8243/tripverse/discover/v1
VITE_WSO2_TOKEN_URL=https://localhost:9443/oauth2/token
VITE_WSO2_CLIENT_ID=your_consumer_key_from_step_5.3
VITE_WSO2_CLIENT_SECRET=your_consumer_secret_from_step_5.3
```

### 6.2 Install Dependencies

No additional dependencies needed. The integration uses:
- `axios` (already installed)
- `wso2Auth.js` (OAuth2 token management)
- `discoverApi.js` (updated to use WSO2 Gateway)

### 6.3 Test Integration

1. Start frontend: `npm run dev` (in client directory)
2. Start backend: `npm run dev` (in server directory)
3. Start WSO2: `./bin/wso2server.sh`
4. Login to Tripverse
5. Navigate to **Discover** page
6. Search for a location (e.g., "Paris, France")
7. Verify data loads through WSO2 Gateway

## Phase 7: Backend Configuration

### 7.1 Environment Variables

Update `server/.env`:

```env
# WSO2 Configuration
WSO2_GATEWAY_URL=https://localhost:8243
WSO2_PUBLISHER_URL=https://localhost:9443
WSO2_USERNAME=admin
WSO2_PASSWORD=admin
WSO2_CLIENT_ID=your_client_id
WSO2_CLIENT_SECRET=your_client_secret
```

### 7.2 Health Check Endpoint

The backend includes WSO2 integration utilities in:
- `server/utils/wso2Integration.js`

You can add a health check endpoint to verify WSO2 connectivity:

```javascript
// In server/routes/discoverRoutes.js
const { checkWSO2Health } = require("../utils/wso2Integration");

router.get("/health/wso2", async (req, res) => {
  const health = await checkWSO2Health();
  res.json(health);
});
```

## Troubleshooting

### Issue: "Failed to acquire WSO2 access token"

**Solution**:
1. Verify WSO2 is running: `https://localhost:9443`
2. Check `VITE_WSO2_CLIENT_ID` and `VITE_WSO2_CLIENT_SECRET` in `.env`
3. Verify OAuth2 credentials in Developer Portal
4. Check browser console for detailed error

### Issue: "401 Unauthorized" from Gateway

**Solution**:
1. Verify API is published in WSO2
2. Check application is subscribed to API
3. Verify OAuth2 token is valid
4. Check API security settings in Publisher

### Issue: "Connection refused" to Gateway

**Solution**:
1. Verify WSO2 Gateway is running on port 8243
2. Check firewall settings
3. Verify `VITE_WSO2_GATEWAY_URL` is correct
4. Test gateway: `curl https://localhost:8243/health`

### Issue: Mediation sequence not executing

**Solution**:
1. Verify sequence is uploaded to WSO2
2. Check sequence is attached to resource in Publisher
3. Verify sequence syntax (XML)
4. Check WSO2 logs: `<WSO2_HOME>/repository/logs/wso2carbon.log`

## Testing

### Test Individual Endpoints

```bash
# Get OAuth2 token
TOKEN=$(curl -X POST https://localhost:9443/oauth2/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -u "client_id:client_secret" \
  -d "grant_type=client_credentials" | jq -r '.access_token')

# Test weather endpoint
curl -H "Authorization: Bearer $TOKEN" \
  https://localhost:8243/tripverse/discover/v1/weather/Paris

# Test aggregate endpoint
curl -H "Authorization: Bearer $TOKEN" \
  https://localhost:8243/tripverse/discover/v1/aggregate/Paris
```

## Monitoring

### WSO2 Analytics

1. Go to Publisher → **Analytics**
2. View API usage statistics
3. Monitor request rates
4. Check error rates

### Logs

- WSO2 Logs: `<WSO2_HOME>/repository/logs/wso2carbon.log`
- Backend Logs: Check server console
- Frontend Logs: Browser console

## Production Deployment

### Considerations

1. **HTTPS**: Use proper SSL certificates
2. **Database**: Use MySQL/PostgreSQL for production
3. **High Availability**: Configure WSO2 cluster
4. **Load Balancing**: Use load balancer for Gateway
5. **Monitoring**: Set up proper monitoring and alerts

### Environment Variables (Production)

```env
VITE_WSO2_GATEWAY_URL=https://api-gateway.yourdomain.com/tripverse/discover/v1
VITE_WSO2_TOKEN_URL=https://api-gateway.yourdomain.com/oauth2/token
```

## Security Best Practices

1. **Rotate OAuth2 credentials** regularly
2. **Use HTTPS** for all WSO2 endpoints
3. **Restrict API access** using throttling policies
4. **Monitor API usage** for anomalies
5. **Keep WSO2 updated** with security patches

## Support

For WSO2-specific issues:
- WSO2 Documentation: https://apim.docs.wso2.com/
- WSO2 Community: https://wso2.com/community/

For Tripverse-specific issues:
- Check project README.md
- Review server logs and browser console

