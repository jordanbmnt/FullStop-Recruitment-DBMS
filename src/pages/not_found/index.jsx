import whyYouDo from '../../assets/images/not_found/whyYouDo.png';
import { STYLES } from '../../constants/styles';

const NotFound = () => {
  return (
    <div className={`flex items-center justify-center min-h-screen ${STYLES.dark.background['sidebar-gradient']} p-4`}>
      <div className="text-center">
        <img
          src={whyYouDo}
          alt="Not Found"
          className="mb-6 h-30 w-30 mx-auto"
        />
        <h1 className={`text-4xl font-bold ${STYLES.dark.text.primary}`}>404 - Page Not Found</h1>
        <p className={`mt-4 ${STYLES.dark.text.paragraph}`}>The page you are looking for does not exist.</p>
      </div>
    </div>
  );
}

export default NotFound;