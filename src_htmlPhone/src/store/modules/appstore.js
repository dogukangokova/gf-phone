import PhoneAPI from './../../PhoneAPI'

const LOCAL_NAME = 'gc_appstore_channels'
import {Howl} from 'howler'

let AppStoreAudio = null

const state = {
  channels: JSON.parse(localStorage[LOCAL_NAME] || null) || [],
  currentChannel: null,
  messagesChannel: []
}

const getters = {
  appstoreChannels: ({channels}) => channels,
  appstoreCurrentChannel: ({currentChannel}) => currentChannel,
  appstoreMessages: ({messagesChannel}) => messagesChannel
}

const actions = {
  appstoreReset({commit}) {
    commit('APPSTORE_SET_MESSAGES', {messages: []})
    commit('APPSTORE_SET_CHANNEL', {channel: null})
    commit('APPSTORE_REMOVES_ALL_CHANNELS')
  },
  appstoreSetChannel({state, commit, dispatch}, {channel}) {
    if (state.currentChannel !== channel) {
      commit('APPSTORE_SET_MESSAGES', {messages: []})
      commit('APPSTORE_SET_CHANNEL', {channel})
      dispatch('appstoreGetMessagesChannel', {channel})
    }
  },
  appstoreAddMessage({state, commit, getters}, {message}) {
    const channel = message.channel
    if (state.channels.find(e => e.channel === channel) !== undefined) {
      if (AppStoreAudio !== null) {
        AppStoreAudio.pause()
        AppStoreAudio = null
      }
      AppStoreAudio = new Howl({
        src: '/html/static/sound/tchatNotification.ogg',
        volume: getters.volume
      })
      AppStoreAudio.play()
    }
    commit('APPSTORE_ADD_MESSAGES', {message})
  },
  appstoreAddChannel({commit}, {channel}) {
    commit('APPSTORE_ADD_CHANNELS', {channel})
  },
  appstoreRemoveChannel({commit}, {channel}) {
    commit('APPSTORE_REMOVES_CHANNELS', {channel})
  },
  // eslint-disable-next-line no-unused-vars
  appstoreGetMessagesChannel({commit}, {channel}) {
    PhoneAPI.appstoreGetMessagesChannel(channel)
  },
  appstoreSendMessage(state, {channel, message}) {
    PhoneAPI.appstoreSendMessage(channel, message)
  }
}

const mutations = {
  APPSTORE_SET_CHANNEL(state, {channel}) {
    state.currentChannel = channel
  },
  APPSTORE_ADD_CHANNELS(state, {channel}) {
    state.channels.push({
      channel
    })
    localStorage[LOCAL_NAME] = JSON.stringify(state.channels)
  },
  APPSTORE_REMOVES_CHANNELS(state, {channel}) {
    state.channels = state.channels.filter(c => {
      return c.channel !== channel
    })
    localStorage[LOCAL_NAME] = JSON.stringify(state.channels)
  },
  APPSTORE_REMOVES_ALL_CHANNELS(state) {
    state.channels = []
    localStorage[LOCAL_NAME] = JSON.stringify(state.channels)
  },
  APPSTORE_ADD_MESSAGES(state, {message}) {
    if (message.channel === state.currentChannel) {
      state.messagesChannel.push(message)
    }
  },
  APPSTORE_SET_MESSAGES(state, {messages}) {
    state.messagesChannel = messages
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}

if (process.env.NODE_ENV !== 'production') {
  state.currentChannel = 'debug'
  state.messagesChannel = JSON.parse('[{"channel":"teste","message":"teste","id":6,"time":1528671680000},{"channel":"teste","message":"Hop","id":5,"time":1528671153000}]')
  for (let i = 0; i < 200; i++) {
    state.messagesChannel.push(Object.assign({}, state.messagesChannel[0], {id: 100 + i, message: 'mess ' + i}))
  }
  state.messagesChannel.push({
    message: 'Message sur plusieur ligne car il faut bien !!! Ok !',
    id: 5000,
    time: new Date().getTime()
  })
  state.messagesChannel.push({
    message: 'Message sur plusieur ligne car il faut bien !!! Ok !',
    id: 5000,
    time: new Date().getTime()
  })
  state.messagesChannel.push({
    message: 'Message sur plusieur ligne car il faut bien !!! Ok !',
    id: 5000,
    time: new Date(4567845).getTime()
  })
}
