import {
  Rule,
  Worker,
  Event,
  Store,
  Logic,
  Context,
  Script,
  TypeBuilder,
  Dict,
  API,
  constant,
  helper,
  schema,
  hook,
  render,
  drag
} from 'epage-core'
import Epage from './Epage.js'

Epage.Rule = Rule
Epage.Worker = Worker
Epage.Event = Event
Epage.Store = Store
Epage.Logic = Logic
Epage.Context = Context
Epage.Script = Script
Epage.TypeBuilder = TypeBuilder
Epage.Dict = Dict
Epage.API = API
Epage.constant = constant
Epage.helper = helper
Epage.schema = schema
Epage.hook = hook
Epage.render = render
Epage.drag = drag

export default Epage
