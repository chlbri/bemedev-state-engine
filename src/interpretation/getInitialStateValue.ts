import { capitalizeFirstLetter } from '@/helpers';
import { IContext, IEvent, StateNode, StateValue } from '@/types';

// #region Helpers
function checkInitial<TC extends IContext, TE extends IEvent>(
  node: StateNode<TC, TE, unknown>,
  inverse = false,
) {
  const name = node.name;
  const initial = node.initial;
  const type = capitalizeFirstLetter(node.type);
  if (inverse && initial) {
    throw `${type} state "${name}" don't need an initial state`;
  }
  if (!inverse && !initial) {
    throw `${type} state "${name}" must have an initial state`;
  }
}

function checkChildrenStates<TC extends IContext, TE extends IEvent>(
  node: StateNode<TC, TE, unknown>,
) {
  const name = node.name;
  const type = capitalizeFirstLetter(node.type);
  const len = node.directStates.length;

  if (len < 1) {
    throw `${type} state "${name}" must have at least one direct child state`;
  }
}

function childrenReducer<TC extends IContext, TE extends IEvent>(
  node: StateNode<TC, TE, unknown>,
) {
  const initial = node.initial;
  const name = node.name;
  const childrenStates = node.directStates;
  const initialState = childrenStates.find(st => st.name === initial);
  if (!initialState) {
    throw `State "${initial}" must exists`;
  }
  return { [name]: getInitialStateValue(initialState) };
}
// #endregion

export function getInitialStateValue<
  TC extends IContext,
  TE extends IEvent,
>(node: StateNode<TC, TE>): StateValue {
  const type = node.type;
  const name = node.name;

  switch (type) {
    case 'final':
    case 'atomic':
      return name;
    case 'compound': {
      checkInitial(node);
      checkChildrenStates(node);
      return childrenReducer(node);
    }
    case 'machine':
    case 'async': {
      const initial = node.initial;
      const len = node.directStates.length;
      if (!initial || len < 1) {
        return name;
      }
      return childrenReducer(node);
    }
    case 'parallel': {
      checkInitial(node, true);
      checkChildrenStates(node);
      const names: StateValue = node.directStates.reduce((acc, st) => {
        const name1 = st.name;
        const type1 = st.type;
        const checkAtomic = type1 === 'atomic';
        const value = checkAtomic ? {} : getInitialStateValue(st);
        return { ...acc, [name1]: value };
      }, {});

      return { [name]: names };
    }
    default:
      throw `Unsupported state type "${type}" for node${name}`;
  }
}
