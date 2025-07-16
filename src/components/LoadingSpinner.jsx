const LoadingSpinner = ({ size = 12, color = "indigo-600" }) => {
  return (
    <div className="flex justify-center items-center h-64">
      <div
        className={`animate-spin rounded-full h-${size} w-${size} border-t-4 border-b-4 border-${color}`}
      ></div>
    </div>
  );
};

export default LoadingSpinner;
