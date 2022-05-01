import { TransitionArray_JSON } from './array';

export type Promise_JSON = {
  promise: string;
} & (
  | {
      then?: TransitionArray_JSON;
      catch?: TransitionArray_JSON;
      finally: TransitionArray_JSON;
    }
  | {
      then: TransitionArray_JSON;
      catch?: TransitionArray_JSON;
      finally?: TransitionArray_JSON;
    }
);
