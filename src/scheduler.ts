import { START_EVENT } from './constants';
import { Action, IEvent } from './types/def';

export class ActionScheduler<TC extends object, TE extends IEvent> {
  private _processing = false;
  private _queue: Array<Action<TC, TE>> = [];
  private _initialized = false;
  private _currentEvent = START_EVENT as TE;

  constructor(private context: TC, task?: Action<TC, TE>) {
    this.initialize(task);
  }

  set currentEvent(event: TE) {
    this._currentEvent = event;
  }

  readonly initialize = (task?: Action<TC, TE>) => {
    this._initialized = true;

    if (task) {
      this.schedule(task);
    }

    this._flushEvents();
  };

  readonly schedule = (task: Action<TC, TE>) => {
    if (!this._initialized || this._processing) {
      this._queue.push(task);
      return;
    }

    if (this._queue.length !== 0) {
      throw new Error(
        'Event queue should be empty when it is not processing events',
      );
    }

    this._process(task);
    this._flushEvents();
  };

  readonly clear = () => {
    this._queue = [];
  };

  private _flushEvents() {
    let nextCallback: Action<TC, TE> | undefined = this._queue.shift();
    while (nextCallback) {
      this._process(nextCallback);
      nextCallback = this._queue.shift();
    }
  }

  private _process(task: Action<TC, TE>) {
    this._processing = true;
    const event = { ...this._currentEvent } as TE;
    try {
      task(this.context, event);
    } catch (e) {
      this.clear();
      throw e;
    } finally {
      this._processing = false;
    }
  }
}
