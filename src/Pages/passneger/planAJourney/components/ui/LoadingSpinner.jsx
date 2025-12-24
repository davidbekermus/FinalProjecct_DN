/**
 * Loading spinner component
 */
const LoadingSpinner = ({ message = 'Loading...' }) => {
  return <div className="spinner">{message}</div>;
};

export default LoadingSpinner;

