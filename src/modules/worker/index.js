/**
 * 创建worker
 *
 * 一、用途：
 *  - 处理用户输入的脚本
 *  - 避免用户恶意获取window或document对象数据，增加安全性
 *  - 避免用户输入死循环等错误逻辑阻塞主线程执行
 *
 * 二、用法：
 *  ```
 *  let worker = new EpWorker()
 *  worker.onmessage = function (e) {
 *    const {
 *      message, // 错误消息
 *      success, // 是否执行成功 布尔类型
 *      data     // 处理后返回的数据
 *    } = e.data
 *  }
 *  worker.postMessage({
 *    action, // 需要worker处理的类型，可选值：'fetch'，其对应fn字段使用的变量为 `data`
 *    data,   // 发送给进程的数据，可以是任意类型
 *    fn      // 处理后返回的数据，可以执行的字符串函数，不包含`function`关键字（同new Function最后一个参数），需要 return处理后的数据
 *  }
 *  ```
 */

export default class EpWorker {
  constructor () {
    return this.createWorker()
  }

  createWorker () {
    const blob = new Blob(['(' + this.createFunction().toString() + ')()'])
    const url = window.URL.createObjectURL(blob)
    return new Worker(url)
  }

  createFunction () {
    return function () {
      // 对注入参数进行转化
      self.util = {
        convert2kv (data, fn, children) {
          if (!children) {
            return data.map(fn)
          } else {
            return __recursive(data, fn)
          }
          // 递归转换数据
          function __recursive (data, fn) {
            return data.map(function (item) {
              const newItem = Object.assign({}, fn(item))
              const rawChildren = Array.isArray(item[children]) ? item[children] : []
              newItem.children = __recursive(rawChildren, fn)
              return newItem
            })
          }
        }
      }
      function isObj (arg) {
        return Object.prototype.toString.call(arg) === '[object Object]'
      }

      function t (e, r, o) {
        return ((function () {
          if (typeof Reflect === 'undefined' || !Reflect.construct) {
            return false
          }
          if (Reflect.construct.sham) {
            return false
          }
          if (typeof Proxy === 'function') {
            return true
          }
          try {
            Date.prototype.toString.call(Reflect.construct(Date, [], function () {}))
            return true
          } catch (e) {
            return false
          }
        }()) ? Reflect.construct : function (e, t, r) {
            var o = [null]
            o.push.apply(o, t)
            var C = Function.bind.apply(e, o)
            var u = new C()
            // r && n(u, r.prototype)
            return u
          }).apply(null, arguments)
      }
      function r (e) {
        return (function (e) {
          if (Array.isArray(e)) {
            for (var t = 0, n = new Array(e.length); t < e.length; t++) {
              n[t] = e[t]
            }
            return n
          }
        }(e)) || (function (e) {
          if (Symbol.iterator in Object(e) || Object.prototype.toString.call(e) === '[object Arguments]') {
            return Array.from(e)
          }
        }(e)) || (function () {
          throw new TypeError('Invalid attempt to spread non-iterable instance')
        }())
      }

      /**
       * 检查转换后返回值是否含有kv属性的对象列表
       * @param {*} data
       * @returns {success: Boolean, message: String} 返回值
       */
      function checkKVList (data) {
        let success = true
        let message = ''
        if (Array.isArray(data)) {
          for (let i = 0; i < data.length; i++) {
            if (!isObj(data[i]) || !('key' in data[i]) || !('value' in data[i])) {
              success = false
              message = `${data} 在索引 ${i} 不符合格式规范，请转换成[{key: '', value: ''}, ...] 形式并返回`
              break
            }
          }
        } else {
          success = false
          message = '需要返回数组'
        }
        return { success, message }
      }

      function checkTableList (data) {
        function isAvailableNumber (n) {
          return typeof n === 'number' && n >= 0
        }
        const pageErrorMsg = 'page 格式不符合规范，应为： { current: Number, size: Number, total: Number }'
        if (isObj(data)) {
          // check page
          const { current, size, total } = data.page
          if (!isObj(data.page) ||
            !isAvailableNumber(current) ||
            !isAvailableNumber(size) ||
            !isAvailableNumber(total)
          ) {
            return { success: false, message: pageErrorMsg }
          }
          // check data
          for (let i = 0; i < data.length; i++) {
            if (!isObj(data[i])) {
              return { success: false, message: data[i] + ' 不符合格式规范' }
            }
          }
        } else {
          return { success: false, message: '需要返回对象{ page: {}, data: []}' }
        }
        return { success: true, message: '' }
      }

      // 可以后续扩展 action 及参数、检查函数
      const actionMap = {
        fetch: {
          args: ['data'],
          check: checkKVList
        },
        tableFetch: {
          args: ['data'],
          check: checkTableList
        }
      }

      // 监听接受到的消息
      self.onmessage = function (e) {
        let result = { success: true, message: '' }
        const { fn, action, data } = e.data
        let fun = res => res

        if (!(action in actionMap)) {
          result = {
            success: false,
            /* eslint no-template-curly-in-string: 0 */
            message: 'action: ' + action + ' 无法识别，只能为以下其中一种action: \n${Object.keys(actionMap).toString()}'
          }
          return self.postMessage(result)
        }
        if (!fn) {
          result = { success: false, message: '请传入 fn 参数' }
          return self.postMessage(result)
        }

        try {
          /* eslint-disable no-new-func */
          // fun = new Function(...actionMap[action].args, fn)
          fun = t(Function, r(actionMap[action].args).concat([fn]))
        } catch (e) {
          result = { success: false, message: e }
          return self.postMessage(result)
        }
        const _data = fun(data)
        result = actionMap[action].check(_data)
        if (result.success) {
          const newData = { success: result.success, data: _data }
          self.postMessage(newData)
        } else {
          return self.postMessage(result)
        }
      }
    }
  }
}
