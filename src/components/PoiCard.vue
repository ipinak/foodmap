<template>
  <div
    class="poi-card"
    :class="{ selected: isSelected }"
    @click="$emit('select', poi)"
  >
    <div class="poi-card__image-wrap">
      <img
        :src="poi.image"
        :alt="poi.name"
        class="poi-card__image"
        loading="lazy"
      />
      <span
        class="poi-card__badge"
        :style="{ background: catColor, color: '#fff' }"
      >
        {{ catLabel }}
      </span>
    </div>
    <div class="poi-card__body">
      <h3 class="poi-card__name">{{ poi.name }}</h3>
      <p class="poi-card__address">
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        {{ poi.address }}
      </p>
      <p class="poi-card__desc">{{ poi.description }}</p>
      <button class="poi-card__cta" @click.stop="$emit('detail', poi)">
        See details
      </button>
    </div>
  </div>
</template>

<script setup>
  import { computed } from 'vue';
  import { CATEGORY_CONFIG } from '../composables/usePois.js';

  const props = defineProps({
    poi: { type: Object, required: true },
    isSelected: { type: Boolean, default: false },
  });
  defineEmits(['select', 'detail']);

  const catColor = computed(
    () => CATEGORY_CONFIG[props.poi.category]?.color ?? '#888',
  );
  const catLabel = computed(
    () => CATEGORY_CONFIG[props.poi.category]?.label ?? props.poi.category,
  );
</script>

<style scoped>
  .poi-card {
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition:
      box-shadow 0.2s,
      transform 0.2s;
    border: 2px solid transparent;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  }

  .poi-card:hover {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }

  .poi-card.selected {
    border-color: #222;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.14);
  }

  .poi-card__image-wrap {
    position: relative;
    height: 160px;
    overflow: hidden;
  }

  .poi-card__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
  }

  .poi-card:hover .poi-card__image {
    transform: scale(1.04);
  }

  .poi-card__badge {
    position: absolute;
    top: 10px;
    left: 10px;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.03em;
    text-transform: uppercase;
  }

  .poi-card__body {
    padding: 14px 16px 16px;
  }

  .poi-card__name {
    margin: 0 0 6px;
    font-size: 16px;
    font-weight: 700;
    color: #111;
    line-height: 1.3;
  }

  .poi-card__address {
    display: flex;
    align-items: center;
    gap: 5px;
    margin: 0 0 8px;
    font-size: 12px;
    color: #888;
  }

  .poi-card__desc {
    margin: 0 0 12px;
    font-size: 13px;
    color: #555;
    line-height: 1.55;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .poi-card__cta {
    background: none;
    border: 1.5px solid #222;
    color: #222;
    border-radius: 6px;
    padding: 6px 14px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition:
      background 0.18s,
      color 0.18s;
  }

  .poi-card__cta:hover {
    background: #222;
    color: #fff;
  }
</style>
