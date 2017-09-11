import App from './App'
import store from './store'
import Vue from 'vue'
import auth from './auth'
import I18n from './I18n'
import { languages } from 'config'

// © http://stackoverflow.com/a/979995
const httpGetParams = (function() {
  const queryString = {},
        pairs = window.location.search.substring(1).split('&').map(v => v.split('='))

  pairs.forEach(([k, v]) => {
    if (!queryString[k]) {
      // First entry with this name
      queryString[k] = decodeURIComponent(v)
    } else if (typeof queryString[k] === 'string') {
      // Second entry with this name
      queryString[k] = [queryString[k], decodeURIComponent(v)]
    } else {
      // Third or later entry with this name
      queryString[k].push(decodeURIComponent(v))
    }
  })
  return queryString
})()

// initialize the internationalization plugin on the vue instance.
Vue.use(I18n.plugin, store)

// const lang = httpGetParams.lang || 'en'
// Vue.i18n.load(lang, `../static/configuration/locale/${lang}.json`).catch(e => alert(e))
// Vue.i18n.set(lang)
// // TODO set fallback language

// /* eslint-disable no-new */
// new Vue({
//   el: '#app',
//   store,
//   render: h => h(App)
// })

// Set the language and load the language file
const languageCodes = languages.map(l => l.id)
let lang
let navigatorLanguage = (navigator.language || navigator.userLanguage)
if (navigatorLanguage) {
  navigatorLanguage = navigatorLanguage.substr(0, navigatorLanguage.indexOf('-'))
}
if (languageCodes.indexOf(httpGetParams.lang) !== -1) {
  lang = httpGetParams.lang
} else if (navigatorLanguage && languageCodes.indexOf(navigatorLanguage) !== -1) {
  lang = navigatorLanguage
} else {
  lang = languageCodes[0]
}
Vue.i18n.set(lang)
// TODO set fallback language

/* eslint-disable no-new */
const app = new Vue({
  el: '#app',
  data: { loaded: false },
  store,
  render: h => h(App)
})

Vue.i18n.load(lang, `../static/configuration/locale/${lang}.json`)
  .then(() => { app.loaded = true })
  .catch(e => alert('Error loading language file: ' + e))

// Check the users auth status when the app starts
auth.checkAuth()
