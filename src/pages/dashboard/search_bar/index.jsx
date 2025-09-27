import { useEffect, useState } from "react";
import { Search, Filter, ChevronDown } from "lucide-react";
import { SearchResult } from "../search_result";
import CandidateDetailsModal from "../../../components/candidate_details_modal";
import { Skeleton } from "../../../components/skeleton";
import { STYLES } from "../../../constants/styles";
import { FilterComponent } from "./filter_component";

export const SearchBar = () => {
  const [searchQueryTerm, setSearchQueryTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [fieldInput, setFieldInput] = useState("");
  const [skillsInput, setSkillsInput] = useState("");
  const [minExperience, setMinExperience] = useState("");
  const [maxExperience, setMaxExperience] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // Search state
  const [searchResult, setSearchResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryParams, setSearchQueryParams] = useState(null);
  const [searchQueryLimit, setSearchQueryLimit] = useState(3);
  const [searchQueryMaxLength, setSearchQueryMaxLength] = useState(0);
  const [activeSearchResult, setActiveSearchResult] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  //Ternary Conditionals
  const CONTAINER_STYLE =
    searchQuery || searchQueryParams || showFilters
      ? `${STYLES.dark.background.secondary} shadow-xl ${STYLES.dark.border.strong}`
      : `${STYLES.dark.background.primary} shadow-none border-transparent`;
  const SEARCH_BAR_STYLE =
    searchQuery || searchQueryParams || showFilters
      ? STYLES.dark.background.darkest
      : STYLES.dark.background.tertiary;
  const FILTER_BUTTON_STYLE = showFilters
    ? `border ${STYLES.dark.border.medium} bg-[${STYLES.dark.accent.color}] ${STYLES.dark.text.secondary} ${STYLES.dark.accent.red}`
    : `bg-gray-200 border-4 border-[${STYLES.dark.accent.color}] text-[${STYLES.dark.accent.color}] hover:bg-gray-100`;
  const CHEVRON_STYLE = showFilters ? "rotate-180" : "";
  const SHOW_MORE_BUTTON_STYLE =
    searchQueryLimit === searchQueryMaxLength
      ? STYLES.dark.text.paragraph
      : `${STYLES.dark.text.paragraph} hover:bg-gray-800 hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[${STYLES.dark.accent.color}] transition-all duration-900 ease-out`;

  // Conditionals
  const ACTIVE_SEARCH =
    searchResult &&
    !searchQueryTerm &&
    !fieldInput &&
    !skillsInput &&
    !minExperience &&
    !maxExperience &&
    !selectedStatus;
  const HAS_ACTIVE_FILTERS =
    fieldInput ||
    skillsInput ||
    minExperience ||
    maxExperience ||
    selectedStatus;

  const getData = () => {
    try {
      const ROOT_PARAM = "/.netlify/functions/user";
      const LIMIT_PARAM = `limit=${searchQueryLimit}`;
      let url = `${ROOT_PARAM}?name=${searchQuery.toLowerCase()}&${LIMIT_PARAM}`;

      if (searchQueryParams) {
        let modUrl = ROOT_PARAM + "?";
        for (const key in searchQueryParams) {
          modUrl += `${key}=${searchQueryParams[key]}&`;
        }

        if (searchQuery) modUrl += `name=${searchQuery.toLowerCase()}&`;

        url = modUrl + LIMIT_PARAM;
      }

      // isFetching is being used as a way of not allowing another call while fetching is in process
      setIsFetching(true);
      setShowFilters(false);

      fetch(url)
        .then((res) => res.json())
        .then((value) => {
          if (value && value.body.length > 0) {
            setSearchResult(value.body);
            setSearchQueryMaxLength(value.maxLength);
            setIsSearching(false);
          }
          setIsSearching(false);
          setIsFetching(false);
        });
      return;
    } catch (e) {
      setSearchResult(null);
      setSearchQueryParams(null);
      setIsSearching(false);
      setIsFetching(false);
      console.warn("Error:", e);
      return;
    }
  };

  useEffect(() => {
    if (
      (searchQuery ||
        (searchQueryParams &&
          Object.values(searchQueryParams).some((val) => val))) &&
      isSearching &&
      !isFetching
    ) {
      getData();
    }
    return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, isSearching]);

  // Because of the conditions in the initial UseEffect it would be too much of a logical hurdle to create a better condition
  useEffect(() => {
    if (searchResult && searchResult.length > 0) getData();
    return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQueryLimit]);

  const handleShowMore = () => {
    const nextIncrement = searchQueryLimit + 5;
    if (nextIncrement <= searchQueryMaxLength)
      setSearchQueryLimit(nextIncrement);
    else if (
      nextIncrement > searchQueryMaxLength &&
      searchQueryLimit !== searchQueryMaxLength
    )
      setSearchQueryLimit(searchQueryMaxLength);
  };

  const handleSearch = (event) => {
    if (event.code === "Enter" || event.type === "click") {
      setIsSearching(false);
      setSearchResult(null);
      setSearchQueryParams(null);
      const searchParams = {
        field: fieldInput,
        skills: skillsInput
          .split(",")
          .map((skill) => skill.trim().toLowerCase().replace(" ", "-"))
          .filter((skill) => skill)
          .join("+"),
        minExperience: minExperience ? parseInt(minExperience) : null,
        maxExperience: maxExperience ? parseInt(maxExperience) : null,
        status: selectedStatus.replace(" ", "+"),
      };

      if (Object.values(searchParams).some((val) => val)) {
        // Remove unused Keys
        for (const key in searchParams) {
          if (!searchParams[key]) delete searchParams[key];
        }
        // Because the searchQueryTerm is not updated it wont call the fetch request when only modifying the searchParams
        setSearchQueryParams(searchParams);
        setSearchQuery(searchQueryTerm);
      } else {
        setSearchQueryParams(null);
        setSearchQuery(searchQueryTerm);
      }

      //Reset on new searches
      if (searchQueryLimit !== 3) setSearchQueryLimit(3);
      setIsSearching(true);
    }
  };

  const clearFilters = () => {
    setFieldInput("");
    setSkillsInput("");
    setMinExperience("");
    setMaxExperience("");
    setSelectedStatus("");
  };

  return (
    <div
      className={`mx-auto rounded-xl p-6 pt-0 mt-0 transition-all duration-300 ease-in-out border ${CONTAINER_STYLE}`}
    >
      <div className={`bg-transparent rounded-xl p-8`}>
        {/* Main Search Bar */}
        <div className='flex-row items-center justify-around space-y-6'>
          <div
            className={`w-[90%] m-auto flex justify-center items-center ${SEARCH_BAR_STYLE} ${STYLES.dark.border.medium} rounded-xl px-5 py-3 space-x-4 shadow-lg`}
          >
            <Search className={`h-5 w-5 ${STYLES.dark.text.paragraph}`} />
            <input
              type='text'
              value={searchQueryTerm}
              onChange={(e) => setSearchQueryTerm(e.target.value)}
              onKeyDownCapture={(e) => handleSearch(e)}
              placeholder='Search by name, or email...'
              className={`block w-full pl-6 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[${STYLES.dark.accent.color}] ${SEARCH_BAR_STYLE} focus:border-[${STYLES.dark.accent.color}] backdrop-blur-sm ${STYLES.dark.text.primary} border-transparent placeholder-gray-500`}
            />
          </div>
          <div className='w-full flex flex-row justify-around'>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 justify-center ${FILTER_BUTTON_STYLE} w-[200px] hover:shadow-md hover:scale-105 transition-all duration-300 shadow-lg`}
            >
              <Filter className='h-5 w-5' />
              <span>Filters</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${CHEVRON_STYLE}`}
              />
            </button>
            <button
              onClick={() => {
                if (ACTIVE_SEARCH) {
                  setSearchResult(null);
                  setSearchQueryParams(null);
                } else {
                  handleSearch({ code: "Enter" });
                }
              }}
              className={`px-8 py-3 bg-[${STYLES.dark.accent.color}] ${STYLES.dark.text.primary} rounded-lg hover:bg-[${STYLES.dark.accent.red}] focus:ring-2 focus:ring-[${STYLES.dark.accent.color}] focus:outline-none font-medium hover:shadow-md hover:scale-105 transition-all duration-300 w-[200px] shadow-lg`}
            >
              {ACTIVE_SEARCH ? "Clear Results" : "Search"}
            </button>
          </div>
        </div>

        {/* Filters Section */}
        {showFilters && (
          <FilterComponent
            hasActiveFilters={HAS_ACTIVE_FILTERS}
            clearFilters={clearFilters}
            fieldInput={fieldInput}
            setFieldInput={setFieldInput}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            skillsInput={skillsInput}
            setSkillsInput={setSkillsInput}
            minExperience={minExperience}
            setMinExperience={setMinExperience}
            maxExperience={maxExperience}
            setMaxExperience={setMaxExperience}
          />
        )}

        {/* Active Filters Summary */}
        {HAS_ACTIVE_FILTERS && (
          <div className='mb-6 mt-6 p-4 bg-red-50 rounded-lg border border-red-200'>
            <div
              className={`flex items-center space-x-2 text-sm text-[${STYLES.dark.accent.color}]`}
            >
              <Filter className='h-4 w-4' />
              <span className='font-medium'>Active Filters:</span>
              <div className='flex flex-wrap gap-2'>
                {fieldInput && (
                  <span className='bg-red-200 px-2 py-1 rounded text-xs'>
                    Field: {fieldInput}
                  </span>
                )}
                {selectedStatus && (
                  <span className='bg-red-200 px-2 py-1 rounded text-xs'>
                    Status: {selectedStatus}
                  </span>
                )}
                {skillsInput && (
                  <span className='bg-red-200 px-2 py-1 rounded text-xs'>
                    Skills: {skillsInput}
                  </span>
                )}
                {minExperience && (
                  <span className='bg-red-200 px-2 py-1 rounded text-xs'>
                    Min: {minExperience}y
                  </span>
                )}
                {maxExperience && (
                  <span className='bg-red-200 px-2 py-1 rounded text-xs'>
                    Max: {maxExperience}y
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Search Results */}
        {(searchQuery || searchQueryParams) && (
          <div className='mt-6 animate-in slide-in-from-top-2 fade-in-0 duration-500 ease-out'>
            {isSearching ? (
              <Skeleton type='searchResult' searchQuery={searchQuery} />
            ) : !searchResult && !isSearching ? (
              /* No Results State */
              <div
                className={`${STYLES.dark.background.darkest} rounded-lg border ${STYLES.dark.border.strong} p-8 text-center animate-in fade-in-0 zoom-in-95 duration-500 delay-300 ease-out`}
              >
                <div
                  className={`w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full ${STYLES.dark.background.tertiary} animate-in fade-in-0 scale-in-0 duration-300 delay-600`}
                >
                  <svg
                    className={`w-6 h-6 ${STYLES.dark.text.paragraph}`}
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                    />
                  </svg>
                </div>
                <div className='animate-in fade-in-0 slide-in-from-bottom-2 duration-400 delay-700 ease-out'>
                  <h3
                    className={`text-lg font-medium ${STYLES.dark.text.secondary} mb-2`}
                  >
                    No users found
                  </h3>
                  <p className={`text-sm ${STYLES.dark.text.paragraph} mb-4`}>
                    We couldn't find any users matching "{searchQuery}". Try
                    adjusting your search terms.
                  </p>
                </div>
                <div
                  className={`space-y-2 text-xs ${STYLES.dark.text.paragraph}`}
                >
                  <p
                    className='opacity-0 animate-in fade-in-0 duration-300 delay-900'
                    style={{ animationFillMode: "forwards" }}
                  >
                    • Check for typos in your search
                  </p>
                  <p
                    className='opacity-0 animate-in fade-in-0 duration-300 delay-1000'
                    style={{ animationFillMode: "forwards" }}
                  >
                    • Try using different keywords
                  </p>
                  <p
                    className='opacity-0 animate-in fade-in-0 duration-300 delay-1100'
                    style={{ animationFillMode: "forwards" }}
                  >
                    • Use fewer words in your search
                  </p>
                </div>
              </div>
            ) : (
              <div className='p-8'>
                <div className='space-y-4'>
                  {/* Results Header */}
                  <div className='flex items-center justify-between animate-in fade-in-0 slide-in-from-top-1 duration-400 delay-200 ease-out'>
                    <div>
                      <h2
                        className={`text-lg font-semibold ${STYLES.dark.text.secondary}`}
                      >
                        Search Results
                      </h2>
                      <p
                        className={`text-sm ${STYLES.dark.text.paragraph} mt-1`}
                      >
                        Found {searchResult.length}{" "}
                        {searchResult.length === 1 ? "user" : "users"} that
                        match your requirements
                      </p>
                    </div>
                  </div>

                  {/* Results List */}
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                    {searchResult.map((r, index) => (
                      <div
                        key={index}
                        className='animate-in fade-in-0 slide-in-from-bottom-3 duration-400 ease-out'
                        style={{
                          animationDelay: `${300 + index * 100}ms`,
                          animationFillMode: "both",
                        }}
                      >
                        <SearchResult
                          searchResult={r}
                          setSearchResult={() => {
                            setActiveSearchResult(r);
                            setIsModalVisible(true);
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Load More Section */}
                  {searchResult.length > 0 && (
                    <div
                      className={`pt-6 border-t ${STYLES.dark.border.light} animate-in fade-in-0 slide-in-from-bottom-2 duration-400 ease-out`}
                      style={{
                        animationDelay: `${400 + searchResult.length * 100}ms`,
                        animationFillMode: "both",
                      }}
                    >
                      <div className='text-center'>
                        <button
                          onAuxClick={(e) => {
                            // ask for increment and sort
                            window.alert("MWAHAHAH");
                          }}
                          disabled={searchQueryLimit === searchQueryMaxLength}
                          onClick={() => {
                            handleShowMore();
                          }}
                          className={`group inline-flex items-center px-6 py-2 border ${STYLES.dark.border.medium} shadow-sm text-sm font-medium rounded-md ${STYLES.dark.background.secondary} ${SHOW_MORE_BUTTON_STYLE}`}
                        >
                          <svg
                            className='w-4 h-4 mr-2 transition-transform duration-200 group-hover:translate-y-0.5'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M19 9l-7 7-7-7'
                            />
                          </svg>
                          Show More Results
                        </button>
                        <p
                          className={`text-xs ${STYLES.dark.text.paragraph} mt-2`}
                        >
                          Showing {searchResult.length} results of{" "}
                          {searchQueryMaxLength}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      <CandidateDetailsModal
        candidate={activeSearchResult}
        isOpen={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          setActiveSearchResult(null);
        }}
      />
    </div>
  );
};
