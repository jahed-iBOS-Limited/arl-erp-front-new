export const _currentTime = () => {
  const today = new Date();
  const h = today.getHours();
  const m = today.getMinutes();
  const s = today.getSeconds();
  return h + ":" + m + ":" + s;
};
