export const Haptics = {
  success: () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(50);
  },
  warning: () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([100, 50, 100]);
  },
  danger: () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([400, 100, 400, 100, 400]);
  }
};