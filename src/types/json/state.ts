import { StateNodeType } from '../base/state/node';
import {
  Machine_JSON,
  Promise_JSON,
  TransitionArray_JSON,
  TransitionDelayMap_JSON,
  TransitionMap_JSON,
} from './transition';

// #region Helpers
type SNT<T extends StateNodeType> = T;

type WithoutChildren = {
  initial?: never;
  states?: never;
};

type WithChildren<Tr extends string = string> = {
  initial: string;
  states: Record<string, StateJSON<Tr>>;
};
// #endregion

export type StateJSON_Base<Tr extends string = string> = {
  id?: string;
  entry?: TransitionArray_JSON;
  exit?: TransitionArray_JSON;
} & (
  | {
      on: TransitionMap_JSON<Tr>;
      always?: never;
      after?: TransitionDelayMap_JSON;
    }
  | {
      on?: never;
      always: TransitionArray_JSON;
    }
  | {
      on?: never;
      always?: never;
      after?: TransitionDelayMap_JSON;
    }
);

export type StateJSON_Atomic<Tr extends string = string> =
  StateJSON_Base<Tr> & {
    type: SNT<'atomic'>;
  } & WithoutChildren;

export type StateJSON_Compound<Tr extends string = string> =
  StateJSON_Base<Tr> & { type: SNT<'compound'> } & WithChildren<Tr>;

export type StateJSON_Parallel<Tr extends string = string> =
  StateJSON_Base<Tr> & {
    type: SNT<'parallel'>;
  } & WithChildren<Tr>;

export type StateJSON_Async<Tr extends string = string> =
  StateJSON_Base<Tr> & {
    type: SNT<'async'>;
  } & (WithChildren<Tr> | WithoutChildren) &
    Promise_JSON;

export type StateJSON_Machine<Tr extends string = string> =
  StateJSON_Base<Tr> & {
    type: SNT<'machine'>;
  } & (WithChildren<Tr> | WithoutChildren) &
    Machine_JSON;

export type StateJSON_Final<Tr extends string = string> =
  StateJSON_Base<Tr> & {
    type: SNT<'final'>;
    transform?: string;
  } & WithoutChildren;

export type StateJSON<Tr extends string = string> =
  | StateJSON_Atomic<Tr>
  | StateJSON_Compound<Tr>
  | StateJSON_Parallel<Tr>
  | StateJSON_Async<Tr>
  | StateJSON_Machine<Tr>
  | StateJSON_Final<Tr>;
