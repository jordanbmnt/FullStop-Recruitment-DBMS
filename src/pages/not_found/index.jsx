import whyYouDo from '../assets/images/not_found/whyYouDo.png';

const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <img
          src={whyYouDo}
          alt="Not Found"
          className="mb-6 h-30 w-30 mx-auto"
        />
        <h1 className="text-4xl font-bold text-gray-800">404 - Page Not Found</h1>
        <p className="mt-4 text-gray-600">The page you are looking for does not exist.</p>
      </div>
    </div>
  );
}

export default NotFound;