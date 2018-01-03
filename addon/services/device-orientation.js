import { keys as emberKeys } from '@ember/polyfills';
import { debounce } from '@ember/runloop';
import { oneWay, readOnly } from '@ember/object/computed';
import { getWithDefault, set, get } from '@ember/object';
import Service from '@ember/service';
import Evented from '@ember/object/evented';
import { classify } from '@ember/string';
import { transformationMatrix, transformVector } from '../utils/orientation-transformation-matrix';

// eslint-disable-next-line
const keys = Object.keys || emberKeys;

export default Service.extend(Evented, {
  _tilt: null,

  _acceleration: null,

  _rotationRate: null,

  supportsOrientation: null,
  supportsMotion: null,

  alpha: readOnly('_tilt.alpha'),
  beta: readOnly('_tilt.beta'),
  gamma: readOnly('_tilt.gamma'),

  accelerationX: readOnly('_acceleration.x'),
  accelerationY: readOnly('_acceleration.y'),
  accelerationZ: readOnly('_acceleration.z'),

  rotationRateAlpha: readOnly('_rotationRate.alpha'),
  rotationRateBeta: readOnly('_rotationRate.beta'),
  rotationRateGamma: readOnly('_rotationRate.gamma'),

  debounceTimeout: oneWay('defaultDebounceTimeout'),
  tiltAngleSensitivity: oneWay('defaultTiltAngleSensitivity'),
  accelerationSensitivity: oneWay('defaultAccelerationSensitivity'),

  init() {
    this._super(...arguments);
    this.set('_tilt', {
      alpha: null,
      beta: null,
      gamma: null
    });
    this.set('_acceleration', {
      x: null,
      y: null,
      z: null
    });
    this.set('_rotationRate', {
      alpha: null,
      beta: null,
      gamma: null
    });
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
        debounce(svc, svc._fireDebouncedTiltEvent, event, svc.get('debounceTimeout'));
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
        debounce(svc, svc._fireDebouncedMotionEvent, event, svc.get('debounceTimeout'));
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
    return (
      Math.max(sq(deltas.alpha), Math.max(sq(deltas.beta), sq(deltas.gamma))) >= sq(this.get('tiltAngleSensitivity'))
    );
  },

  _shouldFireMotionEvent(event) {
    let deltas = this._calculateDeltas(event, ['x', 'y', 'z']);

    function sq(x) {
      return x * x;
    }
    return Math.max(sq(deltas.x), Math.max(sq(deltas.y), sq(deltas.z))) >= sq(this.get('accelerationSensitivity'));
  },

  _calculateDeltas(event, keys = ['alpha', 'beta', 'gamma']) {
    let prevTilt = this.get('_tilt');
    let obj = {};
    keys.forEach(key => {
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
