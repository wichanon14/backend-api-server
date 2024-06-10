// generateSwaggerYaml.ts
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { openapiSpecification as specs } from '../modules/swagger/swagger.route';
import { logger } from './pino';

const outputPath = path.resolve(__dirname, 'swagger.yaml');
const yamlStr = yaml.dump(specs);

fs.writeFileSync(outputPath, yamlStr, 'utf8');

logger.info(`Swagger YAML file generated at ${outputPath}`);
