// Lightweight ioredis mock for Jest tests.
// Prevents real TCP connections so workers exit cleanly (no ECONNREFUSED loops).

const EventEmitter = require('events');

class RedisMock extends EventEmitter {
    constructor() {
        super();
        // Simulate lazy connection resolution so any `.on('connect')` handler fires
        process.nextTick(() => this.emit('connect'));
    }

    // Stub the most commonly called ioredis methods
    get() { return Promise.resolve(null); }
    set() { return Promise.resolve('OK'); }
    del() { return Promise.resolve(0); }
    incr() { return Promise.resolve(0); }
    expire() { return Promise.resolve(1); }
    ttl() { return Promise.resolve(-1); }
    hget() { return Promise.resolve(null); }
    hset() { return Promise.resolve(0); }
    hgetall() { return Promise.resolve({}); }
    lrange() { return Promise.resolve([]); }
    lpush() { return Promise.resolve(0); }
    rpush() { return Promise.resolve(0); }
    pipeline() { return { exec: () => Promise.resolve([]) }; }
    quit() { return Promise.resolve('OK'); }
    disconnect() { }
}

module.exports = RedisMock;
