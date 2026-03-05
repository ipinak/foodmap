<template>
  <div class="category-filter">
    <button
      class="filter-chip"
      :class="{ active: modelValue === null }"
      @click="$emit('update:modelValue', null)"
    >
      All
    </button>
    <button
      v-for="cat in categories"
      :key="cat"
      class="filter-chip"
      :class="{ active: modelValue === cat }"
      :style="
        modelValue === cat
          ? { background: config[cat]?.color, borderColor: config[cat]?.color }
          : { borderColor: config[cat]?.color, color: config[cat]?.color }
      "
      @click="$emit('update:modelValue', cat)"
    >
      {{ config[cat]?.label ?? cat }}
    </button>
  </div>
</template>

<script setup>
  import { CATEGORY_CONFIG } from '../composables/usePois.js';

  defineProps({
    categories: { type: Array, required: true },
    modelValue: { type: String, default: null },
  });
  defineEmits(['update:modelValue']);

  const config = CATEGORY_CONFIG;
</script>

<style scoped>
  .category-filter {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 16px 16px 0;
  }

  .filter-chip {
    padding: 5px 14px;
    border-radius: 20px;
    border: 1.5px solid #d0d0d0;
    background: #fff;
    color: #555;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.18s ease;
    white-space: nowrap;
  }

  .filter-chip:hover {
    opacity: 0.85;
  }

  .filter-chip.active {
    color: #fff;
    border-color: transparent;
    background: #222;
  }
</style>
