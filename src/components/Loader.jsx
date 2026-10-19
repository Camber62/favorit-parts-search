function Loader({ text = 'Загрузка…' }) {
  return (
    <div className="d-flex align-items-center gap-2 my-3 text-secondary">
      <div className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
      <span>{text}</span>
    </div>
  )
}

export default Loader
