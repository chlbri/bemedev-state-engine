import { IContext, IEvent } from '../def';
import { Transition } from '../event';
import { PromiseFunction } from '../functions';

export type InvokeBase<TC extends IContext, TE extends IEvent, R = TC> = {
  src: PromiseFunction<[TC, TE], R>;
  id: string;
} & (
  | {
      then: Transition<TC, TE>;
      catch?: Transition<TC, TE>;
      finally?: Transition<TC, TE>;
    }
  | {
      then?: Transition<TC, TE>;
      catch?: Transition<TC, TE>;
      finally: Transition<TC, TE>;
    }
);
