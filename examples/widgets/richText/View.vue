<template lang="pug">
.ep-widget
  template(v-if='mode === "display"')
    span {{model[schema.key]}}

  template(v-else)
    div(ref='toolbar')
    div(ref='editor')

</template>
<script>
import { viewExtend } from 'epage-iview'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'

export default {
  extends: viewExtend,
  mounted () {
    const { editor } = this.$refs
    const quill = new Quill(editor, {
      modules: {
        toolbar: ['bold', 'italic', 'underline', 'strike']
      },
      theme: 'snow'
    })
    quill.on('text-change', (eventName, ...args) => {
      const model = { [this.schema.key]: quill.container.firstChild.innerHTML }
      this.store.setModel(model)
    })
  }
}
</script>
