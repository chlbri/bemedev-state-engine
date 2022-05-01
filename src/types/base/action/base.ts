import { NFunction } from "../../functions";
import { IContext } from "../context";
import { IEvent } from "../event";

export type Action<
  TC extends IContext,
  TE extends IEvent,
  R = void,
> = NFunction<[TC, TE], R>;