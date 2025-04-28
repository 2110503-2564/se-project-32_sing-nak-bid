'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Filter } from 'lucide-react';
import getRatings from '@/libs/getRatings';
import styles from './ManagerReviewPage.module.css';
import getRestaurant from '@/libs/getRestaurant';

// Define types for restaurant reviews
type Review = {
  _id: string;
  user: {
    name?: string;
    email: string;
  };
  restaurant: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export default function ManagerReviewPage({ params }: { params: { restaurantId: string } }) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [restaurant, setRestaurant] = useState<any>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!session?.user?.token) {
        setError('You must be logged in to view reviews');
        setIsLoading(false);
        return;
      }

      try {
        // Fetch restaurant details
        const restaurantResponse = await getRestaurant(params.restaurantId);
        setRestaurant(restaurantResponse.data);
        
        // Fetch reviews for this restaurant
        const reviewsResponse = await getRatings(params.restaurantId);
        // Since you're using your custom functions, they might already return parsed JSON
        // Modify this part based on what your getRatings function returns
        setReviews(reviewsResponse.data || []);
        setFilteredReviews(reviewsResponse.data || []);
      } catch (error: any) {
        console.error('Error fetching reviews:', error);
        setError(`Failed to load reviews: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [params.restaurantId, session?.user?.token]);

  useEffect(() => {
    // Apply rating filter when selectedRating changes
    if (selectedRating === null) {
      setFilteredReviews(reviews);
    } else {
      setFilteredReviews(reviews.filter(review => review.rating === selectedRating));
    }
  }, [selectedRating, reviews]);

  const handleFilterClick = (rating: number | null) => {
    setSelectedRating(rating);
    setShowFilterMenu(false);
  };

  const renderStarRating = (rating: number) => {
    return (
      <div className="flex text-yellow-400">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="text-xl">
            {i < rating ? "★" : "☆"}
          </span>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return <div className="text-center py-10">กำลังโหลดรีวิว...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
        {error}
        <button 
          onClick={() => window.location.reload()}
          className="ml-3 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          ลองใหม่
        </button>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 min-h-screen p-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-amber-100 rounded-lg p-6 shadow">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Customer Review</h1>
            <div className="relative">
              <button 
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className="bg-yellow-400 py-1 px-4 rounded flex items-center space-x-2"
              >
                <span>SORT</span>
                <Filter size={16} />
              </button>
              
              {showFilterMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                  <ul>
                    <li 
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleFilterClick(null)}
                    >
                      All Reviews
                    </li>
                    {[5, 4, 3, 2, 1].map(rating => (
                      <li 
                        key={rating}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                        onClick={() => handleFilterClick(rating)}
                      >
                        {renderStarRating(rating)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          
          {filteredReviews.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              ไม่พบรีวิวที่ตรงกับเงื่อนไขที่เลือก
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReviews.map(review => (
                <div key={review._id} className="bg-white p-4 rounded-lg shadow">
                  {renderStarRating(review.rating)}
                  <p className="text-gray-700 mt-2">{review.comment}</p>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>โดย: {review.user?.name || review.user?.email || 'ผู้ใช้ไม่ระบุชื่อ'}</p>
                    <p>เมื่อ: {new Date(review.createdAt).toLocaleDateString('th-TH')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}