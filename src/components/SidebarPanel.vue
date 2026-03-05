<template>
  <aside class="sidebar">
    <div class="sidebar__header">
      <div class="sidebar__brand">
        <span class="sidebar__brand-dot"></span>
        <span class="sidebar__brand-name">FoodMap</span>
      </div>
      <p class="sidebar__subtitle">
        {{ filteredPois.length }} places in Athens
      </p>
    </div>

    <!-- Search bar – mobile only (desktop version floats over the map) -->
    <div class="sidebar__search">
      <SearchBar
        :model-value="searchQuery"
        @update:model-value="$emit('update:searchQuery', $event)"
      />
    </div>

    <CategoryFilter
      :categories="categories"
      :model-value="activeCategory"
      @update:model-value="$emit('update:activeCategory', $event)"
    />

    <div class="sidebar__list" ref="listRef">
      <div
        v-for="poi in filteredPois"
        :key="poi.id"
        :ref="
          (el) => {
            if (el) cardRefs[poi.id] = el;
          }
        "
        class="sidebar__list-item"
      >
        <PoiCard
          :poi="poi"
          :is-selected="selectedPoi?.id === poi.id"
          @select="$emit('select', $event)"
          @detail="$emit('detail', $event)"
        />
      </div>
      <div v-if="filteredPois.length === 0" class="sidebar__empty">
        No places found for this category.
      </div>
    </div>
  </aside>
</template>

<script setup>
  import { ref, watch } from 'vue';
  import CategoryFilter from './CategoryFilter.vue';
  import PoiCard from './PoiCard.vue';
  import SearchBar from './SearchBar.vue';

  const props = defineProps({
    filteredPois: { type: Array, required: true },
    searchQuery: { type: String, default: '' },
    categories: { type: Array, required: true },
    activeCategory: { type: String, default: null },
    selectedPoi: { type: Object, default: null },
  });

  defineEmits([
    'update:activeCategory',
    'update:searchQuery',
    'select',
    'detail',
  ]);

  const cardRefs = ref({});

  watch(
    () => props.selectedPoi,
    (poi) => {
      if (!poi) return;
      const el = cardRefs.value[poi.id];
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    },
  );
</script>

<style scoped>
  .sidebar {
    width: 380px;
    min-width: 320px;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #f7f7f5;
    border-right: 1px solid #e8e8e6;
    overflow: hidden;
  }

  @media (max-width: 768px) {
    .sidebar {
      width: 100%;
      min-width: unset;
      height: 55vh;
      border-right: none;
      border-top: 1px solid #e8e8e6;
    }
  }

  .sidebar__header {
    padding: 20px 16px 12px;
    border-bottom: 1px solid #e8e8e6;
    flex-shrink: 0;
  }

  .sidebar__brand {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
  }

  .sidebar__brand-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #e74c3c;
  }

  .sidebar__brand-name {
    font-size: 20px;
    font-weight: 800;
    color: #111;
    letter-spacing: -0.5px;
  }

  .sidebar__subtitle {
    margin: 0;
    font-size: 13px;
    color: #888;
  }

  .sidebar__list {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    scrollbar-width: thin;
    scrollbar-color: #ddd transparent;
  }

  .sidebar__list::-webkit-scrollbar {
    width: 4px;
  }

  .sidebar__list::-webkit-scrollbar-track {
    background: transparent;
  }

  .sidebar__list::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 4px;
  }

  @media (max-width: 768px) {
    .sidebar__list {
      flex-direction: row;
      overflow-x: auto;
      overflow-y: hidden;
      padding: 12px 16px 16px;
      gap: 12px;
      scrollbar-width: none;
    }

    .sidebar__list::-webkit-scrollbar {
      display: none;
    }

    .sidebar__list-item {
      flex: 0 0 260px;
    }
  }

  .sidebar__search {
    display: none;
  }

  @media (max-width: 768px) {
    .sidebar__search {
      display: block;
      padding: 10px 16px 0;
    }
  }

  .sidebar__empty {
    text-align: center;
    color: #aaa;
    font-size: 14px;
    padding: 40px 0;
  }
</style>
