import { Action } from '../action';
import { IContext } from '../context';
import { IEvent, Transition } from '../event';
import { PromiseBase } from './invoke';
import { StateValue } from './types';

export type StateNodeType =
  | 'atomic'
  | 'machine'
  | 'compound'
  | 'parallel'
  | 'async'
  | 'final';

export class StateNode<
  TC extends IContext = IContext,
  TE extends IEvent = IEvent,
  R = unknown,
> {
  type: StateNodeType = 'atomic';
  promise?: PromiseBase<TC, TE, R>;
  subMachine?: StateNode;
  readonly directStates: StateNode<TC, TE>[] = [];
  readonly transitions: Transition<TC, TE>[] = [];
  readonly tags: string[] = [];
  readonly entryActions: Action<TC, TE>[] = [];
  readonly exitActions: Action<TC, TE>[] = [];
  private _parent?: string;
  initial?: string;

  get parent() {
    return this._parent;
  }

  readonly addStates = (...states: StateNode<TC, TE>[]) => {
    this.directStates.push(...states);
  };

  readonly clearStates = () => {
    this.directStates.length = 0;
  };

  private computeChildrenStates() {
    this.directStates.forEach(state => {
      state._parent = this._name;
    });
  }

  private _initialize() {
    this.computeChildrenStates();
    this.directStates.forEach(state => state._initialize());
  }

  initialize() {
    this._initialize();
  }

  readonly addTags = (...tags: string[]) => {
    this.tags.push(...tags);
  };

  readonly addEntryActions = (...actions: Action<TC, TE>[]) => {
    this.entryActions.push(...actions);
  };

  readonly addExitActions = (...actions: Action<TC, TE>[]) => {
    this.exitActions.push(...actions);
  };

  readonly addTransitions = (...transitions: Transition<TC, TE>[]) => {
    this.transitions.push(...transitions);
  };

  get hasChildrenStates() {
    return this.directStates.length > 0;
  }

  get hasParent() {
    return !!this.parent;
  }

  get hasDirectTransitions() {
    return this.transitions.length > 0;
  }

  get allStates(): StateNode<TC, TE>[] {
    return StateNode.getRecursiveChildrenStates(this);
  }

  get allStateNames(): string[] {
    return this.allStates.map(state => state.name);
  }

  get allStateValues(): StateValue[] {
    return this.allStates.map(state => state.value);
  }

  private static computeValue<
    TC extends IContext = IContext,
    TE extends IEvent = IEvent,
  >(state: StateNode<TC, TE>, parentIsParallel = false): StateValue {
    if (state.type !== 'parallel') {
      if (parentIsParallel) {
        return {};
      }
      return state._name;
    } else {
      if (!state.hasChildrenStates) {
        throw 'Parallel state must have children states';
      }
      return state.directStates.reduce((acc, current) => {
        acc[current._name] = StateNode.computeValue(current, true);
        return acc;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }, {} as Record<string, unknown>);
    }
  }

  private static getRecursiveChildrenStates<
    TC extends IContext = IContext,
    TE extends IEvent = IEvent,
  >(state: StateNode<TC, TE>) {
    const out = [state];
    const childrenStates = state.directStates;
    if (childrenStates.length === 0) {
      return out;
    }
    childrenStates.forEach(curr =>
      out.push(...StateNode.getRecursiveChildrenStates(curr)),
    );
    return out;
  }

  get value(): StateValue {
    return StateNode.computeValue(this as unknown as StateNode);
  }

  readonly hasTag = (tag: string) => this.tags.includes(tag);

  get name() {
    return this._name;
  }

  constructor(public _context: TC, private _name: string) {}
}
