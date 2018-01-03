import { computed } from '@ember/object';
import Component from '@ember/component';
import { htmlSafe } from '@ember/string';
import DeviceOrientationAware from 'ember-orientation/mixins/device-orientation-aware';

export default Component.extend(DeviceOrientationAware, {
  classNames: ['x-example'],

  transformStyle: computed('tiltAlpha', 'tiltBeta', 'tiltGamma', function() {
    return htmlSafe(
      `transform: rotateZ(${this.get('tiltAlpha')}deg) ` +
        `rotateX(${-this.get('tiltBeta')}deg) ` +
        `rotateY(${-this.get('tiltGamma')}deg);` +
        `-webkit-transform: rotateZ(${this.get('tiltAlpha')}deg) ` +
        `rotateX(${-this.get('tiltBeta')}deg) ` +
        `rotateY(${-this.get('tiltGamma')}deg)`
    );
  })
});
