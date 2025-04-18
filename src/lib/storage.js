export const write = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const read = (key, _default) => {
  const str = localStorage.getItem(key);
  if (!str) {
    return _default;
  }
  return JSON.parse(str);
};
