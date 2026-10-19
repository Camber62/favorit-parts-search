import { useDispatch, useSelector } from 'react-redux'
import { startLoadOffers } from '../store/partsSlice'
import Loader from './Loader'
import ErrorAlert from './ErrorAlert'

function BrandsList() {
  const dispatch = useDispatch()
  const {
    article,
    brands,
    selectedBrand,
    brandsStatus,
    brandsError,
    offersStatus,
  } = useSelector((state) => state.parts)

  if (brandsStatus === 'idle') {
    return null
  }

  if (brandsStatus === 'loading') {
    return <Loader text="Ищем производителей…" />
  }

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h2 className="h5 mb-3">Производители по артикулу «{article}»</h2>
        <ErrorAlert message={brandsError} />

        {brands.length > 0 && (
          <div className="list-group">
            {brands.map((brand) => {
              const active = selectedBrand === brand
              const loadingOffers = offersStatus === 'loading' && active

              return (
                <button
                  key={brand}
                  type="button"
                  className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${active ? 'active' : ''}`}
                  onClick={() => startLoadOffers(dispatch, { number: article, brand })}
                  disabled={offersStatus === 'loading'}
                >
                  <span>{brand}</span>
                  {loadingOffers ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                  ) : (
                    <span className={`badge ${active ? 'text-bg-light' : 'text-bg-primary'}`}>Выбрать</span>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default BrandsList
