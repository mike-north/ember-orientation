import DeviceOrientationService from 'ember-orientation/services/device-orientation';
import config from '../config/environment';

export function initialize(_container, application) {
  const { orientationServiceDefaults } = config;
  const { injectionFactories } = orientationServiceDefaults;

  application.register('config:device-orientation', orientationServiceDefaults, { instantiate: false });
  application.register('service:device-orientation', DeviceOrientationService);
  application.inject('service:device-orientation', 'orientationServiceDefaults', 'config:device-orientation');

  injectionFactories.forEach(factory => {
    application.inject(factory, 'orientation', 'service:device-orientation');
  });
}

export default {
  name: 'device-orientation',
  initialize: initialize
};
