import { NFunction } from '../../functions';
import { IContext } from '../context';
import { ExpressionDelay, IEvent } from './event';

export type Transition<TC extends IContext, TE extends IEvent, A = TE> = {
  type: TE['type'];
  target?: string;
  actions?: NFunction<[TC, A], void>[];
  delay?: number | ExpressionDelay<TC, TE>;
  conditions?: NFunction<[TC, TE], boolean>[];
};
