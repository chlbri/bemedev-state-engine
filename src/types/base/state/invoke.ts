import { PromiseFunction } from '../../functions';
import { IContext } from '../context';
import { IEvent, Transition } from '../event';

export type PromiseBase<TC extends IContext, TE extends IEvent, R = TC> = {
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
