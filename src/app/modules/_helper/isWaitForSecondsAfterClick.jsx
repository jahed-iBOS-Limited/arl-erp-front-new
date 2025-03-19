let lastClickTime = 0;

export function isWaitForSecondsAfterClick(duration = 5000) {
  const now = Date.now();
  const elapsed = now - lastClickTime;
  lastClickTime = now;
  return elapsed < duration;
}
