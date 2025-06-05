type OptionValue = {
  name: string;
  value: string;
};

type Variant = {
  optionValues: OptionValue[];
};

type OptionsMap = Record<string, string[]>;

export const getAvailableOptions = (variants: Variant[]): OptionsMap => {
  const optionsMap: Record<string, Set<string>> = {};

  for (const variant of variants) {
    for (const { name, value } of variant.optionValues) {
      if (!optionsMap[name]) optionsMap[name] = new Set();
      optionsMap[name].add(value);
    }
  }

  const result: OptionsMap = {};
  for (const key in optionsMap) {
    result[key] = Array.from(optionsMap[key]);
  }

  return result;
};
