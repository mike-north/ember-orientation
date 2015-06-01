'use strict';

module.exports = function(/* environment, appConfig */) {
  return {
    orientationServiceDefaults: {
      debounceTimeout: 50,
      tiltAnglePrecision: 0.1,
      injectionFactories: ['view', 'component']
    }
  };
};
