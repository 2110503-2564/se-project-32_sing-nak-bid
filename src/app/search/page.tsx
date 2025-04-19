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
                            key={restaurant._id} // ใช้ _id เป็น Key เนื่องจากเป็น Unique Identifier
                            href={`/restaurant/${restaurant._id}`}
                            className="block bg-white rounded-xl shadow-2xl hover:scale-105 transition duration-300 overflow-hidden"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
                                <div className="relative aspect-w-16 aspect-h-9 rounded-md overflow-hidden">
                                    {/* Placeholder for Restaurant Image */}
                                    <div className="bg-gray-200 flex items-center justify-center h-full w-full">
                                        <span className="text-gray-500 text-sm">No Image Available</span>
                                    </div>
                                    {/* หากมี URL รูปภาพ:
                                    <img
                                        src={restaurant.imageUrl}
                                        alt={restaurant.name}
                                        className="object-cover w-full h-full"
                                    />
                                    */}
                                </div>
                                <div className="flex flex-col justify-center space-y-2">
                                    <h2 className="text-xl font-semibold">{restaurant.name}</h2>
                                    <p><span className="font-medium text-gray-700">Tel:</span> {restaurant.tel}</p>
                                    <p><span className="font-medium text-gray-700">Address:</span> {restaurant.address}</p>
                                    <p><span className="font-medium text-gray-700">Open:</span> {restaurant.opentime}</p>
                                    <p><span className="font-medium text-gray-700">Close:</span> {restaurant.closetime}</p>
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