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
  },

  tiltAlpha: Ember.computed.alias('_orientationService.alpha'),
  tiltBeta: Ember.computed.alias('_orientationService.beta'),
  tiltGamma: Ember.computed.alias('_orientationService.gamma'),

  didTilt(/*evt*/) {}
});
