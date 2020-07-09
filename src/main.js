import {
  Rule,
  Worker,
  Event,
  Store,
  Logic,
  TypeBuilder,
  constant,
  helper,
  schema
} from 'epage-core'
import Epage from './Design.js'
import * as setting from './widget/setting'
import widget from './widget'

Epage.Rule = Rule
Epage.Worker = Worker
Epage.Event = Event
Epage.Store = Store
Epage.Logic = Logic
Epage.TypeBuilder = TypeBuilder
Epage.constant = constant
Epage.helper = helper
Epage.schema = schema
Epage.setting = setting
Epage.widget = widget

export default Epage
