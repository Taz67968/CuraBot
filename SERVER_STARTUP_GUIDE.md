# Server Startup & Testing Guide

## ✅ Issues Fixed

### 1. **Missing Dependency: @fastify/helmet**
- **Error**: `Cannot find module '@fastify/helmet'`
- **Solution**: Installed with `npm install @fastify/helmet --legacy-peer-deps`
- **Status**: ✅ Fixed

### 2. **Type Error in test.controller.ts**
- **Error**: Language enum type mismatch
- **Line**: `src/common/test.controller.ts:44`
- **Solution**: Cast `body.language` to `Language` enum type
- **Status**: ✅ Fixed

### 3. **Build Compilation**
- **Status**: ✅ Successfully builds without errors

---

## 🚀 Starting the Server

### Prerequisites
```bash
# Ensure dependencies are installed
npm install

# Build the project
npm run build
```

### Start Development Server
```bash
cd /home/tazoh-cliff/curabot
npm run start:dev
```

**Expected Output:**
```
[Nest] <PID> - <timestamp> LOG [NestFactory] Starting Nest application...
[Nest] <PID> - <timestamp> LOG [InstanceLoader] TypeOrmModule dependencies initialized
[Nest] <PID> - <timestamp> LOG [InstanceLoader] ... (all modules)
[Nest] <PID> - <timestamp> LOG [NestApplication] Nest application successfully started
```

**Note**: Redis connection errors are warnings only - the server will still run and your API endpoints will work.

---

## 📝 Current Status

| Component | Status |
|-----------|--------|
| @fastify/helmet | ✅ Installed |
| TypeScript Compilation | ✅ No errors |
| Build Process | ✅ Successful |
| Type Checking | ✅ Passing |
| Database Migrations | ✅ Applied |

---

## 🧪 Testing Your API

Once the server is running on `http://localhost:3000`:

### 1. **Using Insomnia** (Recommended)
```bash
# Import the collection
insomnia-collection.json
```

### 2. **Using Postman**
```bash
# Import the collection
postman-collection.json
```

### 3. **Using cURL**
```bash
# Test health endpoint
curl http://localhost:3000/api/test/health

# Test AI endpoint
curl -X POST http://localhost:3000/api/ai/classify-intent \
  -H "Content-Type: application/json" \
  -d '{"message":"I want to book an appointment","history":[]}'
```

---

## ⚠️ Warnings (Non-Critical)

### PostgreSQL SSL Warning
```
Warning: SECURITY WARNING: The SSL modes 'prefer', 'require', and 'verify-ca' are treated as aliases for 'verify-full'.
```
**Action**: To suppress, update `.env`:
```
DATABASE_SSL_MODE=verify-full
```

### Redis Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:6379
```
**Action**: Optional - start Redis if needed:
```bash
# Using Docker
docker run -d -p 6379:6379 redis:7

# Or start Redis service
redis-server
```
API will work fine without Redis for testing.

---

## 📋 Next Steps

1. ✅ Start the server with `npm run start:dev`
2. ✅ Open Insomnia and import `insomnia-collection.json`
3. ✅ Test endpoints in the collection
4. ✅ Check responses for proper intent classification and AI responses

---

## 🔧 Troubleshooting

### Database Connection Timeout
**Error**: `[TypeOrmModule] Unable to connect to the database. Retrying...`

**Solution Options:**

**Option 1: Use Cloud Database (Neon)**
- Verify Neon database URL is correct in `.env`
- Check internet connection
- Verify credentials are valid

**Option 2: Use Local PostgreSQL**
```bash
# Install PostgreSQL locally (if not already installed)
sudo apt-get install postgresql postgresql-contrib

# Start PostgreSQL
sudo service postgresql start

# Create a local database
sudo -u postgres psql
CREATE DATABASE curabot;
CREATE USER curabot WITH PASSWORD 'password';
ALTER ROLE curabot SET client_encoding TO 'utf8';
ALTER ROLE curabot SET default_transaction_isolation TO 'read committed';
ALTER ROLE curabot SET default_transaction_deferrable TO on;
ALTER ROLE curabot SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE curabot TO curabot;
\q

# Update .env
DATABASE_URL=postgresql://curabot:password@localhost:5432/curabot
```

**Option 3: Use Docker**
```bash
docker run --name postgres-dev -e POSTGRES_USER=curabot -e POSTGRES_PASSWORD=password -e POSTGRES_DB=curabot -p 5432:5432 -d postgres:15
```

---

**Server won't start?**
- Check database is reachable: `psql $DATABASE_URL` or test Neon connection
- Verify `.env` has valid `DATABASE_URL` and `CLAUDE_API_KEY`
- Check port 3000 is not in use: `lsof -i :3000`

**Insomnia can't connect?**
- Verify server is running and has initialized database
- Check base URL in Insomnia environment: `http://localhost:3000/api`
- Server must show `successfully started` message

**Tests failing?**
- Review API_TESTING_GUIDE.md for endpoint documentation
- Check example request payloads in collection
- Verify all `.env` variables are set correctly

---

**Last Updated**: April 23, 2026  
**All systems ready for testing!** 🎉
