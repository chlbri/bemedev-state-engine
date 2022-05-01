import { shallowCompare, ttest, UND } from '@bemedev/test';
import { send } from './send';

describe('Props', () => {
  ttest({
    func: send,
    tests: [
      {
        args: ['OK'],
        expected: {
          event: 'OK',
          delay: UND,
        },
      },
    ],
    compare: shallowCompare,
  });
});
describe('ID is always defined', () => {
  ttest({
    func: send,
    tests: [
      {
        args: ['OK'],
      },
    ],
    compare: a => !!a.id,
  });
});
