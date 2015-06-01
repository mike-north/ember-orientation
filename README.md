# Ember-orientation [![Build Status](https://travis-ci.org/truenorth/ember-orientation.svg?branch=master)](https://travis-ci.org/truenorth/ember-resize) [![Code Climate](https://codeclimate.com/github/truenorth/ember-orientation/badges/gpa.svg)](https://codeclimate.com/github/truenorth/ember-orientation) [![npm version](https://badge.fury.io/js/ember-orientation.svg)](http://badge.fury.io/js/ember-orientation)

Effortlessly respond to device orientation events and changes 

### Use

* ember-cli < 0.2.3 `ember install:addon ember-orientation`
* ember-cli >= 0.2.3 `ember install ember-orientation`


### Configuration

in your `config/environment.js`, you may configure some options

```js
module.exports = function(environment) {
  var ENV = {
    orientationServiceDefaults: {
      debounceTimeout    : 50,
      injectionFactories : [ 'view', 'component']
    }
  }
}
```

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

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
