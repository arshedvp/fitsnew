// PM2 Ecosystem Configuration
// Use this file to manage your application with PM2
// Run: pm2 start ecosystem.config.js

module.exports = {
  apps: [{
    name: 'fitsnew',
    script: './dist/server/index.js',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 5000  // Your app defaults to 5000, but can be overridden with PORT env var
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    // Graceful shutdown
    kill_timeout: 5000,
    wait_ready: true,
    listen_timeout: 10000
  }]
};

