import React from 'react';
import { useHistory } from 'react-router-dom';

const HomePage = () => {
    const history = useHistory();
    const goToTopics = (e) => {
        if (e.target.value === 'topics')
            return history.push(`/admin/topics`);
    }

    return (
        <div className="homepage">
            <div className='pt-18 md:pt-22.5 main-wrapper mx-auto h-full flex items-center'>
                <div className="relative max-w-vxs mx-auto md:w-full">
                    <select onChange={goToTopics} className="block bg-white w-full appearance-none h-10 border border-gray-3 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-4 focus:border-transparent event-select-dd text-gray-4 ">
                        <option value="">
                            Select
                        </option>
                        <option value="topics">
                            Topic
                        </option>
                    </select>
                    <div class="pointer-events-none absolute inset-y-0 right-1.5 flex items-center px-2 text-gray-7"><svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.375 1.40562L6.735 6.76512C6.76978 6.79995 6.81109 6.82759 6.85656 6.84644C6.90203 6.8653 6.95078 6.875 7 6.875C7.04922 6.875 7.09797 6.8653 7.14344 6.84644C7.18891 6.82759 7.23022 6.79995 7.265 6.76512L12.625 1.40562" stroke="#555658" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg></div>
                </div>
            </div>
        </div>
    )
}

export default HomePage