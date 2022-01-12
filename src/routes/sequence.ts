import { Application } from 'express';

import { createSequence } from '../controllers/sequence';

export default function routeConfig(app: Application) {
  app.post('/api/sequence', createSequence);
}
