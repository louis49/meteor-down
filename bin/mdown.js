#!/usr/bin/env node

var _ = require('underscore');
var fs = require('fs');
var MeteorDown = require('../');

var filePath = process.argv[2];
if(!filePath) {
  showHelp();
  process.exit(1);
}

var mdown = new MeteorDown();
var content = fs.readFileSync(filePath).toString();
var scriptFn = new Function('mdown', 'require', '_', content);
scriptFn(mdown, require, _);

/* ------------------------------------------------------------------------- */

process.on('SIGINT', function() {
  _.each(mdown.stats.get(), function (result) {
    console.log('\n%s x %d (response-time: %dms)', result.type, result.summary.count, result.summary.average);
    _.each(result.breakdown, function (item) {
      console.log(' - %s x %d (response-time: %dms)', item.name, item.count, item.average);
    });
  });

  process.exit();
});

/* ------------------------------------------------------------------------- */

function showHelp () {
  console.log(
    'USAGE:\n'+
    '  mdown <path-to-scriapt>\n'
  );
}
