import { join } from 'node:path';

const config = [
  {
    schemaPath: 'https://lightfocus.baole.space/core/api/v1/docs-json',
    namespace: 'LF',
    projectName: 'lf',
    requestLibPath: 'import { request } from "../core"',
    templatesFolder: join(__dirname, '.', 'src', 'services', 'templates'),
    serversPath: './src/services',
  },
  {
    schemaPath: 'http://localhost:3001/api/docs-json',
    // schemaPath: 'https://lightfocus.baole.space/ai/api/v1/docs-json',
    namespace: 'LFAI',
    projectName: 'lfai',
    requestLibPath: 'import { request } from "../ai"',
    templatesFolder: join(__dirname, '.', 'src', 'services', 'templates'),
    serversPath: './src/services',
  },
];

export default config;
