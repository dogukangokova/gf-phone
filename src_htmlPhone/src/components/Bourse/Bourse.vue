<template>
  <div class="phone_app">
    <PhoneTitle
      :title="IntlString('APP_BOURSE_TITLE')"
      @back="onBackspace"
    />
    <div class="elements">
      <div
        v-for="(elem, key) in bourseInfo"
        :key="key"
        class="element"
        :class="{ select: key === currentSelect}"
      >
        <div class="elem-evo">
          <FontAwesomeIcon
            :icon="['fas', classInfo(elem)[0]]"
            @click.stop="openMenu(i)"
          />
        </div>
        <div class="elem-libelle">
          {{ elem.libelle }}
        </div>
        <div
          class="elem-price"
          :style="{color: colorBourse(elem)[1]}"
        >
          {{ elem.price }} $
        </div>
        <div
          class="elem-difference"
          :style="{color: colorBourse(elem)[1]}"
        >
          <span v-if="elem.difference > 0">+</span>{{ elem.difference }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PhoneTitle from './../PhoneTitle'

export default {
  components: {
    PhoneTitle
  },
  data () {
    return {
      currentSelect: 0
    }
  },
  computed: {
    ...mapGetters(['IntlString', 'useMouse', 'bourseInfo'])
  },
  created () {
    if (!this.useMouse) {
      this.$bus.$on('keyUpArrowDown', this.onDown)
      this.$bus.$on('keyUpArrowUp', this.onUp)
    }
    this.$bus.$on('keyUpBackspace', this.onBackspace)
  },
  beforeDestroy () {
    this.$bus.$off('keyUpArrowDown', this.onDown)
    this.$bus.$off('keyUpArrowUp', this.onUp)
    this.$bus.$off('keyUpBackspace', this.onBackspace)
  },
  methods: {
    scrollIntoViewIfNeeded: function () {
      this.$nextTick(() => {
        this.$el.querySelector('.select').scrollIntoViewIfNeeded()
      })
    },
    colorBourse (bouseItem) {
      if (bouseItem.difference === 0) {
        return '#007aff'
      } else if (bouseItem.difference < 0) {
        return '#2e7d32'
      } else {
        return '#c62828'
      }
    },
    classInfo (bouseItem) {
      if (bouseItem.difference === 0) {
        return ['arrow-right', 'iblue']
      } else if (bouseItem.difference < 0) {
        return ['arrow-up', 'ired']
      } else {
        return ['arrow-down', 'igreen']
      }
    },
    onBackspace () {
      this.$router.push({ name: 'home' })
    },
    onUp () {
      this.currentSelect = this.currentSelect === 0 ? 0 : this.currentSelect - 1
      this.scrollIntoViewIfNeeded()
    },
    onDown () {
      this.currentSelect = this.currentSelect === this.bourseInfo.length - 1 ? this.currentSelect : this.currentSelect + 1
      this.scrollIntoViewIfNeeded()
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
  background-color: rgb(76, 175, 80);
}
.elements{
  height: calc(100% - 34px);
  overflow-y: auto;
}
.element{
  height: 56px;
  width: 100%;
  line-height: 56px;
  display: flex;
  position: relative;
}
.element.select{
   background-color: #DDD;
}

.element .elem-evo{
  color: #2e7d32;
  font-size: 18px;
  margin-left: 6px;
}
.element .fa-arrow-down{
  color: #c62828;
}
.element .fa-arrow-right{
  color: #1565c0;
}

.elem-libelle{
   padding-left: 6px;
  flex: 1;
  white-space: nowrap;
  font-weight: 100;
  font-size: 15px;
}

.elem-price{
 text-align: center;
  width: 90px;
  font-weight: 100;
  font-size: 15px;
}

.elem-difference{
  text-align: center;
  width: 60px;
  font-size: 14px;
  font-weight: 100;
}

</style>
