<template>
  <Transition name="detail-slide">
    <div v-if="poi" class="detail-overlay" @click.self="$emit('close')">
      <div class="detail-panel">
        <button class="detail-close" @click="$emit('close')" aria-label="Close">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div class="detail-panel__image-wrap">
          <img :src="poi.image" :alt="poi.name" class="detail-panel__image" />
          <span class="detail-panel__badge" :style="{ background: catColor }">
            {{ catLabel }}
          </span>
        </div>

        <div class="detail-panel__body">
          <h2 class="detail-panel__name">{{ poi.name }}</h2>

          <div class="detail-panel__meta">
            <div class="detail-panel__meta-item">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{{ poi.address }}</span>
            </div>
            <div class="detail-panel__meta-item">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path
                  d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
                />
              </svg>
              <span>{{ poi.lat.toFixed(5) }}, {{ poi.lng.toFixed(5) }}</span>
            </div>
          </div>

          <p class="detail-panel__desc">{{ poi.description }}</p>

          <div class="detail-panel__coords-map">
            <a
              :href="`https://www.google.com/maps/search/?api=1&query=${poi.lat},${poi.lng}`"
              target="_blank"
              rel="noopener noreferrer"
              class="detail-panel__gmaps-btn"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {{ t('poi.openMaps') }}
            </a>

            <a
              v-if="poi.website"
              :href="poi.website.url"
              target="_blank"
              rel="noopener noreferrer"
              class="detail-panel__website-btn"
              :class="{
                'detail-panel__website-btn--instagram':
                  poi.website.type === 'instagram',
              }"
            >
              <!-- Instagram icon -->
              <svg
                v-if="poi.website.type === 'instagram'"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
              </svg>
              <!-- Globe icon -->
              <svg
                v-else
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path
                  d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
                />
              </svg>
              {{
                poi.website.type === 'instagram'
                  ? t('poi.visitInstagram')
                  : t('poi.visitWebsite')
              }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
  import { computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { CATEGORY_CONFIG } from '../composables/usePois.js';

  const { t } = useI18n();

  const props = defineProps({
    poi: { type: Object, default: null },
  });
  defineEmits(['close']);

  const catColor = computed(
    () => CATEGORY_CONFIG[props.poi?.category]?.color ?? '#888',
  );
  const catLabel = computed(() => t('categories.' + props.poi?.category));
</script>

<style scoped>
  .detail-overlay {
    position: fixed;
    inset: 0;
    z-index: 200;
    background: rgba(0, 0, 0, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }

  .detail-panel {
    position: relative;
    background: var(--fm-bg);
    border-radius: 16px;
    overflow: hidden;
    width: 100%;
    max-width: 520px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.25);
  }

  .detail-close {
    position: absolute;
    top: 14px;
    right: 14px;
    z-index: 10;
    background: rgba(0, 0, 0, 0.5);
    border: none;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #fff;
    transition: background 0.18s;
  }

  .detail-close:hover {
    background: rgba(0, 0, 0, 0.75);
  }

  .detail-panel__image-wrap {
    position: relative;
    height: 260px;
    overflow: hidden;
  }

  .detail-panel__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .detail-panel__badge {
    position: absolute;
    bottom: 14px;
    left: 14px;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #fff;
  }

  .detail-panel__body {
    padding: 24px 24px 28px;
  }

  .detail-panel__name {
    margin: 0 0 14px;
    font-size: 24px;
    font-weight: 800;
    color: var(--fm-text);
    letter-spacing: -0.5px;
  }

  .detail-panel__meta {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 16px;
  }

  .detail-panel__meta-item {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-size: 13px;
    color: var(--fm-text-muted);
    line-height: 1.5;
  }

  .detail-panel__meta-item svg {
    flex-shrink: 0;
    margin-top: 2px;
    color: var(--fm-text-subtle);
  }

  .detail-panel__desc {
    font-size: 15px;
    line-height: 1.7;
    color: var(--fm-text-muted);
    margin: 0 0 20px;
  }

  .detail-panel__coords-map {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .detail-panel__gmaps-btn {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 10px 20px;
    background: var(--fm-interactive);
    color: var(--fm-bg);
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;
    transition: background 0.18s;
  }

  .detail-panel__gmaps-btn:hover {
    background: var(--fm-text);
  }

  .detail-panel__website-btn {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 10px 20px;
    background: transparent;
    color: var(--fm-interactive);
    border: 1.5px solid var(--fm-interactive);
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;
    transition:
      background 0.18s,
      color 0.18s;
  }

  .detail-panel__website-btn:hover {
    background: var(--fm-interactive);
    color: var(--fm-bg);
  }

  .detail-panel__website-btn--instagram {
    color: #c13584;
    border-color: #c13584;
  }

  .detail-panel__website-btn--instagram:hover {
    background: #c13584;
    color: #fff;
  }

  /* Transition */
  .detail-slide-enter-active,
  .detail-slide-leave-active {
    transition: opacity 0.25s ease;
  }

  .detail-slide-enter-active .detail-panel,
  .detail-slide-leave-active .detail-panel {
    transition:
      transform 0.28s cubic-bezier(0.34, 1.2, 0.64, 1),
      opacity 0.25s ease;
  }

  .detail-slide-enter-from,
  .detail-slide-leave-to {
    opacity: 0;
  }

  .detail-slide-enter-from .detail-panel {
    transform: scale(0.92) translateY(20px);
    opacity: 0;
  }

  .detail-slide-leave-to .detail-panel {
    transform: scale(0.95);
    opacity: 0;
  }
</style>
