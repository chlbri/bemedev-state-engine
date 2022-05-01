import { NOmit } from '../../object';
import { Promise_JSON } from './promise';

export type Machine_JSON = NOmit<Promise_JSON, 'promise'> & {
  machine: string;
};
