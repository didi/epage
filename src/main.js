import Epage from './design/index.js'
import TypeBuilder from './modules/store/TypeBuilder'
import * as setting from './modules/widget/setting'
import {
  Rule,
  EpWorker,
  EpEvent,
  helper,
  constant,
  Store,
  Schema,
  widget
} from './modules'

Epage.Rule = Rule
Epage.Worker = EpWorker
Epage.Event = EpEvent
Epage.Store = Store
Epage.Schema = Schema
Epage.TypeBuilder = TypeBuilder
Epage.constant = constant
Epage.helper = helper
Epage.widget = widget
Epage.setting = setting

export default Epage
