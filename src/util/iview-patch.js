import { version } from 'iview'

export const MAIN_VERSION = parseInt(version || 2)
export const IVIEW_V3 = 3
export const IVIEW_V2 = 2

// 定义基础widget 默认icon在iview@2到iview@3的type映射
export const icon2to3 = {
  // widget icon
  edit: 'md-create',
  compose: 'ios-create-outline',
  'ios-list-outline': 'md-list',
  'android-radio-button-on': 'ios-radio-button-on',
  'android-checkbox-outline': 'ios-checkbox-outline',
  toggle: 'ios-switch',
  'ios-grid-view': 'ios-grid',
  grid: 'ios-grid-outline',
  'social-youtube-outline': 'logo-youtube',

  // operation icon
  'arrow-move': 'md-move',
  'trash-a': 'ios-trash-outline',

  // setting form icon
  'android-arrow-up': 'md-arrow-round-up',
  'android-arrow-down': 'md-arrow-round-down',
  'ios-minus-outline': 'ios-trash',
  'ios-plus-outline': 'md-add',

  // tab
  eye: 'md-eye',
  'code-working': 'md-code-working',
  network: 'md-git-network',

  // schema
  'code-download': 'md-code-download'
}

/**
 * 通过指定iview版本及提供icons映射关系得到适合当前版本的icon
 * @param {Number} version iview version
 * @param {Object} icons icon neme
 * @return {Object} key与icons相同的新icon映射关系
 */
export function getIcon (version, icons) {
  const result = {}
  if (!icons) return result
  for (const name in icons) {
    const icon = icons[name]
    if (version === IVIEW_V2) {
      result[name] = icon in icon2to3 ? icon2to3[name] : icon
    } else if (version === IVIEW_V3) {
      result[name] = getKeyByValue(icon2to3, icon)
    }
  }
}

function getKeyByValue (obj, value) {
  for (const key in obj) {
    if (obj[key] === value) {
      return key
    }
  }
}
