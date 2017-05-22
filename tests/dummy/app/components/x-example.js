import Ember from 'ember';
import DeviceOrientationAware from 'ember-orientation/mixins/device-orientation-aware';

const { computed, Component, String: { htmlSafe } } = Ember;

export default Component.extend(DeviceOrientationAware, {

  classNames: ['x-example'],

  transformStyle: computed('tiltAlpha', 'tiltBeta', 'tiltGamma', function() {
    return htmlSafe(`transform: rotateZ(${(this.get('tiltAlpha'))}deg) `
      + `rotateX(${-this.get('tiltBeta')}deg) `
      + `rotateY(${-this.get('tiltGamma')}deg);`
      + `-webkit-transform: rotateZ(${(this.get('tiltAlpha'))}deg) `
      + `rotateX(${-this.get('tiltBeta')}deg) `
      + `rotateY(${-this.get('tiltGamma')}deg)`);
  })
});
