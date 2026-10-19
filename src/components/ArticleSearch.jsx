import { useDispatch, useSelector } from 'react-redux'
import {
  abortPartsRequests,
  resetResults,
  setArticle,
  startSearchBrands,
} from '../store/partsSlice'

function ArticleSearch() {
  const dispatch = useDispatch()
  const article = useSelector((state) => state.parts.article)
  const brandsStatus = useSelector((state) => state.parts.brandsStatus)

  const loading = brandsStatus === 'loading'
  const trimmed = article.trim()

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!trimmed) {
      return
    }

    dispatch(setArticle(trimmed))
    startSearchBrands(dispatch, trimmed)
  }

  const handleClear = () => {
    abortPartsRequests()
    dispatch(setArticle(''))
    dispatch(resetResults())
  }

  return (
    <form onSubmit={handleSubmit} className="card shadow-sm mb-4">
      <div className="card-body">
        <h2 className="h5 mb-3">Этап 1. Поиск по артикулу</h2>
        <div className="row g-2 align-items-end">
          <div className="col-md-8">
            <label htmlFor="article" className="form-label">
              Артикул (номер детали)
            </label>
            <input
              id="article"
              type="text"
              className="form-control"
              placeholder="Например: 7160500039S"
              value={article}
              onChange={(e) => dispatch(setArticle(e.target.value))}
              disabled={loading}
              autoComplete="off"
            />
          </div>
          <div className="col-md-4 d-flex gap-2">
            <button type="submit" className="btn btn-primary flex-grow-1" disabled={loading || !trimmed}>
              Найти производителей
            </button>
            <button type="button" className="btn btn-outline-secondary" onClick={handleClear}>
              Сброс
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default ArticleSearch
