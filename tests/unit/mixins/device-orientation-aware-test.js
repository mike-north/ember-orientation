import Ember from 'ember';
import DeviceOrientationAware from '../../../mixins/device-orientation-aware';
import { module, test } from 'qunit';

module('Unit | Mixin | device-orientation aware');

// Replace this with your real tests.
test('it works', function(assert) {
  let DeviceOrientationAwareObject = Ember.Object.extend(DeviceOrientationAware);
  let subject = DeviceOrientationAwareObject.create();
  assert.ok(subject);
});
