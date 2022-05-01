import { IContext } from '../context';

export type IEvent = {
  type: string;
};

export type SimpleEvent<T extends IEvent> = IEvent extends T
  ? T['type']
  : T;

export type ExpressionEvent<
  TC extends IContext,
  TE extends IEvent,
  TSE extends IEvent = TE,
> = (context: TC, event: TE) => TSE;


export type ExpressionDelay<TC extends IContext, TE extends IEvent> = (
  context: TC,
  event: TE,
) => number;