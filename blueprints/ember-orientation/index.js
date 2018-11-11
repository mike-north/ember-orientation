/* eslint-env node */
module.exports = {
  description: 'ember-orientation installation blueprint',
  normalizeEntityName: function() {},

  afterInstall: function(/* options */) {
    return this.addAddonToProject('ember-getowner-polyfill', '^1.0.0');
  }
};
