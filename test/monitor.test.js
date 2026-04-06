// Mock the service layer BEFORE loading the app so no real DB calls happen
jest.mock('../backend/services/monitorService');

// Bypass rate limiters so tests don't get 429 Too Many Requests
jest.mock('../backend/middlewares/rateLimiter', () => ({
    rateLimitRegister: (req, res, next) => next(),
    rateLimitLogin: (req, res, next) => next(),
    rateLimitMonitorList: (req, res, next) => next(),
    rateLimitStatusPage: (req, res, next) => next(),
    rateLimitStatusSubscribe: (req, res, next) => next(),
}));

const request = require('supertest');
const jwt = require('jsonwebtoken');
const monitorService = require('../backend/services/monitorService');
const app = require('../backend/app');

const TEST_SECRET = 'your_jwt_secret';
const makeToken = (role = 'user') =>
    jwt.sign({ id: 'user_1', email: 'test@example.com', role }, TEST_SECRET, { expiresIn: '1h' });

// Valid payload that satisfies createMonitorSchema
const VALID_MONITOR_BODY = {
    name: 'My Monitor',
    url: 'https://example.com',
    protocol: 'https',
    interval: '1m',
    timeout: 30000,
    retries: 3,
    httpMethod: 'GET',
    locations: ['us-east'],
    alertTriggers: { isDown: true, slowResponse: false, sslExpiry: false },
    alertChannels: ['email'],
};

const MOCK_MONITOR = {
    _id: 'mon_1',
    ...VALID_MONITOR_BODY,
    userId: 'user_1',
    status: 'pending',
};

beforeEach(() => jest.clearAllMocks());

describe('Monitor API', () => {
    describe('GET /api/monitors', () => {
        it('should return 401 when no token provided', async () => {
            const res = await request(app).get('/api/monitors');

            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
        });

        it('should return 200 with list of monitors for authenticated user', async () => {
            monitorService.getMonitors.mockResolvedValue({
                monitors: [MOCK_MONITOR],
                pagination: { total: 1, page: 1, limit: 12, pages: 1 },
            });

            const res = await request(app)
                .get('/api/monitors?page=1&limit=12')
                .set('Authorization', `Bearer ${makeToken()}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    describe('POST /api/monitors', () => {
        it('should return 401 when not authenticated', async () => {
            const res = await request(app)
                .post('/api/monitors')
                .send(VALID_MONITOR_BODY);

            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
        });

        it('should return 201 when monitor created with valid data', async () => {
            monitorService.createMonitor.mockResolvedValue(MOCK_MONITOR);

            const res = await request(app)
                .post('/api/monitors')
                .set('Authorization', `Bearer ${makeToken()}`)
                .send(VALID_MONITOR_BODY);

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('_id');
        });

        it('should return 400 when URL is missing', async () => {
            const res = await request(app)
                .post('/api/monitors')
                .set('Authorization', `Bearer ${makeToken()}`)
                .send({ name: 'My Monitor', protocol: 'https' });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it('should return 400 when name is missing', async () => {
            const res = await request(app)
                .post('/api/monitors')
                .set('Authorization', `Bearer ${makeToken()}`)
                .send({ url: 'https://example.com', protocol: 'https' });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });
});
