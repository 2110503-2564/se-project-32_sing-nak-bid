'use client'
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import getRestaurantsUser from '@/libs/getRestaurantUser'; // Adjust the import path
import { Restaurant } from '../../../interfaces';
import { getFuzzyMatches } from '@/utils/fuzzySearch'; // We'll create this utility

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

  useEffect(() => {
    const fetchAndSearch = async () => {
      if (query && typeof query === 'string') {
        setLoading(true);
        setError(null);
        try {
          const response: ApiResponse = await getRestaurantsUser();
          const restaurants = response?.data || []; // Extract the data array
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
    return <div>Searching for restaurants...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Search Results for "{query}"</h1>
      {searchResults.length > 0 ? (
        <ul>
          {searchResults.map((restaurant) => (
            <li key={restaurant.name}>{restaurant.name}</li>
          ))}
        </ul>
      ) : (
        <p>No restaurants found matching your search.</p>
      )}
    </div>
  );
};

export default SearchPage;