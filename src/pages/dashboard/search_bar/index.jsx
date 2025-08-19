import { useEffect, useState } from 'react';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import { SearchResult } from '../search_result';
import CandidateDetailsModal from '../../../components/candidate_details_modal';
import { Skeleton } from '../../../components/skeleton';
import { FIELDS, STATUSES } from '../../../helpers/constants';
import { STYLES } from '../../../constants/styles';

export const SearchBar = () => {
  const [searchQueryTerm, setSearchQueryTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [fieldInput, setFieldInput] = useState('');
  const [skillsInput, setSkillsInput] = useState('');
  const [minExperience, setMinExperience] = useState('');
  const [maxExperience, setMaxExperience] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

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

  const getData = () => {
    try {
      const ROOT_PARAM = "/.netlify/functions/get_cv_users";
      const LIMIT_PARAM = `limit=${searchQueryLimit}`;
      let url = `${ROOT_PARAM}?name=${searchQuery.toLowerCase()}&${LIMIT_PARAM}`;

      if (searchQueryParams) {
        let modUrl = ROOT_PARAM + '?';
        for (const key in searchQueryParams) {
          modUrl += `${key}=${searchQueryParams[key]}&`
        }

        if (searchQuery) modUrl += `name=${searchQuery.toLowerCase()}&`;

        url = modUrl + LIMIT_PARAM;
      }

      // isFetching is being used as a way of not allowing another call while fetching is in process
      setIsFetching(true);
      setShowFilters(false);

      fetch(url).then(res => res.json()).then(value => {
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
      setSearchQueryParams(null)
      setIsSearching(false);
      setIsFetching(false);
      console.warn("Error:", e)
      return;
    }

  }

  useEffect(() => {
    if ((searchQuery || (searchQueryParams && Object.values(searchQueryParams).some(val => val))) && isSearching && !isFetching) {
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
    if (nextIncrement <= searchQueryMaxLength) setSearchQueryLimit(nextIncrement);
    else if (nextIncrement > searchQueryMaxLength && searchQueryLimit !== searchQueryMaxLength) setSearchQueryLimit(searchQueryMaxLength)
  }

  const handleSearch = (event) => {
    if (event.code === "Enter" || event.type === "click") {
      setIsSearching(false);
      setSearchResult(null);
      setSearchQueryParams(null);
      const searchParams = {
        field: fieldInput,
        skills: skillsInput.split(',').map(skill => skill.trim().toLowerCase().replace(' ', '-')).filter(skill => skill).join('+'),
        minExperience: minExperience ? parseInt(minExperience) : null,
        maxExperience: maxExperience ? parseInt(maxExperience) : null,
        status: selectedStatus.replace(' ', '+')
      };

      if (Object.values(searchParams).some(val => val)) {
        // Remove unused Keys
        for (const key in searchParams) {
          if (!searchParams[key]) delete searchParams[key]
        }
        // Because the searchQueryTerm is not updated it wont call the fetch request when only modifying the searchParams
        setSearchQueryParams(searchParams);
        setSearchQuery(searchQueryTerm);
      }
      else {
        setSearchQueryParams(null);
        setSearchQuery(searchQueryTerm);
      }

      //Reset on new searches
      if (searchQueryLimit !== 3) setSearchQueryLimit(3);
      setIsSearching(true);
    }
  };

  const clearFilters = () => {
    setFieldInput('');
    setSkillsInput('');
    setMinExperience('');
    setMaxExperience('');
    setSelectedStatus('');
  };

  const hasActiveFilters = fieldInput || skillsInput || minExperience || maxExperience || selectedStatus;

  return (
    <div className="mx-auto p-6 pt-0 mt-0">
      <div className={`${STYLES.dark.background.primary} rounded-xl p-8`}>
        {/* Main Search Bar */}
        <div className="flex-row items-center justify-around space-y-6">
          <div className={`w-[90%] m-auto flex justify-center items-center ${STYLES.dark.background.tertiary} ${STYLES.dark.border.medium} rounded-xl px-5 py-3 space-x-4 shadow-lg`}>
            <Search className="h-5 w-5 text-gray-300" />
            <input
              type="text"
              value={searchQueryTerm}
              onChange={(e) => setSearchQueryTerm(e.target.value)}
              onKeyDownCapture={(e) => handleSearch(e)}
              placeholder="Search by name, or email..."
              className={`block w-full pl-6 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[${STYLES.dark.accent.color}] ${STYLES.dark.background.tertiary} focus:border-[${STYLES.dark.accent.color}] backdrop-blur-sm ${STYLES.dark.text.primary} border-transparent placeholder-gray-500 transition-all duration-200`}
            />
          </div>
          <div className="w-full flex flex-row justify-around">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 justify-center ${showFilters ?
                `border-2 border-gray-200 bg-[${STYLES.dark.accent.color}] text-gray-200 ${STYLES.dark.accent.red}` :
                `bg-gray-200 border-4 border-[${STYLES.dark.accent.color}] text-[${STYLES.dark.accent.color}] hover:bg-gray-100`} w-[200px] hover:shadow-md hover:scale-105 transition-all duration-300 shadow-lg`}
            >
              <Filter className="h-5 w-5" />
              <span>Filters</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            <button
              onClick={() => {
                if (searchResult &&
                  !searchQueryTerm &&
                  !fieldInput &&
                  !skillsInput &&
                  !minExperience &&
                  !maxExperience &&
                  !selectedStatus) {
                  setSearchResult(null);
                  setSearchQueryParams(null);
                } else {
                  handleSearch({ code: "Enter" });
                }
              }}
              className={`px-8 py-3 bg-[${STYLES.dark.accent.color}] text-white rounded-lg hover:bg-[${STYLES.dark.accent.red}] focus:ring-2 focus:ring-[${STYLES.dark.accent.color}] focus:outline-none font-medium hover:shadow-md hover:scale-105 transition-all duration-300 w-[200px] shadow-lg`}
            >
              {
                searchResult &&
                  !searchQueryTerm &&
                  !fieldInput &&
                  !skillsInput &&
                  !minExperience &&
                  !maxExperience &&
                  !selectedStatus ?
                  'Clear Results' : 'Search'
              }
            </button>
          </div>
        </div>

        {/* Filters Section */}
        {showFilters && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200 mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Advanced Filters</h3>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-red-600 hover:text-red-800 font-medium text-sm flex items-center space-x-1"
                >
                  <X className="h-4 w-4" />
                  <span>Clear All</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Field Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Field</label>
                <select
                  value={fieldInput}
                  onChange={(e) => setFieldInput(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a Field</option>
                  {
                    FIELDS.map(f => (<option value={`${f.toLowerCase()}`}>{f}</option>))
                  }
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a Status</option>
                  {
                    STATUSES.map(f => (<option value={`${f.value}`}>{f.display}</option>))
                  }
                </select>
              </div>

              {/* Skills Filter */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                <input
                  type="text"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  placeholder="e.g., React, JavaScript, Python (comma-separated)"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Separate multiple skills with commas</p>
              </div>

              {/* Experience Range */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
                <div className="flex space-x-4 items-center">
                  <div className="flex-1">
                    <input
                      type="number"
                      value={minExperience}
                      onChange={(e) => setMinExperience(e.target.value)}
                      placeholder="Min years"
                      min="0"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <span className="text-gray-500">to</span>
                  <div className="flex-1">
                    <input
                      type="number"
                      value={maxExperience}
                      onChange={(e) => setMaxExperience(e.target.value)}
                      placeholder="Max years"
                      min="0"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2 text-sm text-blue-800">
              <Filter className="h-4 w-4" />
              <span className="font-medium">Active Filters:</span>
              <div className="flex flex-wrap gap-2">
                {fieldInput && <span className="bg-blue-200 px-2 py-1 rounded text-xs">Field: {fieldInput}</span>}
                {selectedStatus && <span className="bg-blue-200 px-2 py-1 rounded text-xs">Status: {selectedStatus}</span>}
                {skillsInput && <span className="bg-blue-200 px-2 py-1 rounded text-xs">Skills: {skillsInput}</span>}
                {minExperience && <span className="bg-blue-200 px-2 py-1 rounded text-xs">Min: {minExperience}y</span>}
                {maxExperience && <span className="bg-blue-200 px-2 py-1 rounded text-xs">Max: {maxExperience}y</span>}
              </div>
            </div>
          </div>
        )}

        {/* Search Results */}
        {(searchQuery || searchQueryParams) && (
          <div className="mt-6 animate-in slide-in-from-top-2 fade-in-0 duration-500 ease-out">
            {
              isSearching ?
                ((<Skeleton type="searchResult" searchQuery={searchQuery} />)) :
                !searchResult && !isSearching ?
                  (
                    /* No Results State */
                    <div className="bg-white rounded-lg border border-gray-200 p-8 text-center animate-in fade-in-0 zoom-in-95 duration-500 delay-300 ease-out">
                      <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-gray-100 animate-in fade-in-0 scale-in-0 duration-300 delay-600">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <div className="animate-in fade-in-0 slide-in-from-bottom-2 duration-400 delay-700 ease-out">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No users found
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                          We couldn't find any users matching "{searchQuery}". Try adjusting your search terms.
                        </p>
                      </div>
                      <div className="space-y-2 text-xs text-gray-400">
                        <p className="opacity-0 animate-in fade-in-0 duration-300 delay-900" style={{ animationFillMode: 'forwards' }}>• Check for typos in your search</p>
                        <p className="opacity-0 animate-in fade-in-0 duration-300 delay-1000" style={{ animationFillMode: 'forwards' }}>• Try using different keywords</p>
                        <p className="opacity-0 animate-in fade-in-0 duration-300 delay-1100" style={{ animationFillMode: 'forwards' }}>• Use fewer words in your search</p>
                      </div>
                    </div>
                  ) :
                  (
                    <div className="p-8">
                      <div className="space-y-4">
                        {/* Results Header */}
                        <div className="flex items-center justify-between animate-in fade-in-0 slide-in-from-top-1 duration-400 delay-200 ease-out">
                          <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                              Search Results
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                              Found {searchResult.length} {searchResult.length === 1 ? 'user' : 'users'} that match your requirements
                            </p>
                          </div>
                        </div>

                        {/* Results List */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                          {searchResult.map((r, index) => (
                            <div
                              key={index}
                              className="animate-in fade-in-0 slide-in-from-bottom-3 duration-400 ease-out"
                              style={{
                                animationDelay: `${300 + index * 100}ms`,
                                animationFillMode: 'both'
                              }}
                            >
                              <SearchResult searchResult={r} setSearchResult={() => {
                                setActiveSearchResult(r);
                                setIsModalVisible(true)
                              }} />
                            </div>
                          ))}
                        </div>

                        {/* Load More Section */}
                        {searchResult.length > 0 && (
                          <div
                            className="pt-6 border-t border-gray-200 animate-in fade-in-0 slide-in-from-bottom-2 duration-400 ease-out"
                            style={{
                              animationDelay: `${400 + searchResult.length * 100}ms`,
                              animationFillMode: 'both'
                            }}
                          >
                            <div className="text-center">
                              <button
                                onAuxClick={(e) => {
                                  // ask for increment and sort
                                  window.alert("MWAHAHAH")
                                }}
                                disabled={searchQueryLimit === searchQueryMaxLength}
                                onClick={() => { handleShowMore() }}
                                className={`group inline-flex items-center px-6 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md bg-white ${searchQueryLimit === searchQueryMaxLength ? 'text-gray-100' : 'text-gray-700 hover:bg-gray-50 hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-900 ease-out'}`}
                              >
                                <svg className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                                Show More Results
                              </button>
                              <p className="text-xs text-gray-500 mt-2">
                                Showing {searchResult.length} results of {searchQueryMaxLength}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )

            }
          </div>
        )}
      </div>


      {/* Modal */}
      <CandidateDetailsModal candidate={activeSearchResult} isOpen={isModalVisible} onClose={() => {
        setIsModalVisible(false);
        setActiveSearchResult(null)
      }} />
    </div>

  );
};