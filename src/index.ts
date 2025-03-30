import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { servicesList } from './services-list';
import { cors } from '@elysiajs/cors';

// call all services within the project
const app = new Elysia()
  .use(servicesList)
  .use(swagger())
  .use(cors())
  .listen(3000);
