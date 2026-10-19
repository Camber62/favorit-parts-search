function ErrorAlert({ message }) {
  if (!message) return null

  return (
    <div className="alert alert-danger my-3" role="alert">
      {message}
    </div>
  )
}

export default ErrorAlert
