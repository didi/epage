<template lang="pug">
Form(:label-width='80')
  FormItem(label='表单标题')
    Input(:size='size' v-model='rootSchema.title')
  FormItem(label='表单描述')
    Input(:size='size' type='textarea' v-model='rootSchema.description')
  FormItem(label='标题宽(px)')
    InputNumber(:size='size' :min='0' :step='1' v-model='rootSchema.label.width')
  FormItem(label='尺寸')
    RadioGroup(:size='size' v-model='rootSchema.size')
      Radio(label='small') 小
      Radio(label='default') 默认
      Radio(label='large') 大
  FormItem(label='标题位置')
    RadioGroup(:size='size' v-model='rootSchema.label.position')
      Radio(label='top') 上
      Radio(label='left') 左
      Radio(label='right') 右
  //- FormItem(label='保存地址')
  //-   Input(:size='size' v-model='rootSchema.option.url')
  //- FormItem(label='保存方法')
  //-   Select(:size='size' v-model='rootSchema.option.method' :transfer='true')
  //-     Option(value='POST') POST
  //-     Option(value='PUT') PUT
  slot

</template>
<script>

export default {
  props: {
    store: {
      type: Object,
      default: () => ({ state: {} })
    }
  },
  data () {
    return {
      size: 'small'
    }
  },
  computed: {
    rootSchema () {
      return this.store.getRootSchema()
    }
  },
  watch: {
    'rootSchema.label.position' (position, oldPosition) {
      const inInLR = p => ['left', 'right'].indexOf(p) > -1

      if (position === 'top') {
        this.rootSchema.label.width = 0
      } else {
        if (!inInLR(oldPosition)) {
          this.rootSchema.label.width = 80
        }
      }
    }
  }
}
</script>
