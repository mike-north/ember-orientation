import Ember from 'ember';
import { transformationMatrix, transformVector } from '../utils/orientation-transformation-matrix';

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
  tiltAngleSensitivity: Ember.computed.oneWay('defaultTiltAngleSensitivity'),

  init() {
    this._super(...arguments);
    this._setDefaults();
    let svc = this;
    this._onTiltHandler = event => {
      if (svc._shouldFireEvent(event)) {
        let { alpha, beta, gamma } = event;
        svc.setProperties({
          '_tilt.alpha': alpha,
          '_tilt.beta': beta,
          '_tilt.gamma': gamma
        });
        // console.log('MTX', orientationTransformationMatrix(alpha, beta, gamma));
        svc._fireTiltEvent(event);
        Ember.run.debounce(svc, svc._fireDebouncedTiltEvent, event, this.get('debounceTimeout'));
      }
    };
    this._installTiltListener();
  },

  normalVector() {
    const { alpha, beta, gamma } = this.get('_tilt');
    return transformVector([0, 0, 1], alpha, beta, gamma);
  },

  transformationMatrix() {
    const { alpha, beta, gamma } = this.get('_tilt');
    return transformationMatrix(alpha, beta, gamma);
  },

  destroy() {
    this._super(...arguments);
    this._uninstallTiltListener();
  },

  _shouldFireEvent(event) {
    let deltas = this._calculateDeltas(event);
    function sq(x) {
      return x * x;
    }
    return Math.max(sq(deltas.alpha), Math.max(sq(deltas.beta), sq(deltas.gamma))) >= sq(this.get('tiltAngleSensitivity'));
  },

  _calculateDeltas(event) {
    let prevTilt = this.get('_tilt');
    return {
      alpha: event.alpha - prevTilt.alpha,
      beta: event.beta - prevTilt.beta,
      gamma: event.gamma - prevTilt.gamma
    };
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
  },
  _fireDebouncedTiltEvent(evt) {
    this.trigger('debouncedTilt', evt);
  }
});
