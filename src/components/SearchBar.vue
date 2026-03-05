<template>
  <div class="search-bar">
    <svg
      class="search-bar__icon"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.2"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
    <input
      class="search-bar__input"
      type="text"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <button
      v-if="modelValue"
      class="search-bar__clear"
      aria-label="Clear search"
      @click="$emit('update:modelValue', '')"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
      >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  </div>
</template>

<script setup>
  defineProps({
    modelValue: { type: String, default: '' },
    placeholder: { type: String, default: 'Search places…' },
  });
  defineEmits(['update:modelValue']);
</script>

<style scoped>
  .search-bar {
    position: relative;
    display: flex;
    align-items: center;
  }

  .search-bar__icon {
    position: absolute;
    left: 12px;
    color: #999;
    pointer-events: none;
    flex-shrink: 0;
  }

  .search-bar__input {
    width: 100%;
    padding: 10px 36px 10px 38px;
    border: 1.5px solid #e0e0e0;
    border-radius: 10px;
    font-size: 14px;
    font-family: inherit;
    color: #111;
    background: #fff;
    outline: none;
    transition:
      border-color 0.18s,
      box-shadow 0.18s;
  }

  .search-bar__input::placeholder {
    color: #bbb;
  }

  .search-bar__input:focus {
    border-color: #111;
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.06);
  }

  .search-bar__clear {
    position: absolute;
    right: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border: none;
    background: #e8e8e8;
    border-radius: 50%;
    cursor: pointer;
    color: #555;
    padding: 0;
    transition: background 0.15s;
  }

  .search-bar__clear:hover {
    background: #d0d0d0;
  }
</style>
