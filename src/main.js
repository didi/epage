import {
  Rule,
  Worker,
  Event,
  helper,
  constant,
  Store,
  schema,
  Logic,
  TypeBuilder
} from 'epage-core'
import Epage from './Design.js'
import * as setting from './widget/setting'
import widget from './widget'

Epage.Rule = Rule
Epage.Worker = Worker
Epage.Event = Event
Epage.Store = Store
Epage.TypeBuilder = TypeBuilder
Epage.constant = constant
Epage.helper = helper
Epage.schema = schema
Epage.widget = widget
Epage.setting = setting
Epage.Logic = Logic

export default Epage
