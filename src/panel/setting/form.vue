<template lang="pug">
Form(:label-width='80')
  FormItem(label='标题')
    Input(:size='size' placeholder='给页面起个名字吧' v-model='rootSchema.title')

  FormItem(label='描述')
    Input(:size='size' type='textarea' placeholder='写点描述吧' v-model='rootSchema.description')

  FormItem(label='label宽(px)')
    InputNumber(:size='size' :min='0' :step='1' v-model='rootSchema.label.width')

  FormItem(label='label位置')
    RadioGroup(:size='size' v-model='rootSchema.label.position' @on-change='onPositionChange')
      Radio(label='top') 上
      Radio(label='left') 左
      Radio(label='right') 右

  FormItem(label='尺寸')
    RadioGroup(:size='size' v-model='rootSchema.size')
      Radio(label='small') 小
      Radio(label='default') 默认
      Radio(label='large') 大

  //- FormItem(label='最大宽度(px)')
  //-   InputNumber(:size='size' :min='200' :step='10' v-model='rootSchema.style.maxWidth')
  ep-style(:styles='rootSchema.style')

  //- FormItem(label='保存地址')
  //-   Input(:size='size' v-model='rootSchema.option.url')
  //- FormItem(label='保存方法')
  //-   Select(:size='size' v-model='rootSchema.option.method' :transfer='true')
  //-     Option(value='POST') POST
  //-     Option(value='PUT') PUT
  slot

</template>
<script>
import EpStyle from '../../components/style'

export default {
  components: {
    EpStyle
  },
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
