// Mock service layers BEFORE loading the app so no real DB / SSE side-effects happen
jest.mock('../backend/services/infraService');
jest.mock('../backend/services/logStreamService');

const request = require('supertest');
const jwt = require('jsonwebtoken');
const infraService = require('../backend/services/infraService');
const logStreamService = require('../backend/services/logStreamService');
const app = require('../backend/app');

const TEST_SECRET = 'your_jwt_secret';
const makeToken = (role = 'admin') =>
    jwt.sign({ id: 'admin_1', email: 'admin@example.com', role }, TEST_SECRET, { expiresIn: '1h' });

const MOCK_STATS = {
    activeUsers: 120, newUsersToday: 5,
    mrr: 2580, mrrProjected: 2941,
    activeMonitors: 47,
    cpuPercent: 34.5, totalRamGB: 16, usedRamGB: 9.2,
};

const MOCK_NODES = [
    { _id: 'n1', region: 'US-East', status: 'online', cpuUsage: 31, avgLatency: 45, queueSize: 12 },
    { _id: 'n2', region: 'SG', status: 'online', cpuUsage: 58, avgLatency: 78, queueSize: 7 },
];

beforeEach(() => jest.clearAllMocks());

describe('Infrastructure API', () => {
    describe('GET /api/infrastructure/macro-stats', () => {
        it('should return 401 without auth token', async () => {
            const res = await request(app).get('/api/infrastructure/macro-stats');

            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
        });

        it('should return 403 for non-admin users', async () => {
            const res = await request(app)
                .get('/api/infrastructure/macro-stats')
                .set('Authorization', `Bearer ${makeToken('user')}`);

            expect(res.status).toBe(403);
            expect(res.body.success).toBe(false);
        });

        it('should return 200 with macro stats for admin', async () => {
            infraService.getMacroStats.mockResolvedValue(MOCK_STATS);

            const res = await request(app)
                .get('/api/infrastructure/macro-stats')
                .set('Authorization', `Bearer ${makeToken('admin')}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('activeUsers');
            expect(res.body.data).toHaveProperty('mrr');
            expect(res.body.data).toHaveProperty('activeMonitors');
        });
    });

    describe('GET /api/infrastructure/nodes', () => {
        it('should return 401 without auth token', async () => {
            const res = await request(app).get('/api/infrastructure/nodes');

            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
        });

        it('should return 200 with array of nodes for admin', async () => {
            infraService.getNodes.mockResolvedValue(MOCK_NODES);

            const res = await request(app)
                .get('/api/infrastructure/nodes')
                .set('Authorization', `Bearer ${makeToken()}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data).toHaveLength(2);
        });
    });

    describe('POST /api/infrastructure/nodes/deploy', () => {
        it('should return 400 when region is missing', async () => {
            const res = await request(app)
                .post('/api/infrastructure/nodes/deploy')
                .set('Authorization', `Bearer ${makeToken()}`)
                .send({});

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it('should return 403 for non-admin users', async () => {
            const res = await request(app)
                .post('/api/infrastructure/nodes/deploy')
                .set('Authorization', `Bearer ${makeToken('user')}`)
                .send({ region: 'EU-West' });

            expect(res.status).toBe(403);
            expect(res.body.success).toBe(false);
        });

        it('should return 202 when region is provided', async () => {
            infraService.deployNode.mockResolvedValue({
                nodeId: 'node_new',
                region: 'EU-West',
                message: 'Node đang được khởi tạo',
            });

            const res = await request(app)
                .post('/api/infrastructure/nodes/deploy')
                .set('Authorization', `Bearer ${makeToken()}`)
                .send({ region: 'EU-West' });

            expect(res.status).toBe(202);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('nodeId');
        });
    });

    describe('GET /api/infrastructure/logs/stream', () => {
        it('should return 401 when token query param is missing', async () => {
            const res = await request(app).get('/api/infrastructure/logs/stream');

            expect(res.status).toBe(401);
        });

        it('should return 401 when token is invalid', async () => {
            const res = await request(app)
                .get('/api/infrastructure/logs/stream?token=this.is.invalid');

            expect(res.status).toBe(401);
        });

        it('should return 403 for non-admin token', async () => {
            const res = await request(app)
                .get(`/api/infrastructure/logs/stream?token=${makeToken('user')}`);

            expect(res.status).toBe(403);
        });

        it('should return 200 text/event-stream for valid admin token', async () => {
            // Mock addClient to immediately close the SSE response so supertest can read it
            logStreamService.addClient.mockImplementation((res) => res.end());
            logStreamService.removeClient.mockImplementation(() => { });

            const res = await request(app)
                .get(`/api/infrastructure/logs/stream?token=${makeToken('admin')}`);

            expect(res.status).toBe(200);
            expect(res.headers['content-type']).toMatch(/text\/event-stream/);
        });
    });
});
