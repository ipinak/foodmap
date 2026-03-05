<template>
  <div class="map-container">
    <div v-if="!mapboxToken" class="map-no-token">
      <div class="map-no-token__card">
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          style="color: var(--fm-accent)"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <h3>{{ t('map.tokenRequired') }}</h3>
        <p>
          {{ t('map.tokenInstructions', { file: '.env.local' }) }}
        </p>
        <pre>VITE_MAPBOX_TOKEN=your_public_token</pre>
        <a
          href="https://account.mapbox.com/access-tokens/"
          target="_blank"
          rel="noopener"
        >
          {{ t('map.getToken') }}
        </a>
      </div>
    </div>
    <div v-else ref="mapEl" class="map-canvas"></div>

    <!-- Floating search bar – desktop only -->
    <div class="map-search-overlay">
      <SearchBar
        :model-value="searchQuery"
        @update:model-value="$emit('update:searchQuery', $event)"
      />
    </div>
  </div>
</template>

<script setup>
  import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
  import { useI18n } from 'vue-i18n';
  import mapboxgl from 'mapbox-gl';
  import 'mapbox-gl/dist/mapbox-gl.css';
  import { CATEGORY_CONFIG } from '../composables/usePois.js';
  import SearchBar from './SearchBar.vue';

  const { t } = useI18n();

  const props = defineProps({
    pois: { type: Array, required: true },
    selectedPoi: { type: Object, default: null },
    searchQuery: { type: String, default: '' },
    mapStyle: { type: String, default: 'mapbox://styles/mapbox/light-v11' },
  });

  defineEmits(['select', 'detail', 'update:searchQuery']);

  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;
  const mapEl = ref(null);

  let map = null;
  const markers = {};
  let activePopup = null;

  // ── Helpers ────────────────────────────────────────────

  function createMarkerEl(poi, isSelected = false) {
    const cfg = CATEGORY_CONFIG[poi.category] ?? { color: '#888' };
    const el = document.createElement('div');
    el.className = 'poi-marker' + (isSelected ? ' poi-marker--selected' : '');
    el.style.setProperty('--cat-color', cfg.color);
    el.innerHTML = `<span class="poi-marker__dot"></span>`;
    return el;
  }

  function buildPopupHTML(poi) {
    const cfg = CATEGORY_CONFIG[poi.category] ?? { color: '#888' };
    const catLabel = t('categories.' + poi.category);
    return `
    <div class="mapbox-popup-inner">
      <img src="${poi.image}" alt="${poi.name}" class="mapbox-popup-img" />
      <div class="mapbox-popup-body">
        <span class="mapbox-popup-badge" style="background:${cfg.color}">${catLabel}</span>
        <strong class="mapbox-popup-name">${poi.name}</strong>
        <span class="mapbox-popup-addr">${poi.address}</span>
        <button class="mapbox-popup-details-btn">${t('map.seeDetails')}</button>
      </div>
    </div>`;
  }

  function addMarkers() {
    props.pois.forEach((poi) => {
      const el = createMarkerEl(poi);
      const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
        .setLngLat([poi.lng, poi.lat])
        .addTo(map);

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        emit('select', poi);
      });

      markers[poi.id] = marker;
    });
  }

  function openPopup(poi) {
    if (activePopup) {
      activePopup.remove();
      activePopup = null;
    }
    activePopup = new mapboxgl.Popup({
      closeButton: true,
      closeOnClick: false,
      offset: 18,
      maxWidth: '260px',
      className: 'mapbox-custom-popup',
    })
      .setLngLat([poi.lng, poi.lat])
      .setHTML(buildPopupHTML(poi))
      .addTo(map);

    // Popup is in the DOM immediately after addTo(); attach listener directly
    const btn = activePopup
      .getElement()
      ?.querySelector('.mapbox-popup-details-btn');
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        emit('select', poi);
      });
    }
  }

  function updateSelectedMarker(poi) {
    // Reset all markers
    Object.entries(markers).forEach(([id, marker]) => {
      const el = marker.getElement();
      el.classList.remove('poi-marker--selected');
    });
    if (!poi) return;

    const marker = markers[poi.id];
    if (marker) {
      marker.getElement().classList.add('poi-marker--selected');
    }
  }

  // ── Lifecycle ──────────────────────────────────────────

  onMounted(() => {
    if (!mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;

    map = new mapboxgl.Map({
      container: mapEl.value,
      style: props.mapStyle,
      center: [23.7275, 37.9755],
      zoom: 14,
    });

    map.addControl(
      new mapboxgl.NavigationControl({ showCompass: false }),
      'top-right',
    );
    map.addControl(new mapboxgl.ScaleControl(), 'bottom-right');

    // Close popup when clicking the map canvas
    map.on('click', () => {
      if (activePopup) {
        activePopup.remove();
        activePopup = null;
      }
    });
  });

  onBeforeUnmount(() => {
    map?.remove();
  });

  // ── Watchers ───────────────────────────────────────────

  // When POIs load or the active category filter changes
  watch(
    () => props.pois,
    (newPois) => {
      if (!map) return;

      // Always remove all existing markers first
      Object.values(markers).forEach((m) => m.remove());
      Object.keys(markers).forEach((k) => delete markers[k]);

      // Close any open popup whose POI is no longer visible
      if (activePopup) {
        activePopup.remove();
        activePopup = null;
      }

      if (!newPois.length) return;

      if (map.isStyleLoaded()) {
        addMarkers();
      } else {
        map.once('load', addMarkers);
      }
    },
  );

  watch(
    () => props.selectedPoi,
    (poi) => {
      updateSelectedMarker(poi);
      if (!poi) return;
      map?.flyTo({ center: [poi.lng, poi.lat], zoom: 15.5, speed: 1.2 });
      openPopup(poi);
    },
  );

  // Swap the Mapbox base style when the theme changes; re-add markers afterwards
  watch(
    () => props.mapStyle,
    (newStyle) => {
      if (!map) return;

      // Remove all current markers before the style swap
      Object.values(markers).forEach((m) => m.remove());
      Object.keys(markers).forEach((k) => delete markers[k]);
      if (activePopup) {
        activePopup.remove();
        activePopup = null;
      }

      map.setStyle(newStyle);
      map.once('style.load', () => {
        addMarkers();
        if (props.selectedPoi) {
          updateSelectedMarker(props.selectedPoi);
          openPopup(props.selectedPoi);
        }
      });
    },
  );
</script>

<style>
  /* Global styles for Mapbox overrides (not scoped) */
  .mapbox-custom-popup .mapboxgl-popup-content {
    padding: 0;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
  }

  .mapbox-custom-popup .mapboxgl-popup-close-button {
    color: #fff;
    font-size: 18px;
    padding: 4px 8px;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 0 12px 0 8px;
    line-height: 1;
  }

  .mapbox-popup-inner {
    width: 240px;
  }

  .mapbox-popup-img {
    width: 100%;
    height: 120px;
    object-fit: cover;
    display: block;
  }

  .mapbox-popup-body {
    padding: 10px 12px 12px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .mapbox-popup-badge {
    align-self: flex-start;
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #fff;
  }

  .mapbox-popup-name {
    font-size: 14px;
    font-weight: 700;
    color: var(--fm-text);
    line-height: 1.3;
  }

  .mapbox-popup-addr {
    font-size: 11px;
    color: var(--fm-text-secondary);
    line-height: 1.4;
  }

  .mapbox-popup-details-btn {
    margin-top: 6px;
    align-self: flex-start;
    padding: 5px 12px;
    background: var(--fm-interactive);
    color: var(--fm-bg);
    border: none;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.18s;
  }

  .mapbox-popup-details-btn:hover {
    background: var(--fm-text);
  }

  /* Custom marker */
  .poi-marker {
    --cat-color: #888;
    cursor: pointer;
  }

  .poi-marker__dot {
    display: block;
    width: 16px;
    height: 16px;
    background: var(--cat-color);
    border: 2.5px solid var(--fm-bg, #fff);
    border-radius: 50%;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
    transition:
      transform 0.2s,
      box-shadow 0.2s;
  }

  .poi-marker:hover .poi-marker__dot,
  .poi-marker--selected .poi-marker__dot {
    transform: scale(1.6);
    box-shadow: 0 3px 14px rgba(0, 0, 0, 0.32);
  }

  .poi-marker--selected .poi-marker__dot {
    border-color: var(--fm-interactive);
    border-width: 3px;
  }
</style>

<style scoped>
  .map-container {
    flex: 1;
    position: relative;
    overflow: hidden;
  }

  .map-search-overlay {
    position: absolute;
    top: 16px;
    left: 16px;
    width: 300px;
    z-index: 10;
    filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.14));
  }

  @media (max-width: 768px) {
    .map-search-overlay {
      display: none;
    }
  }

  .map-canvas {
    width: 100%;
    height: 100%;
  }

  @media (max-width: 768px) {
    .map-container {
      flex: none;
      height: 45vh;
      width: 100%;
    }
  }

  .map-no-token {
    width: 100%;
    height: 100%;
    background: var(--fm-surface);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .map-no-token__card {
    background: var(--fm-bg);
    border-radius: 16px;
    padding: 32px 36px;
    max-width: 400px;
    text-align: center;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  }

  .map-no-token__card h3 {
    margin: 12px 0 8px;
    font-size: 18px;
    font-weight: 700;
    color: var(--fm-text);
  }

  .map-no-token__card p {
    font-size: 14px;
    color: var(--fm-text-muted);
    margin: 0 0 10px;
  }

  .map-no-token__card pre {
    background: var(--fm-surface);
    border-radius: 8px;
    padding: 10px 14px;
    font-size: 12px;
    color: var(--fm-text-muted);
    text-align: left;
    margin: 0 0 16px;
    overflow-x: auto;
  }

  .map-no-token__card code {
    background: var(--fm-border);
    padding: 1px 5px;
    border-radius: 4px;
    font-size: 13px;
  }

  .map-no-token__card a {
    display: inline-block;
    padding: 8px 20px;
    background: var(--fm-interactive);
    color: var(--fm-bg);
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;
  }

  .map-no-token__card a:hover {
    background: var(--fm-text);
  }
</style>
