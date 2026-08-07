import { DeviceValidationInfo } from '@real-estate-erp/types';

export function getDeviceId(): string {
  let deviceId = localStorage.getItem('erp_device_id');
  if (!deviceId) {
    deviceId = `dev_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
    localStorage.setItem('erp_device_id', deviceId);
  }
  return deviceId;
}

export function getDeviceInfo(): DeviceValidationInfo {
  const userAgent = navigator.userAgent;

  return {
    deviceId: getDeviceId(),
    userAgent,
    isTrusted: true,
    lastValidatedAt: new Date().toISOString(),
  };
}
