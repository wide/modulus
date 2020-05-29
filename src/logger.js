/**
 * Logger factory
 * @param {String} prefix 
 */
export default function Logger(prefix = '') {

  const logger = function(...args) {
    console.debug(prefix, ...args)
  }

  logger.info = (...args) => console.log(prefix, ...args)
  logger.warn = (...args) => console.warn(prefix, ...args)
  logger.error = (...args) => console.error(prefix, ...args)

  return logger
}