<template>
  <aside class="sidebar">
    <div class="sidebar__header">
      <div class="sidebar__brand">
        <img src="/images/redbull.png" alt="redbull logo" width="150px" />
      </div>
      <p class="sidebar__subtitle">
        <span class="sidebar__brand-name">Athens City Guide</span>
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
        <div class="sidebar__card-desktop">
          <PoiCard
            :poi="poi"
            :is-selected="selectedPoi?.id === poi.id"
            @select="$emit('select', $event)"
            @detail="$emit('detail', $event)"
          />
        </div>
        <div class="sidebar__card-mobile">
          <HorizontalPoiItem
            :poi="poi"
            :is-selected="selectedPoi?.id === poi.id"
            @select="$emit('select', $event)"
            @detail="$emit('detail', $event)"
          />
        </div>
      </div>
      <div v-if="filteredPois.length === 0" class="sidebar__empty">
        {{ t("poi.noResults") }}
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import CategoryFilter from "./CategoryFilter.vue";
import HorizontalPoiItem from "./HorizontalPoiItem.vue";
import PoiCard from "./PoiCard.vue";
import SearchBar from "./SearchBar.vue";

const { t } = useI18n();

const props = defineProps({
  filteredPois: { type: Array, required: true },
  searchQuery: { type: String, default: "" },
  categories: { type: Array, required: true },
  activeCategory: { type: String, default: null },
  selectedPoi: { type: Object, default: null },
});

defineEmits([
  "update:activeCategory",
  "update:searchQuery",
  "select",
  "detail",
]);

const cardRefs = ref({});

watch(
  () => props.selectedPoi,
  (poi) => {
    if (!poi) return;
    const el = cardRefs.value[poi.id];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "nearest" });
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
  background: var(--fm-surface);
  border-right: 1px solid var(--fm-border);
  overflow: hidden;
}

@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    min-width: unset;
    height: 55vh;
    border-right: none;
    border-top: 1px solid var(--fm-border);
  }
}

.sidebar__header {
  padding: 20px 16px 12px;
  border-bottom: 1px solid var(--fm-border);
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
  background: var(--fm-accent);
}

.sidebar__brand-name {
  font-size: 15px;
  font-weight: 800;
  color: var(--fm-text);
  letter-spacing: -0.5px;
}

.sidebar__subtitle {
  margin: 0;
  font-size: 13px;
  color: var(--fm-text-secondary);
}

.sidebar__list {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  scrollbar-width: thin;
  scrollbar-color: var(--fm-scrollbar) transparent;
}

.sidebar__list::-webkit-scrollbar {
  width: 4px;
}

.sidebar__list::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar__list::-webkit-scrollbar-thumb {
  background: var(--fm-scrollbar);
  border-radius: 4px;
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

.sidebar__card-mobile {
  display: none;
}

@media (max-width: 768px) {
  .sidebar__card-desktop {
    display: none;
  }

  .sidebar__card-mobile {
    display: block;
  }
}

.sidebar__empty {
  text-align: center;
  color: #aaa;
  font-size: 14px;
  padding: 40px 0;
}
</style>
