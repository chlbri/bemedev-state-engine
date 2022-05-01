import { NExclude } from '../../object';
import { Transition_JSON } from './transition';

export type TransitionArray_JSON =
  | Transition_JSON
  | [...NExclude<Transition_JSON, string>[], Transition_JSON];
