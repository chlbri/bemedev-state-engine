import { SAS } from '../../object';

export type Transition_JSON =
  | {
      target: string;
      actions?: SAS;
      conditions?: SAS;
      delay?: string;
    }
  | string;
