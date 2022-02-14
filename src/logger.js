/**
 * All available log levels
 * @type {Object<String, Number>}
 */
export const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  NONE: Infinity
}


/**
 * Map levels to real console functions
 * @type {Object<String, Function>}
 */
const LOG_METHODS = {
  [LOG_LEVELS.DEBUG]: console.debug,
  [LOG_LEVELS.INFO]: console.log,
  [LOG_LEVELS.WARN]: console.warn,
  [LOG_LEVELS.ERROR]: console.error
}


/**
 * Write log depending on the level requested
 * @param {Number} level 
 * @param {String} prefix 
 * @param {Array} args 
 */
function writeLog(level, prefix, args) {
  const method = LOG_METHODS[level]
  if(method && Logger.LEVEL <= level) method(prefix, ...args)
}


/**
 * Logger factory
 * @param {String} prefix 
 */
export default function Logger(prefix = '') {
  const logger = (...args) => writeLog(LOG_LEVELS.DEBUG, prefix, args)
  logger.info = (...args) => writeLog(LOG_LEVELS.INFO, prefix, args)
  logger.warn = (...args) => writeLog(LOG_LEVELS.WARN, prefix, args)
  logger.error = (...args) => writeLog(LOG_LEVELS.ERROR, prefix, args)
  return logger
}


/**
 * Logger global level
 * @type {Number} 
 */
Logger.LEVEL = LOG_LEVELS.DEBUG


/**
 * Built-in instance
 * @type {Logger}
 */
export const logger = new Logger()