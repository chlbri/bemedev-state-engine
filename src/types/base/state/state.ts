import { isString } from '@/helpers';
import { IContext } from '@/types';
import { StateNodeType } from './node';
import { StateValue } from './types';

export class State<TC extends IContext> {
  readonly tags: string[] = [];

  constructor(
    public readonly context: TC,
    public readonly value: StateValue,
    private readonly type: StateNodeType,
    ...tags: string[]
  ) {
    this.tags.push(...tags);
  }

  get #reduceValues(): string[] {
    //TODO : Reduce the value to string
    return [];
  }

  readonly matches = (match: StateValue) => {
    const isStringMatch = isString(match);
    const type = this.type;
    //TODO Matches to state value
    if (isStringMatch) {
      const reducedValueStrings = this.#reduceValues;
      //TODO: Matches string, return
    }
    //TODO: Matches StateValue, generally for Parallel state, return
  };
}
