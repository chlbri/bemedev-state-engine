export type NOmit<T, K extends keyof T> = Omit<T, K>;
export type NExtract<T, K extends T> = Extract<T, K>;
export type NExclude<T, K extends T> = Exclude<T, K>;

export type StringOrNumber = string | number;

export type SimpleOrArray<T> = T | T[];

export type SAS = SimpleOrArray<string>;
