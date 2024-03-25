import { KubernetesObject } from '@kubernetes/client-node';

const overrideFn = (
  baseValue: NonNullable<unknown>,
  overrideValue: NonNullable<unknown>,
  key: string,
) => {
  if (!baseValue[key]) {
    return overrideValue[key];
  }

  if (
    typeof baseValue[key] == 'object' &&
    typeof overrideValue[key] == 'object'
  ) {
    return {
      ...baseValue[key],
      ...mergeK8sObject(baseValue[key], overrideValue[key]),
    };
  }

  if (Array.isArray(baseValue[key]) && Array.isArray(overrideValue[key])) {
    return [...baseValue[key], ...overrideValue[key]];
  }

  if (typeof baseValue[key] != typeof overrideValue[key]) {
    return baseValue[key];
  }
};
export const mergeK8sObject = (
  base: NonNullable<unknown>,
  override: NonNullable<unknown>,
): KubernetesObject => {
  let tmp = base;

  Object.keys(override).map((key) => {
    if (override[key]) {
      tmp = { ...tmp, [key]: overrideFn(base, override, key) };
    }
  });

  return tmp;
};
