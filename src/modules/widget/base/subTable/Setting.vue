<template lang="pug">
setting-form(:store='store' :setting='setting')
  span(slot='rule')

  FormItem(v-if='!$slots.noDataText' label='空提示' slot='placeholder')
    Input(v-model='selectedSchema.option.noDataText' size='small')
  template(v-else)
    slot(name='noDataText')

  h5 定义表头
  Row.ep-setting-subTable-header(v-for='(column, i) in selectedSchema.option.columns' :key='i + "-"')
    Col(span='16')
      Row
        Col(span='11' :offset='1')
          Input(v-model='selectedSchema.option.columns[i].title' size='small' placeholder='标题')
        Col(span='11' :offset='1')
          Input(v-model='selectedSchema.option.columns[i].key' size='small' placeholder='字段key')
        Col(span='11' :offset='1')
          Select(v-model='selectedSchema.option.columns[i].type' size='small' placeholder='类型')
            Option(value='html') 富文本
            Option(value='index') 索引
            Option(value='selection') selection
            Option(value='expand') expand
        Col(span='11' :offset='1')
          Select(v-model='selectedSchema.option.columns[i].align' size='small' placeholder='对齐方式')
            Option(value='left') 左对齐
            Option(value='center') 居中对齐
            Option(value='right') 右对齐
    Col(span='7' offset='1').ep-setting-move-btn
      move-btn(
        :list='selectedSchema.option.columns'
        :index='i'
        @on-move-up='onMoveUp'
        @on-move-down='onMoveDown'
        @on-delete='onDelete'
        @on-add='onAdd'
      )
  h5 分页
  FormItem(label='分页大小')
    InputNumber(v-model='selectedSchema.option.page.size' size='small' :step='1' :min='1' :max='100')

  FormItem(label='显示总数')
    i-switch(v-model='selectedSchema.option.page.showTotal')
      span(slot='open') 是
      span(slot='close') 否

  FormItem(label='分页位置')
    Select(v-model='selectedSchema.option.page.position' size='small')
      Option(value='left') 左对齐
      Option(value='center') 居中
      Option(value='right') 右对齐

  data-source(:store='store' @success='onSuccess' worker-action='tableFetch')

  slot
</template>
<script>
import settingExtend from '../../extends/setting'
import DataSource from '../../components/data-source'
import MoveBtn from '../../components/move-btn'

export default {
  components: {
    DataSource,
    MoveBtn
  },
  extends: settingExtend,
  methods: {
    onMoveUp (index) {
      const { key, option } = this.selectedSchema
      const columns = [...option.columns]
      columns.splice(index - 1, 1, ...columns.splice(index, 1, columns[index - 1]))

      this.store.updateWidgetOption(key, { columns })
    },

    onMoveDown (index) {
      const { key, option } = this.selectedSchema
      const columns = [...option.columns]
      columns.splice(index, 1, ...columns.splice(index + 1, 1, columns[index]))

      this.store.updateWidgetOption(key, { columns })
    },

    onDelete (index) {
      const { key, option } = this.selectedSchema
      option.columns.splice(index, 1)

      this.store.updateWidgetOption(key, { columns: option.columns })
    },

    onAdd (index) {
      const { key, option } = this.selectedSchema
      const defaultValue = { type: 'html', title: `标题${index + 1}`, key: '', align: 'left' }
      option.columns.splice(index + 1, 0, defaultValue)

      this.store.updateWidgetOption(key, { columns: option.columns })
    },

    onSuccess (res) {
      // TODO: should check format about response
      const key = this.selectedSchema.key
      const option = { page: res.page, dynamicData: res.data }

      this.store.updateWidgetOption(key, { columns: option.columns })
    }
  }
}
</script>
