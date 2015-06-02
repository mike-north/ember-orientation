'use strict';

module.exports = function(/* environment, appConfig */) {
  return {
    orientationServiceDefaults: {
      debounceTimeout: 50,
      tiltAngleSensitivity: 1,
      accelerationSensitivity: 0.3,
      injectionFactories: ['view', 'component']
    }
  };
};
