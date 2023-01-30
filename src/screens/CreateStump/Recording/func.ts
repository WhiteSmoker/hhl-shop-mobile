import { Platform } from 'react-native';
import {
  getDeviceId,
  getFreeDiskStorage,
  getManufacturer,
  getReadableVersion,
  getUniqueId,
} from 'react-native-device-info';

export const getDevInfo = async () => {
  const free_space = await getFreeDiskStorage();
  const manufacturer = await getManufacturer();
  const model = getDeviceId();
  const uuid = await getUniqueId();
  const dev_details = {
    platform: Platform.OS,
    uuid,
    app_version: getReadableVersion(),
    free_space,
    manufacturer,
    model,
  };
  return { deviceInfo: JSON.stringify(dev_details) };
};
