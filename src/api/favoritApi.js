const API_BASE = '/api/hsprice'
const API_KEY = import.meta.env.VITE_FAVORIT_API_KEY

function buildUrl({ number, brand, analogues }) {
  const params = new URLSearchParams()
  params.set('key', API_KEY)
  params.set('number', number)

  if (brand) {
    params.set('brand', brand)
  }

  if (analogues) {
    params.set('analogues', 'on')
  }

  return `${API_BASE}/?${params.toString()}`
}

async function request(options, signal) {
  let response

  try {
    response = await fetch(buildUrl(options), { signal })
  } catch (err) {
    if (err?.name === 'AbortError') {
      throw err
    }
    throw new Error('Сбой сети. Проверьте соединение и попробуйте снова.')
  }

  if (!response.ok) {
    throw new Error(`Ошибка сервера: ${response.status}`)
  }

  const data = await response.json()

  if (data?.error) {
    const message = Array.isArray(data.error) ? data.error.join('; ') : String(data.error)
    throw new Error(message)
  }

  const goods = Array.isArray(data?.goods) ? data.goods : []

  // API может вернуть один «пустой» объект, если ничего не найдено
  const cleaned = goods.filter((item) => item && (item.brand || item.number || item.name))

  return cleaned
}

export function fetchBrandsByNumber(number, signal) {
  return request({ number }, signal)
}

export function fetchOffers({ number, brand }, signal) {
  return request({ number, brand, analogues: true }, signal)
}

/** Минимальная цена по складам (поле price у товара устарело) */
export function getBestPrice(item) {
  const warehouses = Array.isArray(item?.warehouses) ? item.warehouses : []
  const prices = warehouses
    .map((w) => Number(w.price))
    .filter((p) => !Number.isNaN(p) && p > 0)

  if (prices.length === 0) {
    const fallback = Number(item?.price)
    return !Number.isNaN(fallback) && fallback > 0 ? fallback : null
  }

  return Math.min(...prices)
}

export function getStock(item) {
  if (typeof item?.count === 'number') {
    return item.count
  }

  const warehouses = Array.isArray(item?.warehouses) ? item.warehouses : []
  return warehouses.reduce((sum, w) => sum + (Number(w.stock) || 0), 0)
}

/** Разворачиваем основной товар + аналоги в плоский список предложений */
export function flattenOffers(goods) {
  const result = []

  goods.forEach((item) => {
    result.push(item)

    if (Array.isArray(item.analogues)) {
      item.analogues.forEach((analog) => {
        if (analog && (analog.brand || analog.number || analog.name)) {
          result.push(analog)
        }
      })
    }
  })

  return result
}

/** Сортировка по возрастанию цены; позиции без цены — в конец */
export function sortOffersByPrice(offers) {
  return [...offers].sort((a, b) => {
    const priceA = getBestPrice(a)
    const priceB = getBestPrice(b)

    if (priceA == null && priceB == null) return 0
    if (priceA == null) return 1
    if (priceB == null) return -1
    return priceA - priceB
  })
}
