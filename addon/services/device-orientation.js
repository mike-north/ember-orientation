import Ember from 'ember';
import { transformationMatrix, transformVector } from '../utils/orientation-transformation-matrix';

const { classify } = Ember.String;
const keys = Object.keys || Ember.keys;

export default Ember.Service.extend(Ember.Evented, {

  _tilt: Ember.Object.create({
    alpha: null,
    beta: null,
    gamma: null
  }),

  _acceleration: Ember.Object.create({
    x: null,
    y: null,
    z: null
  }),

  _rotationRate: Ember.Object.create({
    alpha: null,
    beta: null,
    gamma: null
  }),

  supportsOrientation: null,
  supportsMotion: null,

  alpha: Ember.computed.readOnly('_tilt.alpha'),
  beta: Ember.computed.readOnly('_tilt.beta'),
  gamma: Ember.computed.readOnly('_tilt.gamma'),

  accelerationX: Ember.computed.readOnly('_acceleration.x'),
  accelerationY: Ember.computed.readOnly('_acceleration.y'),
  accelerationZ: Ember.computed.readOnly('_acceleration.z'),

  rotationRateAlpha: Ember.computed.readOnly('_rotationRate.alpha'),
  rotationRateBeta: Ember.computed.readOnly('_rotationRate.beta'),
  rotationRateGamma: Ember.computed.readOnly('_rotationRate.gamma'),

  debounceTimeout: Ember.computed.oneWay('defaultDebounceTimeout'),
  tiltAngleSensitivity: Ember.computed.oneWay('defaultTiltAngleSensitivity'),
  accelerationSensitivity: Ember.computed.oneWay('defaultAccelerationSensitivity'),

  init() {
    this._super(...arguments);
    this._setDefaults();

    this.set('supportsOrientation', window.DeviceOrientationEvent);
    this.set('supportsMotion', window.DeviceMotionEvent);

    let svc = this;
    this._onTiltHandler = event => {
      if (svc._shouldFireTiltEvent(event)) {
        let { alpha, beta, gamma } = event;
        svc.setProperties({
          '_tilt.alpha': alpha,
          '_tilt.beta': beta,
          '_tilt.gamma': gamma
        });
        svc._fireTiltEvent(event);
        Ember.run.debounce(svc, svc._fireDebouncedTiltEvent, event, svc.get('debounceTimeout'));
      }
    };
    this._onMotionHandler = event => {
      if (svc._shouldFireMotionEvent(event)) {
        let { x, y, z } = event.acceleration;
        svc.setProperties({
          '_acceleration.alpha': x,
          '_acceleration.beta': y,
          '_acceleration.gamma': z
        });
        svc._fireMotionEvent(event);
        Ember.run.debounce(svc, svc._fireDebouncedMotionEvent, event, svc.get('debounceTimeout'));
      }
    };
    if (this.get('supportsOrientation')) {
      this._installTiltListener();
    }
    if (this.get('supportsMotion')) {
      this._installMotionListener();
    }
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
    if (this.get('supportsOrientation')) {
      this._uninstallTiltListener();
    }
    if (this.get('supportsMotion')) {
      this._uninstallMotionListener();
    }
  },

  _shouldFireTiltEvent(event) {
    let deltas = this._calculateDeltas(event);
    function sq(x) {
      return x * x;
    }
    return Math.max(sq(deltas.alpha), Math.max(sq(deltas.beta), sq(deltas.gamma))) >= sq(this.get('tiltAngleSensitivity'));
  },

  _shouldFireMotionEvent(event) {
    let deltas = this._calculateDeltas(event, ['x', 'y', 'z']);
    function sq(x) {
      return x * x;
    }
    return Math.max(sq(deltas.x), Math.max(sq(deltas.y), sq(deltas.z))) >= sq(this.get('accelerationSensitivity'));
  },

  _calculateDeltas(event, keys=['alpha', 'beta', 'gamma']) {
    const prevTilt = this.get('_tilt');
    let obj = {};
    for (let k in keys) {
      obj[keys[k]] = Ember.get(event, keys[k]) - Ember.get(prevTilt, keys[k]);
    }
    return obj;
  },

  _setDefaults() {
    const defaults = Ember.getWithDefault(this, 'orientationServiceDefaults', {});
    keys(defaults).map(key => {
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

  _installMotionListener() {
    window.addEventListener('devicemotion', this._onMotionHandler);
  },

  _uninstallMotionListener() {
    window.removeEventListener('devicemotion', this._onMotionHandler);
  },

  _fireTiltEvent(evt) {
    this.trigger('tilt', evt);
  },
  _fireDebouncedTiltEvent(evt) {
    this.trigger('debouncedTilt', evt);
  },
  _fireMotionEvent(evt) {
    this.trigger('deviceMove', evt);
  },
  _fireDebouncedMotionEvent(evt) {
    this.trigger('debouncedDeviceMove', evt);
  }
});
