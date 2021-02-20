<template lang="pug">
setting-form(:store='store' :setting='setting')
</template>
<script>
import { setting } from 'epage-core'

const { SettingForm, settingExtend } = setting

export default {
  components: { SettingForm },
  extends: settingExtend,
  methods: {}
}
</script>
