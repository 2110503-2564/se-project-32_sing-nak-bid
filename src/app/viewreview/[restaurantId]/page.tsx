'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Filter, Star, StarHalf, UserCircle, ChevronUp, ChevronDown, AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import getRatings from '@/libs/getRatings';
import getRestaurant from '@/libs/getRestaurant';
import Link from 'next/link';

// Define types for restaurant reviews
type Review = {
  _id: string;
  user: string;
  restaurant: string;
  score: number;
  comment: string;
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
  const [sortOrder, setSortOrder] = useState<'highest' | 'lowest'>('highest');
  const [ratingDistribution, setRatingDistribution] = useState<number[]>([0, 0, 0, 0, 0]);

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
        const reviewsData = reviewsResponse.data || [];
        setReviews(reviewsData);
        setFilteredReviews(reviewsData);
        
        // Calculate rating distribution
        calculateRatingDistribution(reviewsData);
      } catch (error: any) {
        console.error('Error fetching reviews:', error);
        setError(`Failed to load reviews: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [params.restaurantId, session?.user?.token]);

  const calculateRatingDistribution = (reviewsData: Review[]) => {
    const distribution = [0, 0, 0, 0, 0]; // [1-star, 2-star, 3-star, 4-star, 5-star]
    
    reviewsData.forEach(review => {
      if (review.score >= 1 && review.score <= 5) {
        distribution[review.score - 1]++;
      }
    });
    
    setRatingDistribution(distribution);
  };

  useEffect(() => {
    // Filter and sort reviews
    let result = [...reviews];

    // Apply rating filter
    if (selectedRating !== null) {
      result = result.filter(review => review.score === selectedRating);
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortOrder === 'highest') {
        return b.score - a.score;
      } else {
        return a.score - b.score;
      }
    });

    setFilteredReviews(result);
  }, [selectedRating, reviews, sortOrder]);

  const handleFilterClick = (rating: number | null) => {
    setSelectedRating(rating);
    setShowFilterMenu(false);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'highest' ? 'lowest' : 'highest');
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    
    const sum = reviews.reduce((total, review) => total + review.score, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const renderStarRating = (rating: number) => {
    return (
      <div className="flex text-yellow-400">
        {[...Array(5)].map((_, i) => (
          <span key={i}>
            {i < Math.floor(rating) ? <Star className="fill-yellow-400" size={20} /> : 
             i === Math.floor(rating) && rating % 1 >= 0.5 ? <StarHalf className="fill-yellow-400" size={20} /> : 
             <Star className="text-gray-300" size={20} />}
          </span>
        ))}
      </div>
    );
  };

  // Debug function to verify counts
  const countReviewsByRating = (rating: number) => {
    return reviews.filter(review => review.score === rating).length;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md animate-pulse">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-200"></div>
          <div className="h-6 bg-amber-100 rounded w-3/4 mx-auto mb-4"></div>
          <div className="h-4 bg-amber-100 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md">
          <div className="flex justify-center mb-4">
            <AlertCircle size={48} className="text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-center mb-4">Oops! Something went wrong</h2>
          <p className="text-red-700 text-center mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
          >
            <RefreshCw size={18} />
            Try again
          </button>
        </div>
      </div>
    );
  }

  const totalReviews = reviews.length;

  return (
    <div className="bg-amber-50 min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* ปุ่มย้อนกลับไปหน้า view review */}
        <Link 
          href="/restaurant"
          className="inline-flex items-center text-amber-600 hover:text-amber-800 font-medium mb-4 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>กลับไป</span>
        </Link>

        {restaurant && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border-b-4 border-amber-400">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{restaurant.name}</h1>
            <p className="text-gray-600 mb-4">{restaurant.address}</p>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center bg-amber-100 px-4 py-2 rounded-full">
                <span className="text-3xl font-bold text-amber-600 mr-2">{calculateAverageRating()}</span>
                {renderStarRating(parseFloat(calculateAverageRating()))}
              </div>
              <p className="text-gray-600">{totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="bg-amber-500 p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Customer Reviews</h2>
            <div className="flex gap-3">
              <button 
                onClick={toggleSortOrder}
                className="bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-lg flex items-center gap-1"
              >
                <span>Sort: {sortOrder === 'highest' ? 'Highest' : 'Lowest'}</span>
                {sortOrder === 'highest' ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
              </button>
              
              <div className="relative">
                <button 
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                  className="bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-lg flex items-center gap-1"
                >
                  <span>Filter</span>
                  <Filter size={16} />
                </button>
                
                {showFilterMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-10 border border-gray-200 overflow-hidden">
                    <div className="p-3 border-b border-gray-200 bg-amber-50">
                      <h3 className="font-semibold text-gray-700">Rating Filter</h3>
                    </div>
                    <ul>
                      <li 
                        className={`px-4 py-3 hover:bg-amber-50 cursor-pointer ${selectedRating === null ? 'bg-amber-100' : ''}`}
                        onClick={() => handleFilterClick(null)}
                      >
                        All Reviews
                      </li>
                      {[5, 4, 3, 2, 1].map(rating => {
                        // Get actual count directly from reviews array
                        const actualCount = countReviewsByRating(rating);
                        
                        return (
                          <li 
                            key={rating}
                            className={`px-4 py-2 hover:bg-amber-50 cursor-pointer flex items-center justify-between ${selectedRating === rating ? 'bg-amber-100' : ''}`}
                            onClick={() => handleFilterClick(rating)}
                          >
                            <div className="flex items-center">
                              {renderStarRating(rating)}
                              <span className="ml-2">({rating} {rating === 1 ? 'star' : 'stars'})</span>
                            </div>
                            <span className="text-gray-500">{actualCount}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="p-4 md:p-6">
            {/* Rating distribution bars */}
            <div className="mb-6 bg-amber-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Rating Distribution</h3>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map(rating => {
                  // Get actual count directly from reviews array 
                  const actualCount = countReviewsByRating(rating);
                  const percentage = totalReviews > 0 ? (actualCount / totalReviews) * 100 : 0;
                  
                  return (
                    <div key={rating} className="flex items-center">
                      <div className="w-24 flex items-center">
                        {rating} {rating === 1 ? 'star' : 'stars'}
                      </div>
                      <div className="flex-1 mx-4">
                        <div className="bg-gray-200 h-3 rounded-full overflow-hidden">
                          <div 
                            className="bg-amber-400 h-full rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="w-16 text-gray-600 text-sm">
                        {actualCount} {actualCount === 1 ? 'review' : 'reviews'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {filteredReviews.length === 0 ? (
              <div className="bg-amber-50 rounded-lg p-8 text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle size={24} className="text-amber-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Reviews Found</h3>
                <p className="text-gray-600">
                  {selectedRating !== null 
                    ? `No ${selectedRating}-star reviews available.` 
                    : 'There are no reviews yet for this restaurant.'}
                </p>
                {selectedRating !== null && (
                  <button 
                    onClick={() => setSelectedRating(null)}
                    className="mt-4 bg-amber-100 hover:bg-amber-200 text-amber-800 px-4 py-2 rounded-lg transition"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredReviews.map(review => (
                  <div key={review._id} className="bg-white p-5 rounded-lg border border-gray-100 hover:shadow-md transition">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className="bg-amber-100 p-2 rounded-full mr-3">
                          <UserCircle size={24} className="text-amber-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{review.user}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {renderStarRating(review.score)}
                        <span className="ml-2 text-amber-600 font-bold">{review.score.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="pl-10">
                      <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                      <div className="mt-3 pt-3 border-t border-dashed border-gray-200">
                        <div className="flex justify-between items-center">
                          <div className="text-xs text-gray-500">
                            {/* This is a placeholder for the date, which is not in your data */}
                            <span>Review ID: {review._id.substring(0, 8)}...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}