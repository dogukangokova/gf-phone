<template>
  <div
    style="width: 326px; height: 743px;"
    class="screen"
  >
    <list
      style="color: black"
      :list="messagesData"
      :disable="disableList"
      :title="IntlString('APP_MESSAGE_TITLE')"
      @back="back"
      @select="onSelect"
      @option="onOption"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { generateColorForStr } from '@/Utils'
import Modal from '@/components/Modal/index.js'
import List from '@/components/List'

export default {
  components: {
    List
  },
  data () {
    return {
      disableList: false
    }
  },
  computed: {
    ...mapGetters(['IntlString', 'useMouse', 'contacts', 'messages']),
    messagesData: function () {
      let messages = this.messages
      let contacts = this.contacts
      let messGroup = messages.reduce((rv, x) => {
        if (rv[x['transmitter']] === undefined) {
          const data = {
            noRead: 0,
            lastMessage: 0,
            display: x.transmitter
          }
          let contact = contacts.find(e => e.number === x.transmitter)
          data.unknowContact = contact === undefined
          if (contact !== undefined) {
            data.display = contact.display
            data.backgroundColor = contact.backgroundColor || generateColorForStr(x.transmitter)
            data.letter = contact.letter
            data.icon = contact.icon
          } else {
            data.backgroundColor = generateColorForStr(x.transmitter)
          }
          rv[x['transmitter']] = data
        }
        if (x.isRead === 0) {
          rv[x['transmitter']].noRead += 1
        }
        if (x.time >= rv[x['transmitter']].lastMessage) {
          rv[x['transmitter']].lastMessage = x.time
          rv[x['transmitter']].keyDesc = x.message
        }
        return rv
      }, {})
      let mess = []
      Object.keys(messGroup).forEach(key => {
        mess.push({
          display: messGroup[key].display,
          puce: messGroup[key].noRead,
          number: key,
          lastMessage: messGroup[key].lastMessage,
          keyDesc: messGroup[key].keyDesc,
          backgroundColor: messGroup[key].backgroundColor,
          icon: messGroup[key].icon,
          letter: messGroup[key].letter,
          unknowContact: messGroup[key].unknowContact
        })
      })
      mess.sort((a, b) => b.lastMessage - a.lastMessage)
      return [this.newMessageOption, ...mess]
    },
    newMessageOption () {
      return {
        backgroundColor: '#C0C0C0',
        display: this.IntlString('APP_MESSAGE_NEW_MESSAGE'),
        letter: '+',
        id: -1
      }
    }
  },
  created () {
    this.$bus.$on('keyUpBackspace', this.back)
  },
  beforeDestroy () {
    this.$bus.$off('keyUpBackspace', this.back)
  },
  methods: {
    ...mapActions(['deleteMessagesNumber', 'deleteAllMessages', 'startCall']),
    onSelect: function (data) {
      if (data.id === -1) {
        this.$router.push({name: 'messages.selectcontact'})
      } else {
        this.$router.push({name: 'messages.view', params: data})
      }
    },
    onOption: function (data) {
      if (data.number === undefined) return
      this.disableList = true
      Modal.CreateModal({
        choix: [
          {id: 4, title: this.IntlString('APP_PHONE_CALL'), icons: 'phone'},
          {id: 5, title: this.IntlString('APP_PHONE_CALL_ANONYMOUS'), icons: 'mask'},
          {id: 6, title: this.IntlString('APP_MESSAGE_NEW_MESSAGE'), icons: 'sms'},
          {id: 1, title: this.IntlString('APP_MESSAGE_ERASE_CONVERSATION'), icons: 'trash', color: 'orange'},
          /* {id: 2, title: this.IntlString('APP_MESSAGE_ERASE_ALL_CONVERSATIONS'), icons: 'trash', color: 'red'},
          {id: 3, title: this.IntlString('CANCEL'), icons: 'undo'} */
           {id: 2, title: this.IntlString('APP_MESSAGE_ERASE_ALL_CONVERSATIONS'), icons: 'trash', color: 'red'}
        ]
        .concat(data.unknowContact ? [{id: 7, title: this.IntlString('APP_MESSAGE_SAVE_CONTACT'), icons: 'save'}] : [])
        .concat([{id: 3, title: this.IntlString('CANCEL'), icons: 'undo'}])
      }).then(rep => {
        if (rep.id === 1) {
          this.deleteMessagesNumber({num: data.number})
        } else if (rep.id === 2) {
          this.deleteAllMessages()
        } else if (rep.id === 4) {
          this.startCall({ numero: data.number })
        } else if (rep.id === 5) {
          this.startCall({ numero: '#' + data.number })
        } else if (rep.id === 6) {
          this.$router.push({name: 'messages.view', params: data})
        } else if (rep.id === 7) {
          this.$router.push({name: 'contacts.view', params: {id: 0, number: data.number}})
        }
        this.disableList = false
      })
    },
    back: function () {
      if (this.disableList === true) return
      this.$router.push({ name: 'home' })
    }
  }
}
</script>

<style scoped>
.screen{
  position: relative;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
</style>
