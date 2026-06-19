/**
 * 日志记录工具
 */
const LOG_LEVELS = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 }
const currentLevel = LOG_LEVELS.DEBUG

const formatTime = () => new Date().toISOString()

const log = (level, module, message, data = null) => {
  if (LOG_LEVELS[level] < currentLevel) return
  const prefix = `[${formatTime()}] [${level}] [${module}]`
  const logFn = level === 'ERROR' ? console.error : level === 'WARN' ? console.warn : console.log
  data ? logFn(prefix, message, data) : logFn(prefix, message)
}

export const logger = {
  debug: (module, msg, data) => log('DEBUG', module, msg, data),
  info: (module, msg, data) => log('INFO', module, msg, data),
  warn: (module, msg, data) => log('WARN', module, msg, data),
  error: (module, msg, data) => log('ERROR', module, msg, data)
}
