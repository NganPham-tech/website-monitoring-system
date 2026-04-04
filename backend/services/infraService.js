const os = require('os');
const User = require('../models/User');
const Monitor = require('../models/Monitor');
const PingNode = require('../models/PingNode');

// ─── Mock plan → MRR pricing table ────────────────────────────────────────────
const PLAN_MRR = {
    'Miễn phí - 5 Monitors': 0,
    'free': 0,
    'Cơ bản - 50 Monitors': 29,
    'pro': 29,
    'Nâng cao - 200 Monitors': 99,
    'enterprise': 199,
};

// ─── Default seed nodes ───────────────────────────────────────────────────────
const SEED_NODES = [
    { region: '🇺🇸 US East (N. Virginia)', status: 'online', cpuUsage: 32, avgLatency: 45, queueSize: 0 },
    { region: '🇸🇬 Asia (Singapore)', status: 'online', cpuUsage: 28, avgLatency: 72, queueSize: 2 },
    { region: '🇩🇪 EU (Frankfurt)', status: 'online', cpuUsage: 45, avgLatency: 38, queueSize: 0 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Snapshot CPU usage percentage across all cores using os.cpus().
 * This is a single-sample approximation.
 */
const getCpuUsagePercent = () => {
    const cpus = os.cpus();
    let totalIdle = 0;
    let totalTick = 0;
    for (const cpu of cpus) {
        for (const type of Object.keys(cpu.times)) {
            totalTick += cpu.times[type];
        }
        totalIdle += cpu.times.idle;
    }
    return Math.round((1 - totalIdle / totalTick) * 100);
};

/**
 * Add ±jitter to a number, clamp to [min, max].
 */
const jitter = (base, range, min = 0, max = 100) => {
    const val = base + (Math.random() * range * 2 - range);
    return Math.round(Math.max(min, Math.min(max, val)));
};

// ─── Exported service functions ───────────────────────────────────────────────

/**
 * Compute four macro-level KPI cards for the Infrastructure admin overview.
 */
exports.getMacroStats = async () => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    // ── Active users (proxy: updatedAt within 30d) ────────────────────────────
    const [activeCount, newTodayCount] = await Promise.all([
        User.countDocuments({ updatedAt: { $gte: thirtyDaysAgo } }),
        User.countDocuments({ createdAt: { $gte: todayStart } }),
    ]);

    // ── MRR: sum plan prices across all users ─────────────────────────────────
    const allUsers = await User.find({}, 'plan').lean();
    const currentMRR = allUsers.reduce((sum, u) => sum + (PLAN_MRR[u.plan] ?? 0), 0);
    // Project next month with a 14 % growth assumption for display
    const projectedMRR = Math.round(currentMRR * 1.14);

    // ── Active monitors ───────────────────────────────────────────────────────
    const [activeMonitors, reqPerSec] = await Promise.all([
        Monitor.countDocuments({ status: 'online' }),
        Monitor.countDocuments({ status: 'online' }), // same value, reused for req/s estimate
    ]);
    // Rough estimate: each online monitor fires ~0.2 pings/sec on average
    const requestsPerSecond = Math.round(reqPerSec * 0.2);

    // ── System load (core server) ─────────────────────────────────────────────
    const cpuPercent = getCpuUsagePercent();
    const totalRam = os.totalmem();
    const usedRam = totalRam - os.freemem();
    const usedRamGB = (usedRam / (1024 ** 3)).toFixed(1);
    const totalRamGB = (totalRam / (1024 ** 3)).toFixed(0);

    return {
        activeUsers: {
            value: activeCount.toLocaleString('en-US'),
            change: '+12.5%',        // would be calculated vs prev period in production
            direction: 'up',
            sub: `${newTodayCount} đăng ký mới hôm nay`,
        },
        mrr: {
            value: `$${currentMRR.toLocaleString('en-US')}`,
            change: '+8.2%',
            direction: 'up',
            sub: `Dự kiến tháng: $${projectedMRR.toLocaleString('en-US')}`,
        },
        monitors: {
            value: activeMonitors.toLocaleString('en-US'),
            change: '+5.1%',
            direction: 'up',
            sub: `~${requestsPerSecond.toLocaleString('en-US')} requests / giây`,
        },
        systemLoad: {
            value: `${cpuPercent}%`,
            change: 'Ổn định',
            direction: 'stable',
            sub: `RAM: ${usedRamGB}GB / ${totalRamGB}GB`,
        },
    };
};

/**
 * Return all Ping Worker nodes, seeding defaults on first run.
 * Applies a small random jitter to simulate live heartbeat data.
 */
exports.getNodes = async () => {
    // Auto-seed if the collection is empty (first boot)
    const existingCount = await PingNode.countDocuments();
    if (existingCount === 0) {
        await PingNode.insertMany(
            SEED_NODES.map((n) => ({ ...n, lastHeartbeat: new Date() }))
        );
    }

    const nodes = await PingNode.find().lean();

    // Simulate live metric fluctuations (would come from real heartbeats in prod)
    return nodes.map((node) => ({
        id: node._id.toString(),
        region: node.region,
        status: node.status,
        latency: jitter(node.avgLatency, 8, 10, 500),
        cpu: jitter(node.cpuUsage, 5, 0, 100),
        queue: jitter(node.queueSize, 2, 0, 50),
        lastHeartbeat: node.lastHeartbeat,
    }));
};

/**
 * Simulate a Scale-out: create a new PingNode in "deploying" status.
 * In reality this would trigger a cloud provisioning job (Terraform / K8s HPA).
 */
exports.deployNode = async (region) => {
    const node = await PingNode.create({
        region,
        status: 'deploying',
        cpuUsage: 0,
        avgLatency: 0,
        queueSize: 0,
        lastHeartbeat: null,
    });

    // Simulate the node coming online after ~30s (background side-effect, no await)
    setTimeout(async () => {
        try {
            await PingNode.findByIdAndUpdate(node._id, {
                status: 'online',
                cpuUsage: 25,
                avgLatency: 60,
                lastHeartbeat: new Date(),
            });
        } catch { /* best-effort */ }
    }, 30_000);

    return {
        nodeId: node._id.toString(),
        region,
        message: `Node mới đang được khởi tạo tại ${region}. Dự kiến online trong ~30 giây.`,
    };
};
