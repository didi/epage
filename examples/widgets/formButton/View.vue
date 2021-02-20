<template lang="pug">
.ep-widget
  Button(
    v-if='schema.key'
    :type='schema.option.type'
    :disabled='schema.disabled'
    :size='schema.size || rootSchema.size'
    :long='schema.option.long'
    :shape='schema.option.shape !== "circle" ? undefined : schema.option.shape'
    @click="onClick"
  ) {{schema.option.text}}

</template>
<script>
import { viewExtend } from 'epage-iview'
import { helper } from 'epage-core'

const { getModel, ajax } = helper
export default {
  extends: viewExtend,
  mounted () {
  },
  methods: {
    onClick () {
      this.event('on-click', ...arguments)
      const { actionType } = this.schema.option
      if (actionType === 'submit') {
        this.onSubmit()
      } else if (actionType === 'goback') {
        console.log('goback')
      } else if (actionType === 'reset') {
        this.onReset()
      }
    },
    onSubmit () {
      const { url, method = 'POST' } = this.schema.option
      const model = this.getModel()
      if (!url) return
      ajax(url, {
        body: JSON.stringify(model),
        method
      })
        .then(res => {
          console.log(2, res)
        }, err => {
          console.log(1, err)
        })
    },
    onReset () {
      const model = this.getModel()
      const newModel = {}
      const isObj = arg => Object.prototype.toString.call(arg) === '[object Object]'
      for (const i in model) {
        if (typeof model[i] === 'string') {
          newModel[i] = ''
        } else if (typeof model[i] === 'number') {
          newModel[i] = 0
        } else if (typeof model[i] === 'boolean') {
          newModel[i] = false
        } else if (Array.isArray(model[i])) {
          newModel[i] = []
        } else if (isObj(model[i])) {
          newModel[i] = {}
        }
      }
      this.store.setModel(newModel)
    },
    getModel () {
      const flatSchemas = this.store.getFlatSchemas()
      const model = this.store.getModel()
      const submitModel = getModel(model, flatSchemas)
      console.log('model: ', submitModel)
      return submitModel
    }
  }
}
</script>
