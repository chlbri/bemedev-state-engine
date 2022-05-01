import { IContext } from '../context';
import { ExpressionDelay, IEvent } from '../event';

export type SendOptions<TC extends IContext, TE extends IEvent> = {
  id?: string;
  delay?: number | string | ExpressionDelay<TC, TE>;
  to?: string | ((context: TC, event: TE) => string);
};
