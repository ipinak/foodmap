import { ref } from 'vue'

export const CATEGORY_CONFIG = {
  restaurant: { label: 'Restaurant', color: '#E74C3C', bg: '#fdecea' },
  cafe:        { label: 'Café',       color: '#E67E22', bg: '#fef3e2' },
  bar:         { label: 'Bar',        color: '#8E44AD', bg: '#f5eafb' },
  bakery:      { label: 'Bakery',     color: '#27AE60', bg: '#e9f7ef' },
  street_food: { label: 'Street Food',color: '#2980B9', bg: '#eaf4fb' },
  club:        { label: 'Club',       color: '#f0392B', bg: '#fbe9e7' },
}

export function usePois() {
  const pois = ref([])
  const loading = ref(true)
  const error = ref(null)

  async function fetchPois() {
    try {
      const res = await fetch('/pois.json')
      if (!res.ok) throw new Error('Failed to fetch POIs')
      const data = await res.json()
      pois.value = data.pois
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  function getCategories(poisList) {
    return [...new Set(poisList.map((p) => p.category))]
  }

  function filterByCategory(poisList, category) {
    if (!category) return poisList
    return poisList.filter((p) => p.category === category)
  }

  return { pois, loading, error, fetchPois, getCategories, filterByCategory }
}

/**
 * Returns a shallow copy of `poi` with name/description/address
 * replaced by the locale-specific translation, falling back to English.
 */
export function localizedPoi(poi, locale) {
  const tr = poi.translations?.[locale]
  if (!tr) return poi
  return {
    ...poi,
    name:        tr.name        ?? poi.name,
    description: tr.description ?? poi.description,
    address:     tr.address     ?? poi.address,
  }
}
