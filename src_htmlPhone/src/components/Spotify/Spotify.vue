<template>
  <div 
       class="phone_app" 
       style=" background-color: #0d0d0d; ">
    <PhoneTitle
      background-color="#0d0d0d"
      @back="quit"
    />
    <iframe id="player" frameBorder="0" style="width: 100%;height: 100%;"></iframe>
    <HomeButton/>
  </div>
</template>

<script>
import PhoneTitle from './../PhoneTitle'
import HomeButton from './../HomeButton'

export default {
  components: {
    PhoneTitle,
    HomeButton
  },
  data() {
    return {
      nextCursor: 'c=10',
      currentSelectPost: 0,
      posts: []
    }
  },
  computed: {
    currentPost() {
      if (this.posts && this.posts.length > this.currentSelectPost) {
        return this.posts[this.currentSelectPost]
      }
      this.loadItems()
      return undefined
    }
  },
  created: function () {
    this.$bus.$on('keyUpArrowLeft', this.previewPost)
    this.$bus.$on('keyUpArrowRight', this.nextPost)
    this.$bus.$on('keyUpBackspace', this.quit)
    setTimeout(() => {  console.log("World!"); 
        this.nextPost()
    }, 2000)
  },
  beforeDestroy: function () {
    this.$bus.$off('keyUpArrowLeft', this.previewPost)
    this.$bus.$off('keyUpArrowRight', this.nextPost)
    this.$bus.$off('keyUpBackspace', this.quit)
  },
  methods: {
    async loadItems() {
    },
    previewPost() {
      if (this.currentSelectPost === 0) {
        return 0
      }
      this.currentSelectPost -= 1
      setTimeout(() => {
        if (this.$refs.video !== undefined) {
          this.$refs.video.volume = 0.15
        }
      }, 200)
    },
    nextPost() {
        var iframe = document.getElementById('player');
        iframe.setAttribute('allow', "autoplay; fullscreen *; encrypted-media;");
        iframe.src = "http://localhost:3000/player"//"https://harmonious-macaron-6c307b.netlify.app";
    },
    onClick($event) {
      if ($event.offsetX < 200) {
        this.previewPost()
      } else {
        this.nextPost()
      }
    },
    quit: function () {
      this.$router.push({name: 'home'})
    }
  }
}
</script>

<style scoped lang="scss">
.post {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .post-title {
    padding-left: 12px;
    font-size: 18px;
    height: 18px;
    overflow: hidden;
  }

  .post-content {
    display: flex;
    width: 390px;
    height: 670px;
  }

  .post-video, .post-image {
    object-fit: contain;
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
  }
}


.loading {
  height: 100%;
  background-color: #0d0d0d;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;

  div {
    text-align: center;
    margin-bottom: 36px;
  }
}
</style>
