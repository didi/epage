import Properties from './properties'

export default class Effect {
  constructor () {
    // schema key for effected widgets
    this.key = ''
    // properties for effected  effected widgets
    this.properties = [
      new Properties('hidden', false),
      new Properties('disabled', false)
    ]
  }
}
