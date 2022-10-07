<template>
  <div
    style="width: 334px; height: 742px; color: white"
    class="phone_app"
  >
    <PhoneTitle
      :title="''"
      background-color="#fffff"
      color="white"
      @back="onBack"
    />
    <div style=" color: black; margin-left: 4%; margin-top: 12%; margin-right: 22%; font-size: 30px; font-family: 'SFPro Bold', 'Helvetica Neue', sans-serif; " >Mağaza</div>
    <!--<div
      style="backgroundColor: white;"
      class="elements"
      @contextmenu.prevent="addChannelOption"
    >
      <div>
        <div
          v-for="(elem, key) in appstoreChannels"
          :key="elem.channel"
          :class="{ select: key === currentSelect}"
          class="elem-title"
        >
          <h3 style="margin-left: 7px; font-size: 16px; font-weight: 400;">
            {{ elem.channel }}
          </h3>
        </div>
      </div>
    </div>

    v-if="but.channel == elem.name"
    this.appstoreChannels[this.currentSelect].channel
    -->
    <div class="app">
      <div class="app"
        v-for="(elem, key) in AppStoreApps"
        :key="elem.channel"
        :name="elem.name"
        :class="{ select: key === currentSelect}"
      >
      <img class="appimg" style=" float: left;" :src="elem.icons">
      <div style="color: black;float: left;margin-top: 2%;margin-left: 4%;font-family: 'SFPro Bold', 'Helvetica Neue', sans-serif;">{{ elem.intlName }}<p style="width: 130px; overflow: hidden; margin-top: 2%;font-size: 13px; color: dimgray;">{{elem.desc}}</p></div>
      <div>
        <button 
        v-if="check(elem.name)"
        @click.stop="removeAppStoreOption(elem.name)" type="button" v-bind="{id: 'butonkaldir'+elem.name}" class="btn btn-primary">Kaldır</button>
        <button 
        v-else
        @click.stop="addAppStoreOption(elem.name)" v-bind="{id: 'butonyukle'+elem.name}" type="button"  class="btn btn-primary">Yükle</button>
        </div>
      </div>
    </div>
    <HomeButton/>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import Modal from '@/components/Modal/index.js'
import PhoneTitle from './../PhoneTitle'
import HomeButton from './../HomeButton'

