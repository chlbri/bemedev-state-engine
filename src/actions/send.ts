import { TARGETS } from '@/constants';
import {
  ExpressionEvent,
  IContext,
  IEvent,
  SendOptions,
  SimpleEvent,
} from '@/types';
import { nanoid } from 'nanoid';

export function send<
  TC extends IContext,
  TE extends IEvent,
  TSE extends IEvent = TE,
>(
  event: SimpleEvent<TE> | ExpressionEvent<TC, TE, TSE>,
  options?: SendOptions<TC, TE>,
) {
  return {
    to: options?.to ?? TARGETS.current,
    event,
    delay: options?.delay,
    id: options?.id ?? nanoid(),
  } as const;
}
