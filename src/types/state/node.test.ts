import { StateNode } from './node';

describe('states', () => {
  const parentNode = new StateNode({}, 'parent');
  const childNode = new StateNode({}, 'child');
  beforeAll(() => {
    parentNode.addStates(childNode);
    parentNode.initialize();
  });
  test('Parent must have child nodes', () => {
    expect(parentNode.directStates).toBeArrayOfSize(1);
  });
  describe('The child must have parent', () => {
    test('The parent exists', () => {
      expect(childNode.hasParent).toBe(true);
    });
    test('The parent must be "parent"', () => {
      expect(childNode.parent).toBe('parent');
    });
  });
  test("The child value doesn't change", () => {
    expect(childNode.value).toBe('child');
  });
  describe('AllStates', () => {
    test('Number of states is "2"', () => {
      expect(parentNode.allStateNames).toBeArrayOfSize(2);
    });
    describe('Names', () => {
      test('The parent must be inserted', () => {
        const names = parentNode.allStateNames;
        expect(names).toIncludeAnyMembers(['parent']);
      });
      test('The child must be inserted', () => {
        const names = parentNode.allStateNames;
        expect(names).toIncludeAnyMembers(['child']);
      });
    });
    describe('Values', () => {
      beforeAll(() => {
        parentNode.type = 'parallel';
      });
      test('The parent must be inserted', () => {
        const names = parentNode.allStateValues;
        expect(names).toIncludeAnyMembers([{ child: {} }]);
      });
      test('The child must be inserted', () => {
        const names = parentNode.allStateValues;
        expect(names).toIncludeAnyMembers(['child']);
      });
    });
  });
});

describe('Tags', () => {
  const parentNode = new StateNode({}, 'parent');
  beforeAll(() => {
    parentNode.initialize();
    parentNode.addTags('tag1', 'tag2');
  });

  test('It must have "tag1"', () => {
    expect(parentNode.hasTag('tag1')).toBe(true);
  });
  test('It must have "tag2"', () => {
    expect(parentNode.hasTag('tag2')).toBe(true);
  });
});
