import { IContext } from '../def';

export type State<TC extends IContext> = {
  context: TC;
  value: string;
  tags?: string[];
};
