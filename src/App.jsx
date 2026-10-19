import ArticleSearch from './components/ArticleSearch'
import BrandsList from './components/BrandsList'
import OffersTable from './components/OffersTable'

function App() {
  return (
    <div className="app-bg min-vh-100 py-4">
      <div className="container" style={{ maxWidth: 960 }}>
        <header className="mb-4">
          <h1 className="h3 mb-1">Поиск автозапчастей</h1>
          <p className="text-secondary mb-0">
            Favorit Parts API: артикул → производители → аналоги и предложения
          </p>
        </header>

        <ArticleSearch />
        <BrandsList />
        <OffersTable />
      </div>
    </div>
  )
}

export default App
