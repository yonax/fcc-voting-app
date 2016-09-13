const NODE_ENV = process.env.NODE_ENV || 'development';
const errors = [];

function getEnvOrDefault(name, defaultValue) {
  if (typeof defaultValue === 'undefined') {
    errors.push(`Provide ${name} env or some default value`);
    return;
  }
  return process.env[name] || defaultValue;
}

function getEnv(name, defaultValue=undefined) {
  if (NODE_ENV === 'production') {
    defaultValue = undefined;
  }
  const value = process.env[name] || defaultValue;
  if (!value) {
    errors.push(`${name} must be present`);
    return;
  }
  return value;
}

const config = {
  NODE_ENV,
  port: getEnvOrDefault('PORT', 5000),
  databaseUrl: getEnv('DATABASE_URL'),
  jwtSecret: getEnv('JWT_SECRET', 'bla-bla-bla'),
  jwtExpires: getEnvOrDefault('JWT_EXPIRES', 3600)
};

if (errors.length > 0) {
  errors.forEach(error => console.error(error));
  process.exit(1);
} else {
  module.exports = config;
}
