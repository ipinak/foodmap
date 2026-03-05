<template>
  <div class="app">
    <SidebarPanel
      :filtered-pois="filteredPois"
      :categories="categories"
      :active-category="activeCategory"
      :selected-poi="selectedPoi"
      @update:active-category="setCategory"
      @select="selectPoi"
      @detail="openDetail"
    />

    <MapView
      :pois="filteredPois"
      :selected-poi="selectedPoi"
      @select="selectPoi"
      @detail="openDetail"
    />

    <PoiDetail :poi="detailPoi" @close="detailPoi = null" />
  </div>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue';
  import SidebarPanel from './components/SidebarPanel.vue';
  import MapView from './components/MapView.vue';
  import PoiDetail from './components/PoiDetail.vue';
  import { usePois } from './composables/usePois.js';

  const { pois, fetchPois, getCategories, filterByCategory } = usePois();

  const activeCategory = ref(null);
  const selectedPoi = ref(null);
  const detailPoi = ref(null);

  const categories = computed(() => getCategories(pois.value));
  const filteredPois = computed(() =>
    filterByCategory(pois.value, activeCategory.value),
  );

  function setCategory(cat) {
    activeCategory.value = cat;
    selectedPoi.value = null;
  }

  function selectPoi(poi) {
    selectedPoi.value = poi;
  }

  function openDetail(poi) {
    detailPoi.value = poi;
  }

  onMounted(() => {
    fetchPois();
  });
</script>

<style scoped>
  .app {
    display: flex;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
  }

  @media (max-width: 768px) {
    .app {
      flex-direction: column;
    }
  }
</style>
