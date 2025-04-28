"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { AlertCircle, Link } from 'lucide-react';

// Define types based on your provided data structure
type Review = {
  _id: string;
  user: string;
  score: number;
  comment: string;
  id: string; // Assuming 'id' is also present
};

type Restaurant = {
  _id: string;
  name: string;
  address: string;
  district: string;
  province: string;
  postalcode: string;
  tel: string;
  region: string;
  opentime: string;
  closetime: string;
  managerId: string;
  __v: number;
  averageRating: number;
  ratings?: Review[];
  reservations?: any[]; // You can define a more specific type if needed
  menuItems?: any[]; // You can define a more specific type if needed
  id: string; // Assuming 'id' is also present
};

type ApiResponse = {
  success: boolean;
  count: number;
  data: Restaurant[];
};

export default function ReviewVertifyPage() {
  const { data: session } = useSession();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurantsWithReviews = async () => {
      if (session?.user?.role !== "admin") {
        setError("You are not authorized to view this page.");
        setIsLoading(false);
        return;
      }

      try {
        // Replace '/api/admin/restaurants-with-all-data' with your actual API endpoint
        const response = await fetch('http://localhost:5000/api/v1/restaurants',{
          method: "GET",
        });
        if (!response.ok) {
          const message = `An error occurred: ${response.status}`;
          throw new Error(message);
        }
        const data: ApiResponse = await response.json();
        setRestaurants(data.data);
        setIsLoading(false);
      } catch (error: any) {
        console.error('Error fetching restaurants with all data:', error);
        setError(`Failed to load data: ${error.message}`);
        setIsLoading(false);
      }
    };

    fetchRestaurantsWithReviews();
  }, [session?.user?.role]);

  const handleDeleteReview = async (restaurantId: string, reviewId: string) => {
    const restaurantToUpdate = restaurants.find(restaurant => restaurant._id === restaurantId);

    if (restaurantToUpdate) {
      const updatedRatings = restaurantToUpdate.ratings?.filter(review => review._id !== reviewId) || [];

      try {
        // Replace with your actual API endpoint for updating a restaurant
        const response = await fetch(`http://localhost:5000/api/v1/restaurants/${restaurantId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${session?.user.token}`,
          },
          body: JSON.stringify({ ratings: updatedRatings }),
        });

        if (response.ok) {
          setRestaurants(prevRestaurants =>
            prevRestaurants.map(restaurant =>
              restaurant._id === restaurantId
                ? { ...restaurant, ratings: updatedRatings }
                : restaurant
            )
          );
          console.log(`Review ${reviewId} virtually deleted by updating restaurant ${restaurantId}.`);
          // Optionally show a success message.
        } else {
          console.error('Failed to update restaurant to delete review:', response);
          // Optionally show an error message.
        }
      } catch (error: any) {
        console.error('Error updating restaurant:', error);
        // Optionally show an error message.
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md animate-pulse">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-300"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          <p className="text-gray-500">Loading restaurant data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md">
          <div className="flex justify-center mb-4">
            <AlertCircle size={48} className="text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-center mb-4">Oops! Something went wrong</h2>
          <p className="text-red-700 text-center mb-6">{error}</p>
          <Link href="/" className="w-full text-center bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition block">
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Restaurant Data and Reviews</h1>
        {restaurants.length === 0 ? (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4">
            <p className="text-yellow-700">No restaurant data found.</p>
          </div>
        ) : (
          restaurants.map((restaurant) => (
            <div key={restaurant._id} className="mb-8 p-6 border rounded-md">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">{restaurant.name}</h2>
              <p className="text-gray-600 mb-1">Address: {restaurant.address}, {restaurant.district}, {restaurant.province} {restaurant.postalcode}</p>
              <p className="text-gray-600 mb-1">Tel: {restaurant.tel}</p>
              <p className="text-gray-600 mb-2">Region: {restaurant.region}</p>

              <h3 className="text-lg font-semibold text-gray-700 mt-4 mb-2">Reviews:</h3>
              {restaurant.ratings && restaurant.ratings.length > 0 ? (
                <ul>
                  {restaurant.ratings.map((review) => (
                    <li key={review._id} className="py-2 border-b last:border-b-0 flex items-center justify-between">
                      <div>
                        <p><strong>User ID:</strong> {review.user}</p>
                        <p><strong>Score:</strong> {review.score}</p>
                        <p><strong>Comment:</strong> {review.comment}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteReview(restaurant._id, review._id)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No reviews for this restaurant yet.</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}