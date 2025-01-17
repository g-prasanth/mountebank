'use strict';

/**
 * An factory abstraction for loading imposters
 * @module
 */

/**
 * Creates the repository based on startup configuration
 * @param {Object} config - The startup configuration
 * @param {Object} logger - The logger
 * @returns {Object} - the repository
 */
function create (config, logger) {
    if (config.impostersRepository) {
        const fs = require('fs-extra'),
            path = require('path'),
            filename = path.resolve(path.relative(process.cwd(), config.impostersRepository));

        if (fs.existsSync(filename)) {
            try {
                return require(filename).create(config, logger);
            }
            catch (e) {
                logger.error(`An error occured while creating custom impostersRepository:\n ${e}`);
                return {};
            }
        }
        else {
            logger.warn(`Imposters Respository ${filename} does not exist. The default will be used`);
            return this.inMemory();
        }
    }
    else if (config.datadir) {
        return require('./filesystemBackedImpostersRepository').create(config, logger);
    }
    else {
        return this.inMemory();
    }
}

function inMemory () {
    return require('./inMemoryImpostersRepository').create();
}

module.exports = { create, inMemory };
