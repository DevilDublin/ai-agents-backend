// config.js — color theme control
export const initTheme = () => {
  const toggle = document.getElementById('colorToggle');
  if (!toggle) return;
  let hue = 260;
  toggle.onclick = () => {
    hue = (hue + 60) % 360;
    const newColor = `hsl(${hue}, 100%, 70%)`;
    document.documentElement.style.setProperty('--accent', newColor);
    toggle.style.background = newColor;
  };
};
