import { SearchBar } from "../search_bar";
import darkModeLogo from "../../../assets/logos/darkModeLogoEmblem.png";
import { STYLES } from "../../../constants/styles";

export const DashboardHeader = () => {
  return (
    <div className='flex flex-col max-w-full m-auto my-8 md:my-0 w-[85vw] md:w-[70vw] md:p-15 overflow-hidden gap-4'>
      <div className='flex flex-row flex-1 flex-wrap justify-around align-center h-[40vh] w-[60vw] m-auto'>
        <img
          src={darkModeLogo}
          alt='SOY_JIMB Recruitment Logo'
          className='max-w-[400px] w-[100%]'
        />
        <h1
          className={`md:text-5xl md:block hidden m-auto font-bold ${STYLES.dark.text.primary} ${STYLES.dark.text.primary}`}
        >
          Find the Perfect Candidate
        </h1>
      </div>
      <SearchBar />
    </div>
  );
};
