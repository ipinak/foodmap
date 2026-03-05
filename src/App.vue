<template>
  <div class="app">
    <!-- Mobile-only top header -->
    <header class="app-mobile-header">
      <div class="app-mobile-header__brand">
        <span class="app-mobile-header__dot"></span>
        <span class="app-mobile-header__name">FoodMap</span>
      </div>
      <p class="app-mobile-header__subtitle">
        {{ filteredPois.length }} places in Athens
      </p>
    </header>

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

  .app-mobile-header {
    display: none;
  }

  @media (max-width: 768px) {
    .app-mobile-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      order: 0;
      flex: none;
      padding: 10px 16px;
      background: #f7f7f5;
      border-bottom: 1px solid #e8e8e6;
    }

    .app-mobile-header__brand {
      display: flex;
      align-items: center;
      gap: 7px;
    }

    .app-mobile-header__dot {
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background: #e74c3c;
      flex-shrink: 0;
    }

    .app-mobile-header__name {
      font-size: 17px;
      font-weight: 800;
      color: #111;
      letter-spacing: -0.4px;
    }

    .app-mobile-header__subtitle {
      margin: 0;
      font-size: 12px;
      color: #888;
    }
  }

  /* Map first (order 1), sidebar below (order 2) on mobile */
  @media (max-width: 768px) {
    .app :deep(.map-container) {
      order: 1;
    }
    .app :deep(.sidebar) {
      order: 2;
    }
    /* Hide the duplicate header inside sidebar on mobile */
    .app :deep(.sidebar__header) {
      display: none;
    }
  }
</style>
