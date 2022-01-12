import { Application } from 'express';

import { renderIndex } from '../controllers/core';

export default function routeConfig(app: Application) {
  app.get('/', renderIndex);
}
