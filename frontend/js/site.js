// site.js — main initializer
import { initBackground } from './bg.js';
import { initTheme } from './config.js';
import { initDemos } from './demos.js';
import { initVoice } from './voice.js';

window.addEventListener('DOMContentLoaded', () => {
  initBackground();
  initTheme();
  initDemos();
  initVoice();
});
