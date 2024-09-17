export function LoadingScreen({ loadingProgress }) {
  return (
    <div className="loading-screen">
      <h2>Loading the cards . . .</h2>
      <div className="progress-bar">
        <div
          className="progress-bar-fill"
          style={{ width: `${loadingProgress}%` }}
        ></div>
      </div>
      <p>{loadingProgress}% loaded</p>
    </div>
  );
}
