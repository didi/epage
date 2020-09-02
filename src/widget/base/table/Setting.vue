<template lang="pug">
setting-form(:store='store' :setting='setting')
  span(slot='rule')
  span(slot='placeholder')

  FormItem(v-if='!$slots.noDataText' label='空内容文案')
    Input(v-model='selectedSchema.option.noDataText' size='small')
  template(v-else)
    slot(name='noDataText')

  h5 定义表头
  Row.ep-setting-table-header(v-for='(column, i) in selectedSchema.option.columns' :key='i + "-"')
    Col(span='16')
      Row
        Col(span='11' :offset='1')
          Input(v-model='column.title' size='small' placeholder='标题')
        Col(span='11' :offset='1')
          Input(v-model='column.key' size='small' placeholder='字段key')
        Col(span='11' :offset='1')
          Select(v-model='column.type' size='small' placeholder='类型')
            Option(value='html') 富文本
            Option(value='index') 索引
            Option(value='selection') selection
            Option(value='expand') expand
        Col(span='11' :offset='1')
          Select(v-model='column.align' size='small' placeholder='对齐方式')
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
    Col(span='23' offset='1' v-if='column.type === "html"')
      Input(
        type='textarea'
        placeholder='请输入return脚本'
        size='small'
        :autosize='{ minRows: 3 }'
        v-model='column.render'
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

const defaultCol = (index) => ({
  type: 'html',
  title: `标题${index + 1}`,
  key: '',
  align: 'left'
})
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
      const defaultValue = defaultCol(index)
      option.columns.splice(index + 1, 0, defaultValue)

      this.store.updateWidgetOption(key, { columns: option.columns })
    },

    onSuccess (res) {
      // TODO: should check format about response
      const { key, option: schemaOption } = this.selectedSchema
      const page = Object.assign({}, schemaOption.page, res.page)
      const option = {
        page,
        dynamicData: res.data
      }

      this.store.updateWidgetOption(key, option)
    }
  }
}
</script>
