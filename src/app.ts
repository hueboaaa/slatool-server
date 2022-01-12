import Server from './config/lib/server';

export function start() {
  const app = new Server();

  app.start();
}
