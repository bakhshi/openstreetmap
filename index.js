const peliasConfig = require('pelias-config').generate(require('./schema'));
const _ = require('lodash');
const logger = require('pelias-logger').get('openstreetmap');

if (_.has(peliasConfig, 'imports.openstreetmap.adminLookup')) {
  logger.info('imports.openstreetmap.adminLookup has been deprecated, ' +
              'enable adminLookup using imports.adminLookup.enabled = true');
}

var pbf2json = require('pbf2json');
var path = require('path');
var through = require('through2');

var defaultPath= require('pelias-config').generate().imports.openstreetmap;
var config = {
  file: path.join(defaultPath.datapath, defaultPath.import[0].filename),
  leveldb: defaultPath.leveldbpath,
  tags: [
    'highway+name'
  ],
}

var highwayList = [];

pbf2json.createReadStream(config)
  .pipe(through.obj(function (item, e, next) {
    console.log(item);
    highwayList.push(item);
    next();
  })).on('finish', () => {
    const importPipeline = require('./stream/importPipeline');

    importPipeline.import(highwayList);

  });


