import env from 'react-native-config';

const config = {
  api: {
    version: env.VERSION,
    host_dev: env.API_HOST_DEVELOPMENT,
    host_prod: env.API_HOST_PRODUCTION,
    production: env.IS_PRODUCTION,
    stripKey: env.STRIPE_KEY,
    stripePublic: env.STRIPE_PUBLISH,
    timeout: 20000,
  },
};

const API_HOST = config.api.production
  ? config.api.host_prod
  : config.api.host_dev;
const VERSION = config.api.version;
export {API_HOST, VERSION};

export default config;
