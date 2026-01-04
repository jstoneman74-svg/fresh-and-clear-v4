import { PoolType, Environment } from '../agents/AgentTypes';

export interface SiteProfile {
  id: string;
  name: string;
  type: PoolType;
  gallons: number;
  env: Environment;
}

export const SITES: SiteProfile[] = [
  {
    id: 'windmill-pool',
    name: 'Windmill (Pool)',
    type: 'pool',
    gallons: 25000, 
    env: 'indoor'
  },
  {
    id: 'windmill-spa',
    name: 'Windmill (Spa)',
    type: 'spa',
    gallons: 2500, 
    env: 'indoor'
  },
  {
    id: 'warm-springs-pool',
    name: 'Warm Springs (Pool)',
    type: 'pool',
    gallons: 35000,
    env: 'indoor'
  }
];