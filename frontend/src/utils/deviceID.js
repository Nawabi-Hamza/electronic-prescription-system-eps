export function getDeviceId() {
  const key = "client_device_id";
  let deviceId = localStorage.getItem(key);

  if (deviceId) return deviceId;

  deviceId = crypto.randomUUID?.() || ("device-" + Math.random().toString(36).substring(2) + Date.now());
  localStorage.setItem(key, deviceId);
  return deviceId;
}
