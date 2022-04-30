import { IContext, IEvent } from '../def';
import { NFunction } from '../functions';

export type Transition<TC extends IContext, TE extends IEvent, A = TE> = {
  type: TE['type'];
  target?: string;
  actions?: NFunction<[TC, A], void>;
  delay?: number;
};
