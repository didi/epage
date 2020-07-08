import EventLogic from './EventLogic'
import ValueLogic from './ValueLogic'

export default class Logic {
  constructor () {
    this.map = {
      event: new EventLogic(),
      value: new ValueLogic()
    }
  }

  /**
   * compare the difference between logic value and model value
   * @param {Array} valueLogics list for value logics
   * @param {Object} model form data
   */
  diffValueLogics (valueLogics, model) {
    const patches = []

    for (let j = 0; j < valueLogics.length; j++) {
      const logic = valueLogics[j]
      const valueValidator = this.map.value.map[logic.action]

      if (!valueValidator) {
        continue
      }

      for (const i in model) {
        // should be the same key
        if (i !== logic.key) {
          continue
        }
        const validation = valueValidator.validator(model[i], logic.value)
        const patch = {}
        // validate faild
        if (!validation) {
          continue
        }

        for (let k = 0; k < logic.effects.length; k++) {
          const effect = logic.effects[k]
          const props = {}

          if (!this.checkEffect(effect, logic.key)) {
            continue
          }

          effect.properties.forEach(_ => {
            props[_.key] = _.value
          })
          patch[effect.key] = props
        }
        Object.keys(patch).length && patches.push(patch)
      }
    }

    return patches
  }

  /**
   * compare the difference between logic event and real event
   * @param {Array} eventLogics list for value logics
   * @param {String} eventType event type like on-click. should start with on-
   */
  diffEventLogics (eventLogics, eventType) {
    const patches = []

    for (let i = 0; i < eventLogics.length; i++) {
      const logic = eventLogics[i]
      const patch = {}
      // get event type: on-click => click
      if (logic.action !== eventType.slice(3)) {
        continue
      }

      for (let j = 0; j < logic.effects.length; j++) {
        const effect = logic.effects[j]
        const props = {}

        if (!this.checkEffect(effect, logic.key)) {
          continue
        }

        effect.properties.forEach(_ => {
          props[_.key] = _.value
        })
        patch[effect.key] = props
      }

      Object.keys(patch).length && patches.push(patch)
    }

    return patches
  }

  /**
   * apply properties to schema
   * @param {Object} flatSchemas flated schema like { 'ksddf': { widget: 'input', ...}}
   * @param {Array} patches properties that should be updated
   */
  applyPatches (flatSchemas, patches = []) {
    patches.forEach(patch => {
      for (const key in patch) {
        Object.assign(flatSchemas[key], patch[key])
      }
    })
  }

  /**
   * check the validity of the effect
   * @param {Object} effect affected properties
   * @param {String} key schema key
   */
  checkEffect (effect, key) {
    return effect.key && key !== effect.key && Array.isArray(effect.properties)
  }
}
