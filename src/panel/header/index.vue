<template lang="pug">
.ep-header-container
  .ep-header(
    v-if='header.render'
    ref='header'
    :style='header.style || ""'
  )

  .ep-header(
    v-else
    :style='header.style || ""'
  )
    //- left
    .ep-header-left(
      v-if='header.left && header.left.render'
      ref='left'
      :style='(header.left || {}).style || ""'
    )

    .ep-header-left(v-else :style='(header.left || {}).style || ""') Epage

    //- center
    .ep-header-center(
      v-if='header.center && header.center.render'
      ref='center'
      :style='(header.center || {}).style || ""'
    )

      //- select(@change='onChangeLange')
      //-   option(value='zh') 简体中文
      //-   option(value='en') English

    .ep-header-center(v-else :style='(header.center || {}).style || ""')
      RadioGroup(
        v-if='ready.pc && ready.mobile'
        v-model='designView.view'
        type='button'
        size='small'
        @on-change='onChangeView'
      )
        Radio(label='pc') PC
        Radio(label='mobile') H5

    //- right
    .ep-header-right(
      v-if='header.right && header.right.render'
      ref='right'
      :style='(header.right || {}).style || ""'
    )

    .ep-header-right(v-else :style='(header.right || {}).style || ""')
      Button.ep-header-right-item(
        v-if='testProp("right", "logic")'
        size='small'
        type='ghost'
        @click='onShowLogic'
      ) logic
      Button.ep-header-right-item(
        v-if='testProp("right", "schema")'
        size='small'
        type='ghost'
        @click='onShowSchema'
      ) schema
      Button.ep-header-right-item(
        v-if='testProp("right", "preview")'
        size='small'
        type='ghost'
        @click='onPreview'
      ) 预览
      a.ep-header-right-item(
        v-if='testProp("right", "help")'
        href='http://epage.didichuxing.com'
        target='_blank'
      )
        i.ep-icon.ep-icon-help
        span &nbsp;帮助

</template>
<script>
export default {
  props: {
    header: {
      type: Object,
      default: () => ({})
    },
    store: {
      type: Object,
      default: () => ({ state: {} })
    },
    designView: {
      type: Object,
      default: () => ({
        view: 'pc'
      })
    },
    ready: {
      type: Object,
      default: () => ({
        pc: false,
        mobile: false
      })
    }
  },
  mounted () {
    if (this.header.render) {
      this.renderRef(this, 'header')
    } else {
      this.renderRef(this.header, 'left')
      this.renderRef(this.header, 'center')
      this.renderRef(this.header, 'right')
    }
  },
  methods: {
    testProp (prop1, prop2) {
      let result = true
      if (!this.header) return result
      const p1 = this.header[prop1]
      if (p1) {
        const p2 = this.header[prop1][prop2]
        result = p2 !== false
      }
      return result
    },
    onChangeView (view) {
      this.$emit('change-view', view)
    },
    onPreview () {
      this.$emit('preview')
    },
    onShowSchema () {
      this.$emit('show-schema')
    },
    onShowLogic () {
      this.$emit('show-logic')
    },
    onChangeLange (lang) {
      this.$emit('change-lang', lang)
    },
    renderRef (obj, ref) {
      if (!obj[ref] || typeof obj[ref].render !== 'function') return
      const el = this.$refs[ref]
      const ctx = { $emit: this.$emit.bind(this) }
      const { store } = this

      obj[ref].render({ el, store, ctx })
    }
  }
}
</script>
