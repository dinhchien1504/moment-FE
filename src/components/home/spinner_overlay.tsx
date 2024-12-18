export const SpinnerOverlay= () => {
  return (
    <div className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50">
      <div className="spinner-border text-light" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};