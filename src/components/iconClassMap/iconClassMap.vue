<template>
  <span class="icon" :class="classMap[iconType]">
  </span>
</template>

<script>
export default {
  name: 'iconClassMap',
  props: {
    iconType: {
      type: Number
    }
  },
  created() {
    // 定义一个数组，代表不同的icon[减，折，特，票，保],有序排列，index代表type
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
  }
};
</script>

<style type="text/css" scoped="" lang="scss">
  @import '../../common/scss/border.scss';
  .icon{
    display: inline-block;
    width:12px;
    height:12px;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    vertical-align: top;
    &.decrease{
      @include bg-image("decrease_4");
    }
    &.discount{
      @include bg-image("discount_4");
    }
    &.invoice{
      @include bg-image("invoice_4");
    }
    &.special{
      @include bg-image("special_4");
    }
    &.guarantee{
      @include bg-image("guarantee_4");
    }
  }
</style>