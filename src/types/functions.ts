export type NFunction<I extends unknown[] = unknown[], O = unknown> = (
  ...args: I
) => O;

export type PromiseFunction<
  I extends unknown[] = unknown[],
  O = unknown,
> = NFunction<I, Promise<O>>;