export default {
  components: {PhoneTitle, HomeButton},
  data: function () {
    return {
      currentSelect: 0,
      ignoreControls: false
    }
  },
  computed: {
    ...mapGetters(['IntlString', 'useMouse', 'appstoreChannels', 'AppStoreApps'])
  },
  watch: {
    list: function () {
      this.currentSelect = 0
    }
  },
  created() {
    if (!this.useMouse) {
      this.$bus.$on('keyUpArrowDown', this.onDown)
      this.$bus.$on('keyUpArrowUp', this.onUp)
      this.$bus.$on('keyUpArrowRight', this.onRight)
      this.$bus.$on('keyUpEnter', this.onEnter)
      this.$bus.$on('keyUpBackspace', this.onBack)
    } else {
      this.currentSelect = -1
    }
  },
  beforeDestroy() {
    this.$bus.$off('keyUpArrowDown', this.onDown)
    this.$bus.$off('keyUpArrowUp', this.onUp)
    this.$bus.$off('keyUpArrowRight', this.onRight)
    this.$bus.$off('keyUpEnter', this.onEnter)
    this.$bus.$off('keyUpBackspace', this.onBack)
  },
  methods: {
    ...mapActions(['appstoreAddChannel', 'appstoreRemoveChannel']),
    scrollIntoViewIfNeeded() {
      this.$nextTick(() => {
        const $select = this.$el.querySelector('.select')
        if ($select !== null) {
          $select.scrollIntoViewIfNeeded()
        }
      })
    },
    onUp() {
      if (this.ignoreControls === true) return
      this.currentSelect = this.currentSelect === 0 ? 0 : this.currentSelect - 1
      this.scrollIntoViewIfNeeded()
    },
    onDown() {
      if (this.ignoreControls === true) return
      this.currentSelect = this.currentSelect === this.appstoreChannels.length - 1 ? this.currentSelect : this.currentSelect + 1
      this.scrollIntoViewIfNeeded()
    },
    async onRight() {
      if (this.ignoreControls === true) return
      this.ignoreControls = true
      let choix = [
        {id: 1, title: this.IntlString('APP_DARKTCHAT_NEW_NOTE'), icons: 'plus', color: 'dodgerblue'},
        {id: 2, title: this.IntlString('APP_DARKTCHAT_DELETE_NOTE'), icons: 'minus', color: 'tomato'},
        {id: 3, title: this.IntlString('APP_DARKTCHAT_CANCEL'), icons: 'undo'}
      ]
      if (this.appstoreChannels.length === 0) {
        choix.splice(1, 1)
      }
      const rep = await Modal.CreateModal({choix})
      this.ignoreControls = false
      switch (rep.id) {
        case 1:
          await this.addChannelOption()
          break
        case 2:
          await this.removeChannelOption()
          break
        case 3 :
      }
    },
    async onEnter() {
      if (this.ignoreControls === true) return
      if (this.appstoreChannels.length === 0) {
        this.ignoreControls = true
        let choix = [
          {id: 1, title: this.IntlString('APP_DARKTCHAT_NEW_CHANNEL'), icons: 'plus', color: 'green'},
          {id: 3, title: this.IntlString('APP_DARKTCHAT_CANCEL'), icons: 'undo'}
        ]
        const rep = await Modal.CreateModal({choix})
        this.ignoreControls = false
        if (rep.id === 1) {
          await this.addChannelOption()
        }

      }
    },
    showChannel(channel) {
      this.$router.push({name: 'appstore.channel.show', params: {channel}})
    },
    onBack() {
      if (this.ignoreControls === true) return
      this.$router.push({name: 'home'})
    },
    async addChannelOption() {
      try {
        const rep = await Modal.CreateTextModal({limit: 280, title: this.IntlString('APP_DARKTCHAT_NEW_CHANNEL')})
        let channel = (rep || {}).text || ' '
        if (channel.length > 0) {
          this.currentSelect = 0
          this.appstoreAddChannel({channel})
        }
      } catch (e) {
        await this.$phoneAPI.log(e)
      }
    },
    check(isim){
      //console.log("sasdasd")
      for (let i = 0; i < this.appstoreChannels.length; i++) {
        //console.log(this.appstoreChannels[i].channel)
        if (this.appstoreChannels[i].channel == isim){
          //console.log("girdii")
          return true
        }
      }
    },
    addAppStoreOption(isim) {
      try {
        var channel = isim
        if (channel.length > 0) {
          console.log("saa")
          document.getElementById("butonyukle"+channel).textContent = "Yükleniyor"
          setTimeout(() => {  console.log("World!"); 
          this.appstoreAddChannel({channel})
          document.getElementById("butonyukle"+channel).textContent = "Kaldır";
          }, 2000)
          
        }
      } catch (e) {
         this.$phoneAPI.log(e)
      }
    },
    removeAppStoreOption(isim) {
      var channel = isim
      this.currentSelect = 0
     // this.appstoreRemoveChannel({channel})
      document.getElementById("butonkaldir"+channel).textContent = "Kaldırılıyor"
        setTimeout(() => {  console.log("World!"); 
        this.appstoreRemoveChannel({channel})
        document.getElementById("butonkaldir"+channel).textContent = "Yükle";
      }, 2000)
    },
    async removeChannelOption() {
      const channel = this.appstoreChannels[this.currentSelect].channel
      this.currentSelect = 0
      this.appstoreRemoveChannel({channel})
    }

  }
}
</script>

<style scoped>
.list {
  height: 100%;
}

.app{
  margin-top: 4%;
  overflow-y: auto;
}
.appimg{
  width: 64px;
  margin-left: 3%;
}

.title {
  padding-top: 22px;
  padding-left: 16px;
  height: 54px;
  line-height: 34px;
  font-weight: 700;
  color: white;
}

.elements {
  height: calc(100% - 54px);
  overflow-y: auto;
  background-color: #20201d;
  color: #34302f
}

.btn-primary {
    color: #007bff;
    background-color: rgba(238,238,239,1);
    /*border-color: #007bff;*/
}

.btn {
  display: inline-block;
  font-weight: 400;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  border: 1px solid transparent;
  padding: 0.0975rem 0.7rem;
  font-size: 71%;
  line-height: 1.5;
  border-radius: 20rem;
  /* border-radius: 0.25rem; */
  transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
  font-family: "SFPro Medium", "Helvetica Neue", sans-serif;
  margin-top: 6%;
  margin-right: 5%;
  float: right;
}

.element {
  margin-top: 50px;
  height: 42px;
  line-height: 42px;
  display: flex;
  align-items: center;
  position: relative;
}

.elem-title {
  width: 300px;
  font-size: 20px;
  transition: .15s;
  font-weight: 200;
  color: #34302f;
  margin-left: 13px;
  border-radius: 13px;

}

.elem-title .diese {
  color: #34302f;
  font-size: 22px;
  font-weight: 700;
  line-height: 40px;
}

.elem-title.select, .elem-title:hover {
  background-color: rgba(112, 108, 108, 0.1);
  color: #34302f;

}

.element.select .elem-title, .element:hover .elem-title {
  margin-left: 12px;
}

.element.select .elem-title .diese, .element:hover .elem-title .diese {
  color: #f8d344;
}

.elements::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #F5F5F5;
}

.elements::-webkit-scrollbar {
  width: 3px;
  background-color: transparent;
}

.elements::-webkit-scrollbar-thumb {
  background-color: white;
}
</style>
