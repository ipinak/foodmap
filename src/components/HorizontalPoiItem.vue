<template>
  <div
    class="h-poi-item"
    :class="{ 'h-poi-item--selected': isSelected }"
    @click="$emit('select', poi)"
  >
    <div class="h-poi-item__thumb-wrap">
      <img
        :src="poi.image"
        :alt="poi.name"
        class="h-poi-item__thumb"
        loading="lazy"
      />
    </div>

    <div class="h-poi-item__body">
      <h3 class="h-poi-item__name">{{ poi.name }}</h3>
      <p class="h-poi-item__desc">{{ poi.description }}</p>
      <button class="h-poi-item__cta" @click.stop="$emit('detail', poi)">
        {{ t('poi.seeDetails') }}
      </button>
    </div>
  </div>
</template>

<script setup>
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();

  defineProps({
    poi: { type: Object, required: true },
    isSelected: { type: Boolean, default: false },
  });

  defineEmits(['select', 'detail']);
</script>

<style scoped>
  .h-poi-item {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    background: var(--fm-bg);
    border-radius: 10px;
    overflow: hidden;
    cursor: pointer;
    border: 2px solid transparent;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.07);
    transition:
      box-shadow 0.2s,
      border-color 0.2s,
      transform 0.2s;
  }

  .h-poi-item:hover {
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.11);
    transform: translateY(-1px);
  }

  .h-poi-item--selected {
    border-color: var(--fm-interactive);
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.13);
  }

  /* ── Thumbnail ─────────────────────────────────── */
  .h-poi-item__thumb-wrap {
    flex: 0 0 100px;
    width: 100px;
    overflow: hidden;
  }

  .h-poi-item__thumb {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.35s ease;
  }

  .h-poi-item:hover .h-poi-item__thumb {
    transform: scale(1.06);
  }

  /* ── Body ──────────────────────────────────────── */
  .h-poi-item__body {
    flex: 1 1 auto;
    padding: 10px 12px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 6px;
    min-width: 0;
  }

  .h-poi-item__name {
    margin: 0;
    font-size: 14px;
    font-weight: 700;
    color: var(--fm-text);
    line-height: 1.3;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .h-poi-item__desc {
    margin: 0;
    font-size: 12px;
    color: var(--fm-text-muted);
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .h-poi-item__cta {
    align-self: flex-start;
    background: none;
    border: 1.5px solid var(--fm-interactive);
    color: var(--fm-interactive);
    border-radius: 5px;
    padding: 4px 10px;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    transition:
      background 0.18s,
      color 0.18s;
  }

  .h-poi-item__cta:hover {
    background: var(--fm-interactive);
    color: var(--fm-bg);
  }
</style>
