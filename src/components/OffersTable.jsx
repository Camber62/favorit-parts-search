import { useSelector } from 'react-redux'
import { getBestPrice, getStock } from '../api/favoritApi'
import Loader from './Loader'
import ErrorAlert from './ErrorAlert'

function formatPrice(price) {
  if (price == null) {
    return '—'
  }

  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 2,
  }).format(price)
}

function OffersTable() {
  const { selectedBrand, offers, offersStatus, offersError } = useSelector((state) => state.parts)

  if (offersStatus === 'idle') {
    return null
  }

  if (offersStatus === 'loading') {
    return <Loader text={`Загружаем аналоги и предложения для ${selectedBrand}…`} />
  }

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h2 className="h5 mb-3">
          Этап 2. Аналоги и предложения
          {selectedBrand ? ` — ${selectedBrand}` : ''}
        </h2>

        <ErrorAlert message={offersError} />

        {offers.length > 0 && (
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th scope="col">Название / Производитель</th>
                  <th scope="col">Артикул</th>
                  <th scope="col">Стоимость</th>
                  <th scope="col">Остаток</th>
                </tr>
              </thead>
              <tbody>
                {offers.map((item, index) => (
                  <tr key={`${item.goodsID || item.number}-${item.brand}-${index}`}>
                    <td>
                      <div className="fw-semibold">{item.name || 'Без названия'}</div>
                      <div className="text-secondary small">{item.brand || '—'}</div>
                    </td>
                    <td>{item.number || '—'}</td>
                    <td>{formatPrice(getBestPrice(item))}</td>
                    <td>{getStock(item)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default OffersTable
