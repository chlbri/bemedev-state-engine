import { TransitionArray_JSON } from './array';

export type TransitionDelayMap_JSON<
  T extends string | number = string | number,
> = {
  [key in T]?: TransitionArray_JSON;
};

export type TransitionMap_JSON<T extends string = string> =
  TransitionDelayMap_JSON<T>;
