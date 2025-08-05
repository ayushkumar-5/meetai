import { meetings } from '@/db/schema';
import {  createTRPCRouter } from '../init';
import { agentsRouter } from '@/modules/agents/server/procedure';
import { meetingsRouter } from '@/modules/meetings/server/procedures';
export const appRouter = createTRPCRouter({
  agents: agentsRouter,
  meetings: meetingsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;