<template lang="pug">
  footer
    .container.is-fluid id: {{user.id}} / {{isLoggedIn ? 'logged in' : 'logged out'}}
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'app-footer',
  computed: {
    ...mapGetters([
      'user',
      'isLoggedIn'
    ])
  }
}

</script>

<style lang="sass">
$footerHeight: 60px
footer
  width: 100%;
  height: $footerHeight
  line-height: $footerHeight
  background: #f5f5f5
</style>
