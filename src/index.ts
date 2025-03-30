import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { servicesList } from './services-list';

// call all services within the project
const app = new Elysia()
  .use(servicesList)
  .use(swagger())
  .listen(3000);
