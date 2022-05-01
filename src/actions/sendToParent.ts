import { TARGETS } from '@/constants';
import {
  ExpressionEvent,
  IContext,
  IEvent,
  NOmit,
  SendOptions,
  SimpleEvent,
} from '@/types';
import { send } from './send';

export function sendToParent<
  TC extends IContext,
  TE extends IEvent,
  TSE extends IEvent = TE,
>(
  event: SimpleEvent<TE> | ExpressionEvent<TC, TE, TSE>,
  options?: NOmit<SendOptions<TC, TE>, 'to'>,
) {
  return send(event, { ...options, to: TARGETS.parent });
}
