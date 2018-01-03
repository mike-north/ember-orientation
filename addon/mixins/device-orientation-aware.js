import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { getOwner } from '@ember/application';

function injectService(serviceName) {
  return computed(function() {
    return getOwner(this).lookup(`service:${serviceName}`);
  });
}

export default Mixin.create({
  _orientationService: injectService('device-orientation'),

  init() {
    this._super(...arguments);
    this.get('_orientationService').on('tilt', this, this.didTilt);
    this.get('_orientationService').on('debouncedTilt', this, this.debouncedDidTilt);
    this.get('_orientationService').on('deviceMove', this, this.didMove);
    this.get('_orientationService').on('debouncedDeviceMove', this, this.debouncedDidMove);
  },

  tiltAlpha: alias('_orientationService.alpha'),
  tiltBeta: alias('_orientationService.beta'),
  tiltGamma: alias('_orientationService.gamma'),

  didTilt(/* evt*/) {},
  debouncedDidTilt(/* evt*/) {},
  didMove(/* evt*/) {},
  debouncedDidMove(/* evt*/) {}
});
