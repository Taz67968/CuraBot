# CuraBot - AI-Powered WhatsApp Healthcare Assistant

A production-grade NestJS application that provides AI-powered healthcare appointment booking and symptom triage via WhatsApp Business Cloud API.

## Features

- 🤖 **AI Intent Detection** - Claude-powered conversation understanding
- 💬 **Multi-turn Conversations** - Redis-backed session management
- 📅 **Appointment Booking** - Real-time slot management with conflict detection
- 🩺 **Symptom Triage** - Severity scoring and emergency detection
- ⏰ **Automated Reminders** - 24h and 1h before appointments
- 🌐 **Multilingual Support** - English and French
- 🔒 **Webhook Security** - Signature verification
- 📊 **Queue Monitoring** - BullMQ dashboard
- 🐳 **Docker Ready** - Production deployment

## Tech Stack

- **Framework**: NestJS v10 + TypeScript v5
- **HTTP Adapter**: Fastify
- **AI**: Anthropic Claude API
- **Database**: PostgreSQL + TypeORM
- **Cache/Session**: Redis + ioredis
- **Queue**: BullMQ
- **WhatsApp**: Meta Cloud API v18
- **Auth**: JWT + Passport

## Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Redis 7+
- WhatsApp Business Account
- Anthropic API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/curabot.git
   cd curabot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration:
   ```env
   PORT=3000
   NODE_ENV=development
   DATABASE_URL=postgresql://user:pass@localhost:5432/curabot
   REDIS_URL=redis://localhost:6379
   JWT_SECRET=your-super-secret-jwt-key
   WHATSAPP_PHONE_NUMBER_ID=your-phone-number-id
   WHATSAPP_ACCESS_TOKEN=your-permanent-access-token
   WHATSAPP_WEBHOOK_VERIFY_TOKEN=your-verify-token
   WHATSAPP_APP_SECRET=your-app-secret-for-signature
   ANTHROPIC_API_KEY=your-claude-api-key
   ```

4. **Database Setup**
   ```bash
   # Start PostgreSQL and Redis
   docker-compose up -d db redis

   # Run migrations
   npm run typeorm:migrate
   ```

5. **Development**
   ```bash
   npm run start:dev
   ```

## WhatsApp Setup

1. **Create WhatsApp Business Account**
   - Go to [Meta for Developers](https://developers.facebook.com/)
   - Create a Business App
   - Add WhatsApp product

2. **Configure Webhook**
   - Webhook URL: `https://your-domain.com/api/webhook`
   - Verify Token: Set in `.env`
   - Subscribe to `messages` field

3. **Get Access Token**
   - Generate permanent access token
   - Set in `.env`

## API Endpoints

### WhatsApp Webhook
- `GET /api/webhook` - Webhook verification
- `POST /api/webhook` - Message processing

### Admin Endpoints (JWT Protected)
- `POST /api/auth/login` - Admin authentication
- `GET /api/patients` - List patients
- `GET /api/doctors` - List doctors
- `GET /api/appointments` - List appointments

## Project Structure

```
src/
├── ai/                 # Claude AI integration
├── appointments/       # Appointment management
├── auth/              # JWT authentication
├── common/            # Shared utilities
├── config/            # Configuration
├── doctors/           # Doctor management
├── patients/          # Patient management
├── reminders/         # BullMQ queue processor
├── session/           # Redis session management
└── whatsapp/          # WhatsApp integration
```

## Development

### Scripts
```bash
npm run start:dev      # Development server
npm run build         # Production build
npm run test          # Run tests
npm run lint          # Code linting
npm run format        # Code formatting
```

### Code Quality
- **ESLint**: TypeScript recommended rules
- **Prettier**: Consistent code formatting
- **Husky**: Pre-commit hooks
- **Commitlint**: Conventional commits
- **CodeRabbit**: AI code review

### Testing
```bash
npm run test:cov      # Test with coverage
npm run test:e2e      # End-to-end tests
```

## Deployment

### Docker Deployment

1. **Build and run**
   ```bash
   docker-compose up -d
   ```

2. **Scale services**
   ```bash
   docker-compose up -d --scale app=3
   ```

### Environment Variables

See `.env.example` for all required variables.

### Health Checks

- Application: `GET /health`
- BullMQ Dashboard: `http://localhost:3001`

## Monitoring

### Queue Monitoring
Access BullMQ dashboard at `http://localhost:3001` to monitor:
- Active jobs
- Failed jobs
- Queue statistics

### Logs
Application logs are available via:
```bash
docker-compose logs -f app
```

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'feat: add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### Commit Convention
Follow [Conventional Commits](https://conventionalcommits.org/):
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Testing
- `chore:` Maintenance

## License

ISC License - see LICENSE file for details.

## Support

For support, email support@curabot.com or join our Slack community.

---

Built with ❤️ using NestJS