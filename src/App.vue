<template>
  <div class="app" :class="themeClass" :style="themeVars">
    <!-- Mobile-only top header -->
    <header class="app-mobile-header">
      <div class="app-mobile-header__brand">
        <span class="app-mobile-header__dot"></span>
        <span class="app-mobile-header__name">FoodMap</span>
      </div>
      <p class="app-mobile-header__subtitle">
        {{ t('app.subtitle', { count: filteredPois.length }) }}
      </p>
    </header>

    <SidebarPanel
      :filtered-pois="filteredPois"
      :categories="categories"
      :active-category="activeCategory"
      :selected-poi="selectedPoi"
      :search-query="searchQuery"
      @update:active-category="setCategory"
      @update:search-query="searchQuery = $event"
      @select="selectPoi"
      @detail="openDetail"
    />

    <MapView
      :pois="filteredPois"
      :selected-poi="selectedPoi"
      :search-query="searchQuery"
      @select="selectPoi"
      @detail="openDetail"
      @update:search-query="searchQuery = $event"
    />

    <PoiDetail :poi="detailPoi" @close="detailPoi = null" />
  </div>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useI18n } from 'vue-i18n';
  import Fuse from 'fuse.js';
  import SidebarPanel from './components/SidebarPanel.vue';
  import MapView from './components/MapView.vue';
  import PoiDetail from './components/PoiDetail.vue';
  import { usePois, localizedPoi } from './composables/usePois.js';

  const { t, locale } = useI18n();
  const { pois, fetchPois, getCategories, filterByCategory } = usePois();

  // ── Theme ─────────────────────────────────────────────
  // `theme` accepts either:
  //   • A preset name string  → applies the matching CSS class (.theme-<name>)
  //   • A plain object        → inlines individual CSS custom properties
  //
  // Built-in presets: 'redbull'
  //
  // Examples:
  //   window.FoodMapConfig = { theme: 'redbull' }
  //   window.FoodMapConfig = { theme: { accent: '#0070f3', interactive: '#0070f3' } }
  //   <App theme="redbull" />
  //   <App :theme="{ accent: '#0070f3' }" />
  const THEME_PROP_MAP = {
    accent: '--fm-accent',
    surface: '--fm-surface',
    background: '--fm-bg',
    border: '--fm-border',
    borderInput: '--fm-border-input',
    borderChip: '--fm-border-chip',
    text: '--fm-text',
    textSecondary: '--fm-text-secondary',
    textMuted: '--fm-text-muted',
    textSubtle: '--fm-text-subtle',
    placeholder: '--fm-placeholder',
    interactive: '--fm-interactive',
    scrollbar: '--fm-scrollbar',
  };

  const props = defineProps({
    // string → preset name; object → token overrides
    theme: { type: [String, Object], default: () => ({}) },
  });

  // CSS class applied when `theme` is a preset name string
  const themeClass = computed(() =>
    typeof props.theme === 'string' ? `theme-${props.theme}` : null,
  );

  // Inline vars applied when `theme` is a token-override object
  const themeVars = computed(() => {
    if (typeof props.theme !== 'object' || !props.theme) return {};
    const vars = {};
    for (const [key, cssVar] of Object.entries(THEME_PROP_MAP)) {
      if (props.theme[key]) vars[cssVar] = props.theme[key];
    }
    return vars;
  });

  const activeCategory = ref(null);
  const selectedPoi = ref(null);
  const detailPoi = ref(null);
  const searchQuery = ref('');

  const categories = computed(() => getCategories(pois.value));

  // Category-filtered pool (no search applied yet)
  const categoryPois = computed(() =>
    filterByCategory(pois.value, activeCategory.value),
  );

  // Overlay locale-specific name/description/address
  const localizedCategoryPois = computed(() =>
    categoryPois.value.map((poi) => localizedPoi(poi, locale.value)),
  );

  // Fuse index rebuilt whenever the pool or locale changes
  const fuse = computed(
    () =>
      new Fuse(localizedCategoryPois.value, {
        keys: [
          { name: 'name', weight: 0.5 },
          { name: 'address', weight: 0.25 },
          { name: 'description', weight: 0.25 },
        ],
        threshold: 0.35,
        includeScore: true,
        minMatchCharLength: 2,
      }),
  );

  const filteredPois = computed(() => {
    const q = searchQuery.value.trim();
    if (!q) return localizedCategoryPois.value;
    return fuse.value.search(q).map((r) => r.item);
  });

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
      background: var(--fm-surface);
      border-bottom: 1px solid var(--fm-border);
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
      background: var(--fm-accent);
      flex-shrink: 0;
    }

    .app-mobile-header__name {
      font-size: 17px;
      font-weight: 800;
      color: var(--fm-text);
      letter-spacing: -0.4px;
    }

    .app-mobile-header__subtitle {
      margin: 0;
      font-size: 12px;
      color: var(--fm-text-secondary);
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
