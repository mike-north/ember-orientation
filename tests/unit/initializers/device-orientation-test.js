import Ember from 'ember';
import { initialize } from '../../../initializers/device-orientation';
import { module, test } from 'qunit';

const { Application, run } = Ember;

let container, application;

module('Unit | Initializer | device-orientation', {
  needs: ['service:resize'],
  beforeEach() {
    run(function() {
      application = Application.create();
      container = application.__container__;
      application.deferReadiness();
    });
  }
});

test('service is registered to the container', function(assert) {
  assert.ok(!application.__container__.lookup('service:device-orientation'), 'not registered as service:device-orientation in the container before initializer');
  initialize(container, application);
  assert.ok(application.__container__.lookup('service:device-orientation'), 'registered as service:device-orientation in the container after initializer');
});

test('service configuration is registered to the container', function(assert) {
  assert.ok(!application.__container__.lookup('config:device-orientation'), 'not registered as config:device-orientation in the container before initializer');
  initialize(container, application);
  assert.ok(application.__container__.lookup('config:device-orientation'), 'registered as config:device-orientation in the container after initializer');
});

test('service configuration is injected onto the device-orientation service', function(assert) {
  initialize(container, application);
  let deviceOrientation = application.__container__.lookup('service:device-orientation');
  assert.deepEqual(deviceOrientation.get('orientationServiceDefaults'), application.__container__.lookup('config:device-orientation'), 'defaults are registered to service as "resizeServiceDefaults"');
});

