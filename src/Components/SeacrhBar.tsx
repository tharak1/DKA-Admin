import React from 'react';

const SeacrhBar: React.FC = () => {
    return (
        <form className="">
            <div className="flex">
                <label htmlFor="search-category" className="sr-only">Select Category</label>
                <select
                    id="search-category"
                    className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-gray-900 bg-gray-100 border border-gray-300 rounded-l-lg hover:bg-gray-200 focus:ring-2 focus:outline-none"
                >
                    <option>All categories</option>
                    <option>Mockups</option>
                    <option>Templates</option>
                    <option>Design</option>
                    <option>Logos</option>
                </select>
                <div className="relative w-96">
                    <input
                        type="search"
                        id="search-dropdown"
                        className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-r-lg border border-gray-300   placeholder-gray-400 focus:placeholder-gray-600"
                        placeholder="Search Mockups, Logos, Design Templates..."
                        required
                    />
                    <button
                        type="submit"
                        className="absolute top-0 right-0 bottom-0 p-3 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
                    >
                        <svg
                            className="w-4 h-4"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 20"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                            />
                        </svg>
                        <span className="sr-only">Search</span>
                    </button>
                </div>
            </div>
        </form>
    );
};

export default SeacrhBar;
