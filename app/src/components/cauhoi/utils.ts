export const decodeCauHoi = (cauHoi: string): string[] => {
  return cauHoi.split(/(\$\[[\s\S]*?\])/);
};

export const isAnswerPlaceholder = (str: string) =>
  /^\$\[[\s\S]*?\]$/.test(str);

export const getIndexFromPlaceholder = (str: string) => {
  const arr = /^\$\[(.*)\]$/.exec(str);
  if (!arr) {
    return -1;
  }
  return parseInt(arr[1]);
};
