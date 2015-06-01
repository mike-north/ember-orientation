import Ember from 'ember';
import DeviceOrientationAware from 'ember-orientation/mixins/device-orientation-aware';

export default Ember.View.extend(DeviceOrientationAware, {
  classNames: ['index-view']
});
