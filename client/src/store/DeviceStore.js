import { makeAutoObservable } from 'mobx';

// Store for managing device data (placeholder)
class DeviceStore {
  // Observable: list of devices
  devices = [];
  // Observable: selected device
  selectedDevice = null;

  // Constructor: initializes observables
  constructor() {
    makeAutoObservable(this);
  }

  // Action: sets list of devices
  setDevices(devices) {
    this.devices = devices;
  }

  // Action: sets selected device
  setSelectedDevice(device) {
    this.selectedDevice = device;
  }
}

// Export singleton instance of DeviceStore
export const deviceStore = new DeviceStore();