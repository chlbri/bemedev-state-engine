import { NFunction } from './functions';

export type IContext = object;

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

export type Action<
  TC extends IContext,
  TE extends IEvent,
  R = void,
> = NFunction<[TC, TE], R>;

export type StringOrNumber = string | number;

export type SimpleOrArray<T> = T | T[];

export type SendOptions<TC extends IContext, TE extends IEvent> = {
  id?: string;
  delay?: number | string | ExpressionDelay<TC, TE>;
  to?: string | ((context: TC, event: TE) => string);
};

export * from './object';
