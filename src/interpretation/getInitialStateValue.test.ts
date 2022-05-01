import { StateNode } from '@/types';
import { ttest } from '@bemedev/test';
import { getInitialStateValue } from './getInitialStateValue';

const func = (node: StateNode) => getInitialStateValue(node);

const parentNode1 = new StateNode({}, 'parentNode1');
const parentNode2 = new StateNode({}, 'parentNode2');
const parentNode3 = new StateNode({}, 'parentNode3');
const childNode1 = new StateNode({}, 'childNode1');
const childNode2 = new StateNode({}, 'childNode2');

function withChildren(noInitial = false) {
  beforeAll(() => {
    parentNode1.addStates(childNode1);

    parentNode2.addStates(childNode2);

    parentNode3.addStates(childNode1);
    parentNode3.addStates(childNode2);

    if (!noInitial) {
      parentNode1.initial = 'childNode1';
      parentNode2.initial = 'childNode2';
      parentNode3.initial = 'childNode1';
    }
  });

  afterAll(() => {
    [parentNode1, parentNode2, parentNode3].forEach(node => {
      node.initial = undefined;
      node.clearStates();
    });
  });
}

describe('Atomic', () => {
  ttest({
    func,
    tests: [
      { invite: '#1', args: parentNode1, expected: 'parentNode1' },
      { invite: '#2', args: parentNode2, expected: 'parentNode2' },
      { invite: '#3', args: childNode1, expected: 'childNode1' },
      {
        invite: '#4',
        args: childNode2,
        expected: 'childNode2',
      },
    ],
  });
});

describe('Final', () => {
  beforeAll(() => {
    [parentNode1, parentNode2, parentNode3].forEach(node => {
      node.type = 'final';
    });
  });
  ttest({
    func,
    tests: [
      { invite: '#1', args: parentNode1, expected: 'parentNode1' },
      { invite: '#2', args: parentNode2, expected: 'parentNode2' },
      { invite: '#3', args: parentNode3, expected: 'parentNode3' },
    ],
  });
});

describe('Compound', () => {
  beforeAll(() => {
    [parentNode1, parentNode2, parentNode3].forEach(node => {
      node.type = 'compound';
    });
  });

  withChildren();

  ttest({
    func,
    tests: [
      {
        invite: '#1',
        args: parentNode1,
        expected: { parentNode1: 'childNode1' },
      },
      {
        invite: '#2',
        args: parentNode2,
        expected: { parentNode2: 'childNode2' },
      },
      {
        invite: '#3',
        args: parentNode3,
        expected: { parentNode3: 'childNode1' },
      },
    ],
  });
});

describe('Async', () => {
  beforeAll(() => {
    [parentNode1, parentNode2, parentNode3].forEach(node => {
      node.type = 'async';
    });
  });

  describe('With Children', () => {
    withChildren();

    ttest({
      func,
      tests: [
        {
          invite: '#1',
          args: parentNode1,
          expected: { parentNode1: 'childNode1' },
        },
        {
          invite: '#2',
          args: parentNode2,
          expected: { parentNode2: 'childNode2' },
        },
        {
          invite: '#3',
          args: parentNode3,
          expected: { parentNode3: 'childNode1' },
        },
      ],
    });
  });

  describe('Without children', () => {
    ttest({
      func,
      tests: [
        { invite: '#1', args: parentNode1, expected: 'parentNode1' },
        { invite: '#2', args: parentNode2, expected: 'parentNode2' },
        { invite: '#3', args: parentNode3, expected: 'parentNode3' },
      ],
    });
  });
});

describe('Machine', () => {
  beforeAll(() => {
    [parentNode1, parentNode2, parentNode3].forEach(node => {
      node.type = 'machine';
    });
  });

  describe('With Children', () => {
    withChildren();

    ttest({
      func,
      tests: [
        {
          invite: '#1',
          args: parentNode1,
          expected: { parentNode1: 'childNode1' },
        },
        {
          invite: '#2',
          args: parentNode2,
          expected: { parentNode2: 'childNode2' },
        },
        {
          invite: '#3',
          args: parentNode3,
          expected: { parentNode3: 'childNode1' },
        },
      ],
    });
  });

  describe('Without children', () => {
    ttest({
      func,
      tests: [
        {
          invite: '#1',
          args: parentNode1,
          expected: 'parentNode1',
        },
        {
          invite: '#2',
          args: parentNode2,
          expected: 'parentNode2',
        },
        {
          invite: '#3',
          args: parentNode3,
          expected: 'parentNode3',
        },
      ],
    });
  });
});

describe('Parallel', () => {
  beforeAll(() => {
    [parentNode1, parentNode2, parentNode3].forEach(node => {
      node.type = 'parallel';
    });
  });

  withChildren(true);

  ttest({
    func,
    tests: [
      {
        invite: '#1',
        args: parentNode1,
        expected: { parentNode1: { childNode1: {} } },
      },
      {
        invite: '#2',
        args: parentNode2,
        expected: { parentNode2: { childNode2: {} } },
      },
      {
        invite: '#3',
        args: parentNode3,
        expected: { parentNode3: { childNode1: {}, childNode2: {} } },
      },
    ],
  });
});
