import Ember from 'ember';
import { transformationMatrix, transformVector } from '../utils/orientation-transformation-matrix';

const { classify } = Ember.String;
const keys = Object.keys || Ember.keys;
const { Service, computed, run, Evented, get, set, getWithDefault } = Ember;

export default Service.extend(Evented, {

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

  alpha: computed.readOnly('_tilt.alpha'),
  beta: computed.readOnly('_tilt.beta'),
  gamma: computed.readOnly('_tilt.gamma'),

  accelerationX: computed.readOnly('_acceleration.x'),
  accelerationY: computed.readOnly('_acceleration.y'),
  accelerationZ: computed.readOnly('_acceleration.z'),

  rotationRateAlpha: computed.readOnly('_rotationRate.alpha'),
  rotationRateBeta: computed.readOnly('_rotationRate.beta'),
  rotationRateGamma: computed.readOnly('_rotationRate.gamma'),

  debounceTimeout: computed.oneWay('defaultDebounceTimeout'),
  tiltAngleSensitivity: computed.oneWay('defaultTiltAngleSensitivity'),
  accelerationSensitivity: computed.oneWay('defaultAccelerationSensitivity'),

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
        run.debounce(svc, svc._fireDebouncedTiltEvent, event, svc.get('debounceTimeout'));
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
        run.debounce(svc, svc._fireDebouncedMotionEvent, event, svc.get('debounceTimeout'));
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
    let { alpha, beta, gamma } = this.get('_tilt');
    return transformVector([0, 0, 1], alpha, beta, gamma);
  },

  transformationMatrix() {
    let { alpha, beta, gamma } = this.get('_tilt');
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
    let prevTilt = this.get('_tilt'),
      obj = {};
    keys.forEach(function(key) {
      obj[key] = get(event, key) - get(prevTilt, key);
    });
    return obj;
  },

  _setDefaults() {
    let defaults = getWithDefault(this, 'orientationServiceDefaults', {});
    keys(defaults).map(key => {
      let classifiedKey = classify(key);
      let defaultKey = `default${classifiedKey}`;
      return set(this, defaultKey, defaults[key]);
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
