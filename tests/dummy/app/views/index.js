import Ember from 'ember';
import DeviceOrientationAware from 'ember-orientation/mixins/device-orientation-aware';

export default Ember.View.extend(DeviceOrientationAware, {
  classNames: ['index-view'],

  transformStyle: Ember.computed('tiltAlpha', 'tiltBeta', 'tiltGamma', {
    get() {
      return `transform: rotateZ(${(this.get('tiltAlpha'))}deg) ` +
             `rotateX(${this.get('tiltBeta')}deg) ` +
             `rotateY(${-this.get('tiltGamma')}deg);` +
             `-webkit-transform: rotateZ(${(this.get('tiltAlpha'))}deg) ` +
             `rotateX(${this.get('tiltBeta')}deg) ` +
             `rotateY(${-this.get('tiltGamma')}deg)`;
    }
  })
});
