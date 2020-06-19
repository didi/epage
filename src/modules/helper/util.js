
export function isFunction (value) {
  return typeof value === 'function'
}

export function isString (value) {
  return typeof value === 'string'
}

export function isNumber (value) {
  return typeof value === 'number'
}

export function isArray (value) {
  return Array.isArray(value)
}

export function jsonClone (value) {
  return JSON.parse(JSON.stringify(value))
}

export function include (list, i) {
  return list.indexOf(i) !== -1
}

/**
 * get primitive value type
 * @param {any} value shoule be checked
 * @return {Boolean}
 */
export function getValueType (value) {
  return ({}).toString.call(value).slice(8).split(']')[0].toLowerCase()
}

/**
 * check if array value type is as expected
 * @param {Array} value
 * @param {String} expectedType Schema.type
 */
function checkValueTypeWithStringExpectedType (value, expectedType) {
  const matched = expectedType.match(/array<([^<>]+)>/)
  if (expectedType === 'array') {
    return true
  }
  if (!matched || !matched[1]) {
    return false
  }
  const innerType = matched[1]

  return value.filter(v => getValueType(v) === innerType).length === value.length
}
/**
 * 判断value参数值类型是否符合预期expectedType
 * @param {any} value 待判断值
 * @param {String|Number|Boolean|Undefined|Array} expectedType 期望的value值类型
 * @param {Boolean} dynamic 是否允许动态添加widget，由schema.dynamic决定，为true时，value必须为数组类型
 * @returns {Boolean}
 */
export function checkValueType (value, expectedType, dynamic) {
  const type = getValueType(value)
  if (dynamic) {
    if (type !== 'array') {
      return false
    }
    return value.filter(v => checkValueType(v, expectedType, false)).length === value.length
  } else {
    if (type === 'array') {
      if (isArray(expectedType)) {
        return !!expectedType.filter(t => checkValueTypeWithStringExpectedType(value, t)).length
      } else {
        return checkValueTypeWithStringExpectedType(value, expectedType)
      }
    } else {
      return isArray(expectedType) ? include(expectedType, type) : type === expectedType
    }
  }
}
/**
 * 生成指定长度字符串长度，大小写字母及数字
 * @param {Number} len 字符串长度
 */
export function randomStr (len = 8) {
  let result = ''
  const char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (var i = 0; i < len; i++) {
    result += char.charAt(Math.floor(Math.random() * char.length))
  }
  return 'k' + result
}

/**
 * 判断一个变量是否为原生对象
 * @param {any} value 待判断参数
 */
export function isPlainObject (value) {
  if (!value || typeof value !== 'object' || ({}).toString.call(value) !== '[object Object]') {
    return false
  }
  const proto = Object.getPrototypeOf(value)
  if (proto === null) {
    return true
  }
  const Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor
  return typeof Ctor === 'function'
}

/**
 * 判断是否非空字符串
 * @param {String} value 待判断值
 */
export function isNotEmptyString (value) {
  if (
    !isString(value) ||
    !value.trim().length
  ) return false
  return true
}

/**
 * 判断是否为数字字符串
 * @param {String} value 待判断值
 */
export function isNumberString (value) {
  if (typeof value !== 'string') {
    return false
  }
  return /^-?\d+(.\d+)?$/.test(value)
}

/**
 * 简单的http请求方法
 * @param {String} url 请求url
 * @param {Object} option 请求参数
 */
export function ajax (url, option) {
  let pro = fetch(url, option)
    .then(res => res.json())

  if (option) {
    const { before } = option
    if (isFunction(before)) {
      pro = pro.then(before)
    }
  }
  return pro
}

/**
 *  对函数进行防抖
 * @param {function} func 防抖的函数
 * @param {number} wait 防抖的时间
 * @param {object} options 防抖参数
 * @param {boolean} options.leading 指定在延迟开始前调用
 * @param {boolean} options.trailing 指定在延迟结束后调用
 * @param {boolean} options.maxWait 允许被延迟的最大值
 *
 */
export function debounce (func, wait, options) {
  let lastArgs
  let lastThis
  let maxWait
  let result
  let timerId
  let lastCallTime
  let lastInvokeTime = 0
  let leading = false
  let maxing = false
  let trailing = true

  if (typeof func !== 'function') {
    throw new TypeError('Expected a function')
  }
  wait = parseInt(wait, 10) || 0
  if (isPlainObject(options)) {
    leading = !!options.leading
    maxing = 'maxWait' in options
    maxWait = maxing ? Math.max(parseInt(options.maxWait) || 0, wait) : maxWait
    trailing = 'trailing' in options ? !!options.trailing : trailing
  }

  function invokeFunc (time) {
    var args = lastArgs
    var thisArg = lastThis

    lastArgs = lastThis = undefined
    lastInvokeTime = time
    result = func.apply(thisArg, args)
    return result
  }

  function leadingEdge (time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait)
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result
  }

  function remainingWait (time) {
    var timeSinceLastCall = time - lastCallTime
    var timeSinceLastInvoke = time - lastInvokeTime
    var timeWaiting = wait - timeSinceLastCall

    return maxing
      ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting
  }

  function shouldInvoke (time) {
    var timeSinceLastCall = time - lastCallTime
    var timeSinceLastInvoke = time - lastInvokeTime

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait))
  }

  function timerExpired () {
    var time = Date.now()
    if (shouldInvoke(time)) {
      return trailingEdge(time)
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time))
  }

  function trailingEdge (time) {
    timerId = undefined

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time)
    }
    lastArgs = lastThis = undefined
    return result
  }

  function cancel () {
    if (timerId !== undefined) {
      clearTimeout(timerId)
    }
    lastInvokeTime = 0
    lastArgs = lastCallTime = lastThis = timerId = undefined
  }

  function flush () {
    return timerId === undefined ? result : trailingEdge(Date.now()())
  }

  function debounced () {
    var time = Date.now()
    var isInvoking = shouldInvoke(time)

    lastArgs = arguments
    lastThis = this
    lastCallTime = time

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime)
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        clearTimeout(timerId)
        timerId = setTimeout(timerExpired, wait)
        return invokeFunc(lastCallTime)
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait)
    }
    return result
  }
  debounced.cancel = cancel
  debounced.flush = flush
  return debounced
}

export function formatDate (_date, _format) {
  const date = _date instanceof Date ? _date : new Date()
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  let minute = date.getMinutes()
  let hour = date.getHours()
  let second = date.getSeconds()
  const addPrefix = function (num) {
    const n = num + ''
    return n.length === 1 ? '0' + n : n
  }

  year = addPrefix(year)
  month = addPrefix(month)
  day = addPrefix(day)
  minute = addPrefix(minute)
  hour = addPrefix(hour)
  second = addPrefix(second)

  const format = _format || 'yyyy-MM-dd'
  return format
    .replace('yyyy', year)
    .replace('MM', month)
    .replace('dd', day)
    .replace('HH', hour)
    .replace('mm', minute)
    .replace('ss', second)
}

export function copy (str) {
  const input = document.createElement('textArea')
  input.setAttribute('style', 'position: absolute;z-index: -1;height: 0;width: 0;')
  document.body.appendChild(input)
  input.value = str
  input.select()
  const isCopied = document.execCommand('copy', 'false', null)

  return new Promise((resolve, reject) => {
    if (isCopied) {
      resolve(str)
    } else {
      reject(new Error('error'))
    }
    document.body.removeChild(input)
  })
}
