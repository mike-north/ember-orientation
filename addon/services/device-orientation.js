import Ember from 'ember';

const { classify } = Ember.String;
const { map } = Ember.EnumerableUtils;

export default Ember.Service.extend(Ember.Evented, {

  _tilt: Ember.Object.create({
    alpha: null,
    beta: null,
    gamma: null
  }),

  alpha: Ember.computed.readOnly('_tilt.alpha'),
  beta: Ember.computed.readOnly('_tilt.beta'),
  gamma: Ember.computed.readOnly('_tilt.gamma'),

  debounceTimeout: Ember.computed.oneWay('defaultDebounceTimeout'),
  tiltAnglePrecision: Ember.computed.oneWay('defaultTiltAnglePrecision'),

  init() {
    this._super(...arguments);
    this._setDefaults();
    let svc = this;
    this._onTiltHandler = event => {
      svc.setProperties({
        '_tilt.alpha': event.alpha,
        '_tilt.beta': event.beta,
        '_tilt.gamma': event.gamma
      });
      svc._fireTiltEvent(event);
    };
    this._installTiltListener();
  },

  destroy() {
    this._super(...arguments);
    this._uninstallTiltListener();
  },

  _setDefaults() {
    const defaults = Ember.getWithDefault(this, 'orientationServiceDefaults', {});
    map(Ember.keys(defaults), key => {
      const classifiedKey = classify(key);
      const defaultKey = `default${classifiedKey}`;
      return Ember.set(this, defaultKey, defaults[key]);
    });
  },

  _installTiltListener() {
    window.addEventListener('deviceorientation', this._onTiltHandler);
  },

  _uninstallTiltListener() {
    window.removeEventListener('deviceorientation', this._onTiltHandler);
  },

  _fireTiltEvent(evt) {
    this.trigger('tilt', evt);
  }
});
