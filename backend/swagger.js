import swaggerUi from 'swagger-ui-express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';

const docsPath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'docs', 'openapi.yaml');
const swaggerSpec = YAML.parse(fs.readFileSync(docsPath, 'utf8'));
export const registerSwagger = (app, port = 3000) => {
  swaggerSpec.servers = [
    {
      url: `http://localhost:${port}`,
      description: 'Local development server'
    }
  ];

  app.get('/api-docs/openapi.json', (req, res) => {
    res.json(swaggerSpec);
  });
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default swaggerSpec;