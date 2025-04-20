'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import getRestaurantsUser from '@/libs/getRestaurantUser'; // Adjust the import path
import { Restaurant } from '../../../interfaces';
import { getFuzzyMatches } from '@/utils/fuzzySearch'; // Ensure this utility exists
import Link from 'next/link';

interface ApiResponse {
    success: boolean;
    count: number;
    data: Restaurant[];
}

const SearchPage = () => {
    const searchParams = useSearchParams();
    const query = searchParams.get('query');
    const [searchResults, setSearchResults] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchAndSearch = async () => {
            if (query && typeof query === 'string') {
                setLoading(true);
                setError(null);
                try {
                    const response: ApiResponse = await getRestaurantsUser();
                    const restaurants = response?.data || [];
                    const matches = getFuzzyMatches(query, restaurants, (restaurant: any) => restaurant.name);
                    setSearchResults(matches);
                } catch (err: any) {
                    setError('Failed to fetch restaurants.');
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            } else {
                setSearchResults([]);
                setLoading(false);
            }
        };

        fetchAndSearch();
    }, [query]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Searching for restaurants...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
    }

    return (
        <div className="flex flex-col items-center p-8">
            <h1 className="text-3xl font-semibold mb-10 text-center">Search Results for "{query}"</h1>
            <div className="w-full max-w-2xl space-y-8">
                
                {searchResults.length > 0 ? (
                    searchResults.map((restaurant) => (
                        <Link
                            key={restaurant._id}
                            href={`/restaurant/${restaurant._id}`}
                            className="block transform transition duration-300 hover:scale-105"
                        >
                            <div className="relative flex justify-center items-center">
                                {/* Animation Card Container */}
                                <div className="relative w-[300px] md:w-[900px] rounded-[14px] shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff] overflow-hidden z-10 flex justify-center items-center">
                                    <div className="absolute top-[5px] left-[5px] w-[calc(100%-10px)] h-[calc(100%-10px)] z-20 bg-white/95 backdrop-blur-[24px] rounded-[10px] border-2 border-white"></div>
                                    <div className="absolute top-1/2 left-1/2 w-[150px] h-[150px] rounded-full bg-red-500 opacity-70 blur-[12px] z-0 animate-[blob-bounce_5s_infinite_ease]"></div>
                    
                                    {/* Restaurant Content */}
                                    <div className="relative z-30 grid grid-cols-1 md:grid-cols-2 gap-4 p-6 w-full">
                                        <div className="aspect-w-16 aspect-h-9 rounded-md overflow-hidden bg-gray-200 flex items-center justify-center">
                                            {/*<span className="text-gray-500 text-sm">No Image Available</span>*/}
                                            <img src="/img/Jeh-O.jpg" alt={restaurant.name} className="object-cover w-full h-full" />
                                        </div>
                                        <div className="flex flex-col justify-center space-y-2 text-gray-800">
                                            <h2 className="text-xl font-semibold">{restaurant.name}</h2>
                                            <p><span className="font-medium text-gray-700">Tel:</span> {restaurant.tel}</p>
                                            <p><span className="font-medium text-gray-700">Address:</span> {restaurant.address}</p>
                                            <p><span className="font-medium text-gray-700">Open:</span> {restaurant.opentime}</p>
                                            <p><span className="font-medium text-gray-700">Close:</span> {restaurant.closetime}</p>
                                        </div>
                                        {/*social icon */}
                                        <div className="col-span-2 mt-1 ml-[320px]">
                                            <ul className="flex space-x-4">
                                            {/* WhatsApp */}
                                            <li className="relative group">
                                            <a
                                                href="https://wa.me/1234567890"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label="WhatsApp"
                                                className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white text-gray-700 shadow-md transition-all duration-300 hover:text-white hover:shadow-lg"
                                            >
                                            <div className="absolute bottom-0 left-0 w-full h-0 bg-green-600 rounded-full transition-all duration-300 group-hover:h-full z-0"></div>
                                            <svg className="relative z-10 w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M16.55 13.41c-.27-.13-1.6-.79-1.85-.88-.25-.09-.43-.13-.61.13s-.7.88-.86 1.06c-.16.18-.32.2-.59.07-.27-.13-1.13-.42-2.16-1.34-.8-.71-1.34-1.59-1.5-1.86-.16-.27-.02-.42.12-.55.13-.13.27-.3.4-.45.13-.15.18-.25.27-.41.09-.16.04-.3-.02-.42-.07-.13-.61-1.46-.83-2-.22-.54-.44-.47-.61-.48-.16-.01-.34-.01-.52-.01-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.29 0 1.34.98 2.64 1.11 2.82.14.18 1.93 2.95 4.68 4.14.65.28 1.16.45 1.56.57.66.21 1.26.18 1.73.11.53-.08 1.6-.65 1.82-1.29.23-.64.23-1.19.16-1.29-.07-.1-.25-.16-.52-.28zM12.01 2C6.48 2 2 6.48 2 12c0 1.99.58 3.84 1.57 5.4L2 22l4.72-1.55C8.16 21.41 10.01 22 12 22c5.52 0 10-4.48 10-10s-4.48-10-10-10z"></path>
                                            </svg>
                                            </a>
                                            </li>

                                            {/* Facebook */}
                                            <li className="relative group">
                                                <a
                                                    href="https://facebook.com"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    aria-label="Facebook"
                                                    className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white text-gray-700 shadow-md transition-all duration-300 hover:text-white hover:shadow-lg"
                                                >
                                                <div className="absolute bottom-0 left-0 w-full h-0 bg-blue-700 rounded-full transition-all duration-300 group-hover:h-full z-0"></div>
                                                <svg className="relative z-10 w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M22.675 0h-21.35C.596 0 0 .596 0 1.326v21.348C0 23.404.596 24 1.325 24H12.82V14.708h-3.078v-3.62h3.078V8.413c0-3.066 1.877-4.737 4.616-4.737 1.312 0 2.438.097 2.767.14v3.21l-1.899.001c-1.491 0-1.779.709-1.779 1.747v2.292h3.558l-.464 3.62h-3.094V24h6.065C23.404 24 24 23.404 24 22.674V1.326C24 .596 23.404 0 22.675 0z"/>
                                                </svg>
                                                </a>
                                            </li>

                                            {/* Instagram */}
                                            <li className="relative group">
                                            <a
                                            href="https://instagram.com"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label="Instagram"
                                            className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white text-gray-700 shadow-md transition-all duration-300 hover:text-white hover:shadow-lg"
                                            >
                        
                                            <div className="absolute bottom-0 left-0 w-full h-0 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-full transition-all duration-300 group-hover:h-full z-0"></div>
                                            <svg className="relative z-10 w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2.2c3.2 0 3.584.012 4.85.07 1.17.054 1.97.24 2.428.403a4.9 4.9 0 0 1 1.77 1.046 4.9 4.9 0 0 1 1.046 1.77c.163.458.349 1.258.403 2.428.058 1.266.07 1.65.07 4.85s-.012 3.584-.07 4.85c-.054 1.17-.24 1.97-.403 2.428a4.9 4.9 0 0 1-1.046 1.77 4.9 4.9 0 0 1-1.77 1.046c-.458.163-1.258.349-2.428.403-1.266.058-1.65.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.054-1.97-.24-2.428-.403a4.9 4.9 0 0 1-1.77-1.046 4.9 4.9 0 0 1-1.046-1.77c-.163-.458-.349-1.258-.403-2.428C2.212 15.584 2.2 15.2 2.2 12s.012-3.584.07-4.85c.054-1.17.24-1.97.403-2.428A4.9 4.9 0 0 1 3.719 2.95a4.9 4.9 0 0 1 1.77-1.046c.458-.163 1.258-.349 2.428-.403C8.416 2.212 8.8 2.2 12 2.2zm0 1.8c-3.15 0-3.522.012-4.763.068-1.023.047-1.58.218-1.947.362a3.1 3.1 0 0 0-1.146.748 3.1 3.1 0 0 0-.748 1.146c-.144.367-.315.924-.362 1.947C3.212 8.478 3.2 8.85 3.2 12s.012 3.522.068 4.763c.047 1.023.218 1.58.362 1.947a3.1 3.1 0 0 0 .748 1.146 3.1 3.1 0 0 0 1.146.748c.367.144.924.315 1.947.362 1.241.056 1.613.068 4.763.068s3.522-.012 4.763-.068c1.023-.047 1.58-.218 1.947-.362a3.1 3.1 0 0 0 1.146-.748 3.1 3.1 0 0 0 .748-1.146c.144-.367.315-.924.362-1.947.056-1.241.068-1.613.068-4.763s-.012-3.522-.068-4.763c-.047-1.023-.218-1.58-.362-1.947a3.1 3.1 0 0 0-.748-1.146 3.1 3.1 0 0 0-1.146-.748c-.367-.144-.924-.315-1.947-.362C15.522 4.012 15.15 4 12 4zM12 7.2a4.8 4.8 0 1 1 0 9.6 4.8 4.8 0 0 1 0-9.6zm0 1.8a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm5.4-.9a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z"/>
                                            </svg>
                                            </a>
                                            </li>
                                            </ul>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p className="text-center text-lg text-gray-600">No restaurants found matching your search.</p>
                )}
            </div>  

        </div>
    );
};

export default SearchPage;