import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  fetchBrandsByNumber,
  fetchOffers,
  flattenOffers,
  sortOffersByPrice,
} from '../api/favoritApi'

let brandsPromise = null
let offersPromise = null

export const searchBrands = createAsyncThunk(
  'parts/searchBrands',
  async (number, { rejectWithValue, signal }) => {
    try {
      const goods = await fetchBrandsByNumber(number, signal)
      return { number, goods }
    } catch (err) {
      if (err?.name === 'AbortError') {
        throw err
      }
      return rejectWithValue(err.message || 'Неизвестная ошибка')
    }
  },
)

export const loadOffers = createAsyncThunk(
  'parts/loadOffers',
  async ({ number, brand }, { rejectWithValue, signal }) => {
    try {
      const goods = await fetchOffers({ number, brand }, signal)
      return { brand, offers: sortOffersByPrice(flattenOffers(goods)) }
    } catch (err) {
      if (err?.name === 'AbortError') {
        throw err
      }
      return rejectWithValue(err.message || 'Неизвестная ошибка')
    }
  },
)

export function startSearchBrands(dispatch, number) {
  brandsPromise?.abort()
  offersPromise?.abort()
  brandsPromise = dispatch(searchBrands(number))
  return brandsPromise
}

export function startLoadOffers(dispatch, payload) {
  offersPromise?.abort()
  offersPromise = dispatch(loadOffers(payload))
  return offersPromise
}

export function abortPartsRequests() {
  brandsPromise?.abort()
  offersPromise?.abort()
  brandsPromise = null
  offersPromise = null
}

const initialState = {
  article: '',
  brands: [],
  selectedBrand: null,
  offers: [],
  brandsStatus: 'idle', // idle | loading | succeeded | failed
  offersStatus: 'idle',
  brandsError: null,
  offersError: null,
}

const partsSlice = createSlice({
  name: 'parts',
  initialState,
  reducers: {
    setArticle(state, action) {
      state.article = action.payload
    },
    resetResults(state) {
      state.brands = []
      state.selectedBrand = null
      state.offers = []
      state.brandsStatus = 'idle'
      state.offersStatus = 'idle'
      state.brandsError = null
      state.offersError = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchBrands.pending, (state) => {
        state.brandsStatus = 'loading'
        state.brandsError = null
        state.brands = []
        state.selectedBrand = null
        state.offers = []
        state.offersStatus = 'idle'
        state.offersError = null
      })
      .addCase(searchBrands.fulfilled, (state, action) => {
        state.brandsStatus = 'succeeded'
        state.article = action.payload.number

        const uniqueBrands = [
          ...new Set(
            action.payload.goods
              .map((g) => g.brand)
              .filter(Boolean),
          ),
        ]

        state.brands = uniqueBrands

        if (uniqueBrands.length === 0) {
          state.brandsError = 'По этому артикулу производители не найдены.'
        }
      })
      .addCase(searchBrands.rejected, (state, action) => {
        if (action.meta.aborted) {
          return
        }
        state.brandsStatus = 'failed'
        state.brandsError = action.payload || 'Ошибка загрузки производителей'
      })
      .addCase(loadOffers.pending, (state, action) => {
        state.offersStatus = 'loading'
        state.offersError = null
        state.offers = []
        state.selectedBrand = action.meta.arg.brand
      })
      .addCase(loadOffers.fulfilled, (state, action) => {
        state.offersStatus = 'succeeded'
        state.offers = action.payload.offers
        state.selectedBrand = action.payload.brand

        if (action.payload.offers.length === 0) {
          state.offersError = 'Аналоги и предложения не найдены.'
        }
      })
      .addCase(loadOffers.rejected, (state, action) => {
        if (action.meta.aborted) {
          return
        }
        state.offersStatus = 'failed'
        state.offersError = action.payload || 'Ошибка загрузки предложений'
      })
  },
})

export const { setArticle, resetResults } = partsSlice.actions
export default partsSlice.reducer
