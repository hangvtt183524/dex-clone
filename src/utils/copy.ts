export const copyToClipboardWithCommand = (content: string) => {
  const el = document.createElement('textarea');
  el.value = content;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};

export const copyContent = (content: string, callback?: () => void) => {
  const isCallback = typeof callback === 'function';

  if (navigator.clipboard && navigator.permissions) {
    navigator.clipboard.writeText(content).then(() => isCallback && callback());
  } else if (document.queryCommandSupported('copy')) {
    copyToClipboardWithCommand(content);
    if (isCallback) callback();
  }
};
