// Mock the service layer BEFORE loading the app so no real DB calls happen
jest.mock('../backend/services/authService');

// Bypass rate limiters so tests don't get 429 Too Many Requests
jest.mock('../backend/middlewares/rateLimiter', () => ({
    rateLimitRegister: (req, res, next) => next(),
    rateLimitLogin: (req, res, next) => next(),
    rateLimitMonitorList: (req, res, next) => next(),
    rateLimitStatusPage: (req, res, next) => next(),
    rateLimitStatusSubscribe: (req, res, next) => next(),
}));

const request = require('supertest');
const authService = require('../backend/services/authService');
const app = require('../backend/app');

const MOCK_USER = { id: 'user_1', email: 'test@example.com', name: 'Test User', role: 'user' };

beforeEach(() => jest.clearAllMocks());

describe('Auth API', () => {
    describe('POST /api/auth/register', () => {
        it('should register a new user with valid data', async () => {
            authService.registerUser.mockResolvedValue({ user: MOCK_USER, token: 'mock_token' });

            const res = await request(app)
                .post('/api/auth/register')
                .send({ name: 'Test User', email: 'test@example.com', password: 'Password1!' });

            expect(res.status).toBe(999); // INTENTIONAL FAIL — ci demo
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('token');
        });

        it('should return 400 when email is missing', async () => {
            authService.registerUser.mockRejectedValue(
                Object.assign(new Error('Email là bắt buộc'), { statusCode: 400 })
            );

            const res = await request(app)
                .post('/api/auth/register')
                .send({ name: 'Test', password: 'Password1!' });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it('should return 400 when password is too short', async () => {
            authService.registerUser.mockRejectedValue(
                Object.assign(new Error('Mật khẩu quá ngắn'), { statusCode: 400 })
            );

            const res = await request(app)
                .post('/api/auth/register')
                .send({ name: 'Test', email: 'test@example.com', password: '123' });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it('should return 409 when email already exists', async () => {
            authService.registerUser.mockRejectedValue(
                Object.assign(new Error('Email đã được sử dụng'), { statusCode: 409 })
            );

            const res = await request(app)
                .post('/api/auth/register')
                .send({ name: 'Test', email: 'existing@example.com', password: 'Password1!' });

            expect(res.status).toBe(409);
            expect(res.body.success).toBe(false);
        });
    });

    describe('POST /api/auth/login', () => {
        it('should return 200 and token with valid credentials', async () => {
            authService.loginTraditional.mockResolvedValue({ user: MOCK_USER, token: 'mock_token' });

            const res = await request(app)
                .post('/api/auth/login')
                .send({ email: 'test@example.com', password: 'Password1!' });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('token');
        });

        it('should return 401 with wrong password', async () => {
            authService.loginTraditional.mockRejectedValue(
                Object.assign(new Error('Sai mật khẩu'), { statusCode: 401 })
            );

            const res = await request(app)
                .post('/api/auth/login')
                .send({ email: 'test@example.com', password: 'wrongpass' });

            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
        });

        it('should return 400 when body is empty', async () => {
            authService.loginTraditional.mockRejectedValue(
                Object.assign(new Error('Thiếu thông tin đăng nhập'), { statusCode: 400 })
            );

            const res = await request(app)
                .post('/api/auth/login')
                .send({});

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });

    describe('POST /api/auth/logout', () => {
        it('should clear auth cookie and return 200', async () => {
            const res = await request(app).post('/api/auth/logout');

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });
    });
});
