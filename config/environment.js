'use strict';

module.exports = function(/* environment, appConfig */) {
  return {
    orientationServiceDefaults: {
      debounceTimeout: 50,
      tiltAngleSensitivity: 1,
      injectionFactories: ['view', 'component']
    }
  };
};
