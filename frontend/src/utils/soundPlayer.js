// utils/soundPlayer.js
const sounds = {
  success: new Audio("/sounds/success.wav"),
  error: new Audio("/sounds/error.wav"),
  info: new Audio("/sounds/info.wav"),
  default: new Audio("/sounds/login.wav"),
};

export function playSound(type) {
  if (!sounds[type]) return;
  sounds[type].currentTime = 0; // reset to start
  sounds[type].play().catch(err => console.error("Sound play error:", err));
}
