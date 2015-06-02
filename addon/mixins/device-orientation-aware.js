import Ember from 'ember';

function injectService(serviceName) {
  return Ember.computed({
    get() {
      return this.container.lookup(`service:${serviceName}`);
    }
  });
}

export default Ember.Mixin.create({
  _orientationService: injectService('device-orientation'),

  init() {
    this._super(...arguments);
    this.get('_orientationService').on('tilt', this, this.didTilt);
    this.get('_orientationService').on('debouncedTilt', this, this.debouncedDidTilt);
    this.get('_orientationService').on('deviceMove', this, this.didMove);
    this.get('_orientationService').on('debouncedDeviceMove', this, this.debouncedDidMove);
  },

  tiltAlpha: Ember.computed.alias('_orientationService.alpha'),
  tiltBeta: Ember.computed.alias('_orientationService.beta'),
  tiltGamma: Ember.computed.alias('_orientationService.gamma'),

  didTilt(/*evt*/) {},
  debouncedDidTilt(/*evt*/) {},
  didMove(/*evt*/) {},
  debouncedDidMove(/*evt*/) {}
});
