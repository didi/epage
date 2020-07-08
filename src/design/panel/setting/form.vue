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
    RadioGroup(:size='size' v-model='rootSchema.label.position' @on-change='onPositionChange')
      Radio(label='top') 上
      Radio(label='left') 左
      Radio(label='right') 右

  FormItem(label='页面宽度(px)')
    InputNumber(:size='size' :min='200' :step='1' v-model='rootSchema.style.maxWidth')

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
  methods: {
    onPositionChange (value) {
      const DEFAULT_WIDTH = 80
      const width = value === 'top' ? 0 : DEFAULT_WIDTH
      this.rootSchema.label.width = width
    }
  }
}
</script>
