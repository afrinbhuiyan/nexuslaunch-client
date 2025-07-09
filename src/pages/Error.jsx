import { useRouteError, Link } from 'react-router-dom';

const Error = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-4">Oops!</h1>
      <p className="text-xl mb-4">
        {error.status}
        {error.statusText || error.message}
      </p>
      <p className="text-xl mb-4">
        {error.data}
      </p>
      <Link to="/" className="btn btn-primary">
        Return Home
      </Link>
    </div>
  );
};

export default Error;