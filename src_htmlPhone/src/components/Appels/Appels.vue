<template>
  <div
    style="width: 326px; height: 743px;"
    class="phone_app"
  >
    <PhoneTitle
      :title="IntlString('APP_PHONE_TITLE')"
      @back="onBackspace"
    />
    <div class="content">
      <component :is="subMenu[currentMenuIndex].Comp" />
    </div>
    <div class="subMenu">
      <div
        v-for="(Comp, i) of subMenu"
        :key="i"
        class="subMenu-elem"
        :style="getColorItem(i)"
        @click="swapMenu(i)"
      >
        <div class="subMenu-icon">
          <FontAwesomeIcon
            :icon="['fas', Comp.icon]"
            @click.stop="swapMenu(i)"
          />
        </div>
        <span
          class="subMenu-name"
          @click.stop="swapMenu(i)"
        >{{ Comp.name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import PhoneTitle from './../PhoneTitle'
import AppelsFavoris from './AppelsFavoris'
import AppelsContacts from './AppelsContacts'
import AppelsRecents from './AppelsRecents'

export default {
  components: {
    PhoneTitle
  },
  data () {
    return {
      currentMenuIndex: 1
    }
  },
  computed: {
    ...mapGetters(['IntlString', 'useMouse', 'themeColor']),
    subMenu () {
      return [{
        Comp: AppelsFavoris,
        name: this.IntlString('APP_PHONE_MENU_FAVORITES'),
        icon: 'star'
      }, {
        Comp: AppelsRecents,
        name: this.IntlString('APP_PHONE_MENU_RECENTS'),
        icon: 'clock'
      }, {
        Comp: AppelsContacts,
        name: this.IntlString('APP_PHONE_MENU_CONTACTS'),
        icon: 'user'
      }]
    }
  },

  created () {
    if (!this.useMouse) {
      this.$bus.$on('keyUpBackspace', this.onBackspace)
      this.$bus.$on('keyUpArrowLeft', this.onLeft)
      this.$bus.$on('keyUpArrowRight', this.onRight)
    }
  },
  beforeDestroy () {
    this.$bus.$off('keyUpBackspace', this.onBackspace)
    this.$bus.$off('keyUpArrowLeft', this.onLeft)
    this.$bus.$off('keyUpArrowRight', this.onRight)
  },
  methods: {
    getColorItem (index) {
      if (this.currentMenuIndex === index) {
        return {
          color: this.themeColor
        }
      }
      return {}
    },
    swapMenu (index) {
      this.currentMenuIndex = index
    },
    onLeft () {
      this.currentMenuIndex = Math.max(this.currentMenuIndex - 1, 0)
    },
    onRight () {
      this.currentMenuIndex = Math.min(this.currentMenuIndex + 1, this.subMenu.length - 1)
    },
    onBackspace: function () {
      if (this.ignoreControls === true) return
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
.title{
  padding-left: 16px;
  height: 34px;
  line-height: 34px;
  font-weight: 700;
  color: white;
  background-color: #2c3e50;
}
.content{
  height: calc(100% - 68px);
  overflow-y: auto;
  width: 337px;
}
.subMenu{
  border-top: 1px solid rgba(0,0,0,0.24);
  display: flex;
  height: 56px;
}
.subMenu-elem {
  width: 100%;
  text-align: center;
  line-height: 56px;
  height: 56px;
  display: flex;
  color: #959595;
  flex-direction: column;
}
.subMenu-elem-select, .subMenu-elem:hover {
  color: #007aff;
}
.subMenu-icon{
  margin-top: 6px;
  font-size: 22px;
  line-height: 22px;
  height: 22px;
}
.subMenu-name{
  display: block;
  font-size: 14px;
  height: 14px;
  line-height: 14px;
}
</style>
