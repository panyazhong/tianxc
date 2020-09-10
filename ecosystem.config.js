module.exports = {
  apps: [
    {
      name: 'tianxc',
      exec: './dist/index.js',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
