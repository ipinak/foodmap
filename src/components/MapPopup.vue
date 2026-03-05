<template>
  <div class="mapbox-popup-inner">
    <img :src="poi.image" :alt="poi.name" class="mapbox-popup-img" />
    <div class="mapbox-popup-body">
      <span class="mapbox-popup-badge" :style="{ background: cfg.color }">
        {{ catLabel }}
      </span>
      <strong class="mapbox-popup-name">{{ poi.name }}</strong>
      <span class="mapbox-popup-addr">{{ poi.address }}</span>
      <button class="mapbox-popup-details-btn" @click="$emit('details', poi)">
        {{ t('map.seeDetails') }}
      </button>
    </div>
  </div>
</template>

<script setup>
  import { computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { CATEGORY_CONFIG } from '../composables/usePois.js';

  const { t } = useI18n();

  const props = defineProps({
    poi: { type: Object, required: true },
  });

  defineEmits(['details']);

  const cfg = computed(
    () => CATEGORY_CONFIG[props.poi.category] ?? { color: '#888' },
  );
  const catLabel = computed(() => t('categories.' + props.poi.category));
</script>
