import { join } from 'node:path';

const config = [
  {
    schemaPath: 'https://lightfocus.baole.space/api/api/v1/docs-json',
    namespace: 'LF',
    projectName: 'lf',
    requestLibPath: 'import { request } from "../services"',
    templatesFolder: join(__dirname, '.', 'src', 'services', 'templates'),
    serversPath: './src/services',
  },
];

export default config;
