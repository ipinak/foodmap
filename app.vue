<template>
  <div class="app" :class="themeClass" :style="themeVars">
    <!-- Mobile-only top header -->
    <header class="app-mobile-header">
      <div class="app-mobile-header__brand">
        <img src="/images/redbull.png" alt="redbull logo" width="150px" />
      </div>

      <p class="app-mobile-header__subtitle">
        <span class="app-mobile-header__name">Athens Guide</span>
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
      :map-style="mapStyle"
      @select="selectPoi"
      @detail="openDetail"
      @update:search-query="searchQuery = $event"
    />

    <PoiDetail :poi="detailPoi" @close="detailPoi = null" />
  </div>
</template>

<script setup>
import Fuse from "fuse.js";
import { localizedPoi } from "~/composables/usePois.js";

const { t, locale } = useI18n();
const { pois, fetchPois, getCategories, filterByCategory } = usePois();

// ── Theme ─────────────────────────────────────────────
// Reads from window.FoodMapConfig (set in nuxt.config.ts app.head.script).
// External consumers can override before the app loads:
//   window.FoodMapConfig = { theme: { accent: '#0070f3' } }
//
// Built-in presets: 'redbull', 'redbull-light'

const config =
  (typeof window !== "undefined" ? window.FoodMapConfig : null) ?? {};
const theme = config.theme ?? {};

// Mapbox style paired to each built-in preset.
const PRESET_MAP_STYLES = {
  redbull: "mapbox://styles/mapbox/dark-v11",
  "redbull-light": "mapbox://styles/mapbox/light-v11",
};
const DEFAULT_MAP_STYLE = "mapbox://styles/mapbox/light-v11";
const THEME_PROP_MAP = {
  accent: "--fm-accent",
  surface: "--fm-surface",
  background: "--fm-bg",
  border: "--fm-border",
  borderInput: "--fm-border-input",
  borderChip: "--fm-border-chip",
  text: "--fm-text",
  textSecondary: "--fm-text-secondary",
  textMuted: "--fm-text-muted",
  textSubtle: "--fm-text-subtle",
  placeholder: "--fm-placeholder",
  interactive: "--fm-interactive",
  scrollbar: "--fm-scrollbar",
};

// CSS class applied when `theme` is a preset name string
const themeClass = computed(() =>
  typeof theme === "string" ? `theme-${theme}` : null,
);

// Inline vars applied when `theme` is a token-override object
const themeVars = computed(() => {
  if (typeof theme !== "object" || !theme) return {};
  const vars = {};
  for (const [key, cssVar] of Object.entries(THEME_PROP_MAP)) {
    if (theme[key]) vars[cssVar] = theme[key];
  }
  return vars;
});

// Mapbox base style – derived from the preset name or an explicit key in an object theme
const mapStyle = computed(() => {
  if (typeof theme === "string")
    return PRESET_MAP_STYLES[theme] ?? DEFAULT_MAP_STYLE;
  return theme?.mapStyle ?? DEFAULT_MAP_STYLE;
});

const activeCategory = ref(null);
const selectedPoi = ref(null);
const detailPoi = ref(null);
const searchQuery = ref("");

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
        { name: "name", weight: 0.5 },
        { name: "address", weight: 0.25 },
        { name: "description", weight: 0.25 },
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
