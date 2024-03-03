export type GetSetStateType<T> = (value: T | ((prevValue: T) => T)) => void;
