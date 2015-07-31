# Ember-orientation 

<img align="right" src="http://i60.tinypic.com/k1ri0z.jpg" />

[![Build Status](https://travis-ci.org/mike-north/ember-orientation.svg?branch=master)](https://travis-ci.org/mike-north/ember-orientation)
[![Code Climate](https://codeclimate.com/github/mike-north/ember-orientation/badges/gpa.svg)](https://codeclimate.com/github/mike-north/ember-orientation)
[![npm version](https://badge.fury.io/js/ember-orientation.svg)](http://badge.fury.io/js/ember-orientation)
[![Dependency Status](https://david-dm.org/mike-north/ember-orientation.svg)](https://david-dm.org/mike-north/ember-orientation)
[![devDependency Status](https://david-dm.org/mike-north/ember-orientation/dev-status.svg)](https://david-dm.org/mike-north/ember-orientation#info=devDependencies)
[![Ember Observer Score](http://emberobserver.com/badges/ember-orientation.svg)](http://emberobserver.com/addons/ember-orientation)


Effortlessly respond to device orientation events and changes 




### Use

* ember-cli < 0.2.3 `ember install:addon ember-orientation`
* ember-cli >= 0.2.3 `ember install ember-orientation`

### Service: `DeviceOrientation`

Included in this addon is a service that emits events on orientation change...

```js
let MyComponent = Ember.Component.extend({

  didInsertElement() {
    this._super(...arguments);

    this.get('orientation').on('tilt', evt => {
      console.log(`alpha: ${evt.alpha}\tbeta: ${evt.beta}\tgamma: ${evt.gamma}`);
    });
  }

});
```

...and has properties
with the latest orientation values that you can bind to

```js
let MyComponent = Ember.Component.extend({
  alphaTiltAngle: Ember.computed.alias('orientation.alpha')
});
```

The service also has two methods to make the tilt data more easily consumable

* `transformationMatrix` - a 9-length transformation matrix calculated from alpha, beta and gamma as follows:
![Rotation Matrix](https://dev.opera.com/articles/w3c-device-orientation-usage/equation13a.png)
* normalVector - a 3-length unit vector normal to the screen of the device.

### Mixin: `DeviceOrientationAware`

To make this service even easier to use, a mixin is included

```js
import DeviceOrientationAware from 'ember-orientation/mixins/device-orientation-aware';

let MyComponent = Ember.Component.extend(DeviceOrientationAware, {

  // Fires whenever tilt exceeds "sensitivity"
  didTilt(evt) {
    let {alpha, beta, gamma} = evt;
    ...
  },

  // A debounced version
  debouncedDidTilt(evt) {
    let {alpha, beta, gamma} = evt;
    ...
  },

  // tiltAlpha, tiltBeta, tiltGamma properties are included
  transformStyle: Ember.computed('tiltAlpha', 'tiltBeta', 'tiltGamma', {
    get() {
      return `transform: rotateZ(${(this.get('tiltAlpha') - 180 )}deg) ` +
             `rotateX(${this.get('tiltBeta')}deg) ` +
             `rotateY(${- this.get('tiltGamma')}deg)`;
    }
  })
});
```

### Configuration

in your `config/environment.js`, you may configure some options

```js
module.exports = function(environment) {
  var ENV = {
    orientationServiceDefaults: {
      debounceTimeout    : 50, // ms
      tiltAngleSensitivity: 1, // degrees
      injectionFactories : [ 'view', 'component']
    }
  }
}
```
* `debounceTimeout` - Debounce time used for `debouncedDidTilt` hook
* `tiltAngleSensitivity` - `didTilt` and `debouncedDidTilt` will only be called when tilt angle along any access is `>=` this value (in degrees)
* `injectionFactories` - customize which types of objects the `orientation` service will be injected onto upon initialization


## Installation

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `ember test`
* `ember test --server`

## Building

* `ember build`

## Credits
  * * Image Source: Opera developer docs


For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
