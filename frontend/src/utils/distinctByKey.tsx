export const distinctByKey = (array: Array<any>, key: string) => {
  const seen = new Set();

  return array.filter((item) => {
    const value = item[key];

    if (!seen.has(value)) {
      seen.add(value);
      return true;
    }

    return false;
  });
}