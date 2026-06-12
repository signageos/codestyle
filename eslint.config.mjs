import { defineConfig } from 'eslint/config';
import baseConfig from './eslint.config.public.mjs';

/* 
  WARNING:
  This is not the config, which gets published in the package, it is replaced in the build step before publish (with eslint.config.public.mjs)
  This is to allow project specific settings without a breaking change
*/
// TODO: export eslint.config.base.mjs instead in the next major release

export default defineConfig([baseConfig]);
