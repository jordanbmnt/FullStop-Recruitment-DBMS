import { SearchBar } from "../search_bar"
import darkModeLogo from "../../../assets/logos/darkModeLogoEmblem.png";
import { STYLES } from "../../../constants/styles";

export const DashboardHeader = () => {

  return (
    <div className="m-auto mt-0 w-[70vw] p-15">
      <div className="flex flex-row justify-around align-center h-[40vh] w-[60vw] m-auto">
        <img src={darkModeLogo} alt="" />
        <h1 className={`text-5xl m-auto font-bold ${STYLES.dark.text.primary}`}>Find the Perfect Candidate</h1>
      </div>
      <SearchBar />
    </div>
  )
}