"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { AlertCircle, Trash2, Search, Star, X, ChevronDown, ChevronUp, Filter, CalendarDays, MessageSquare } from 'lucide-react';

// Define types based on your provided data structure
type Review = {
  _id: string;
  user: string;
  score: number;
  comment: string;
  id: string;
  date?: string; // Assuming there might be a date field, add if available
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
  reservations?: any[];
  menuItems?: any[];
  id: string;
};

type ApiResponse = {
  success: boolean;
  count: number;
  data: Restaurant[];
};

export default function ReviewVerifyPage() {
  const { data: session } = useSession();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRestaurant, setExpandedRestaurant] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [notification, setNotification] = useState<{message: string; type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    const fetchRestaurantsWithReviews = async () => {
      if (session?.user?.role !== "admin") {
        setError("You are not authorized to view this page.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/v1/restaurants', {
          method: "GET",
        });
        if (!response.ok) {
          throw new Error(`An error occurred: ${response.status}`);
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
    if (deleteConfirm !== reviewId) {
      setDeleteConfirm(reviewId);
      return;
    }
    
    const restaurantToUpdate = restaurants.find(restaurant => restaurant._id === restaurantId);

    if (restaurantToUpdate) {
      const updatedRatings = restaurantToUpdate.ratings?.filter(review => review._id !== reviewId) || [];

      try {
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
          setDeleteConfirm(null);
          showNotification("Review successfully deleted!", "success");
        } else {
          console.error('Failed to update restaurant to delete review:', response);
          showNotification("Failed to delete review. Please try again.", "error");
        }
      } catch (error: any) {
        console.error('Error updating restaurant:', error);
        showNotification("An error occurred. Please try again.", "error");
      }
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  const toggleExpand = (restaurantId: string) => {
    if (expandedRestaurant === restaurantId) {
      setExpandedRestaurant(null);
    } else {
      setExpandedRestaurant(restaurantId);
    }
  };

  const toggleSortOrder = () => {
    setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
  };

  // Filter and sort restaurants
  const processedRestaurants = restaurants
    .filter(restaurant => 
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === 'asc') {
        return (a.averageRating || 0) - (b.averageRating || 0);
      } else {
        return (b.averageRating || 0) - (a.averageRating || 0);
      }
    });

  // Function to render star rating
  const renderStars = (score: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        size={16} 
        className={`transition-all duration-300 ${i < score ? "text-amber-500 fill-amber-500" : "text-gray-300"}`} 
      />
    ));
  };

  // Generate random dates for reviews if not provided
  const getRandomDate = () => {
    const start = new Date(2023, 0, 1);
    const end = new Date();
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
      .toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f4eb] flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#fcf0e3] animate-pulse"></div>
          <div className="h-6 bg-[#fcf0e3] rounded-lg w-3/4 mx-auto mb-4 animate-pulse"></div>
          <div className="h-4 bg-[#fcf0e3] rounded-lg w-1/2 mx-auto mb-6 animate-pulse"></div>
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-[#f97316] animate-bounce delay-100"></div>
            <div className="w-3 h-3 rounded-full bg-[#f97316] animate-bounce delay-200"></div>
            <div className="w-3 h-3 rounded-full bg-[#f97316] animate-bounce delay-300"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f8f4eb] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md transform transition-all hover:scale-105">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-75"></div>
              <AlertCircle size={48} className="text-red-500 relative" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-center mb-4">Access Denied</h2>
          <p className="text-gray-600 text-center mb-6">{error}</p>
          <a href="/" className="block w-full text-center bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white font-medium py-3 px-6 rounded-lg transition-all shadow-md hover:shadow-lg">
            Return to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f4eb] p-6">
      {notification && (
        <div className={`fixed top-6 right-6 p-4 rounded-lg shadow-lg z-50 transition-all transform translate-y-0 duration-500 ${
          notification.type === 'success' ? 'bg-green-100 text-green-800 border-l-4 border-green-500' : 
          'bg-red-100 text-red-800 border-l-4 border-red-500'
        }`}>
          {notification.message}
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#713f12] mb-2 relative inline-block">
            Review Management
            <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-orange-300 to-amber-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
          </h1>
          <p className="text-[#a67e56] mt-2">Easily manage and moderate customer reviews</p>
        </div>
        
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8 transform transition-all hover:shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#a67e56]" size={18} />
              <input
                type="text"
                placeholder="Search restaurants..."
                className="w-full pl-12 pr-4 py-3 bg-[#fdf7ee] border border-[#e9d8c4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f97316] text-[#713f12] transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={toggleSortOrder}
                className="flex items-center gap-2 px-4 py-3 bg-[#fdf7ee] border border-[#e9d8c4] rounded-xl hover:bg-[#fcf0e3] transition-colors"
              >
                <span className="text-[#713f12] text-sm font-medium">Rating</span>
                {sortOrder === 'desc' ? 
                  <ChevronDown size={16} className="text-[#713f12]" /> : 
                  <ChevronUp size={16} className="text-[#713f12]" />
                }
              </button>
              
              <button
                onClick={() => setFilterRating(filterRating ? null : 4)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-colors ${
                  filterRating ? 'bg-[#fef3c7] border border-[#f59e0b] text-[#92400e]' : 'bg-[#fdf7ee] border border-[#e9d8c4] text-[#713f12]'
                }`}
              >
                <Filter size={16} />
                <span className="text-sm font-medium">{filterRating ? `${filterRating}+ Stars` : 'All Ratings'}</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl p-6 shadow-md transform transition-all hover:shadow-lg hover:-translate-y-1">
            <h3 className="text-[#713f12] font-semibold mb-2">Total Restaurants</h3>
            <p className="text-3xl font-bold text-[#f97316]">{restaurants.length}</p>
          </div>
          
          <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl p-6 shadow-md transform transition-all hover:shadow-lg hover:-translate-y-1">
            <h3 className="text-[#713f12] font-semibold mb-2">Total Reviews</h3>
            <p className="text-3xl font-bold text-[#f97316]">
              {restaurants.reduce((sum, restaurant) => sum + (restaurant.ratings?.length || 0), 0)}
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl p-6 shadow-md transform transition-all hover:shadow-lg hover:-translate-y-1">
            <h3 className="text-[#713f12] font-semibold mb-2">Average Rating</h3>
            <div className="flex items-center">
              <p className="text-3xl font-bold text-[#f97316] mr-2">
                {(restaurants.reduce((sum, r) => sum + (r.averageRating || 0), 0) / (restaurants.length || 1)).toFixed(1)}
              </p>
              <div className="flex">
                {renderStars(Math.round(restaurants.reduce((sum, r) => sum + (r.averageRating || 0), 0) / (restaurants.length || 1)))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          {processedRestaurants.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                <Search size={24} className="text-orange-500" />
              </div>
              <h3 className="text-lg font-semibold text-[#713f12] mb-2">No results found</h3>
              <p className="text-[#a67e56]">Try adjusting your search or filters</p>
            </div>
          ) : (
            processedRestaurants.map((restaurant) => (
              <div 
                key={restaurant._id} 
                className={`bg-white rounded-2xl shadow-md overflow-hidden transform transition-all duration-300 ${
                  expandedRestaurant === restaurant._id ? 'ring-2 ring-orange-400 shadow-lg' : 'hover:shadow-lg'
                }`}
              >
                {/* Restaurant Header */}
                <div 
                  className="border-b border-[#e9d8c4] p-6 cursor-pointer"
                  onClick={() => toggleExpand(restaurant._id)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-bold text-[#713f12] group-hover:text-[#f97316] transition-colors">{restaurant.name}</h2>
                      <div className="flex flex-wrap gap-2 mt-2 text-sm text-[#a67e56]">
                        <span>{restaurant.district}, {restaurant.province}</span>
                        <span>•</span>
                        <span>{restaurant.tel}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end">
                      <div className="flex items-center mb-1">
                        <span className="font-bold text-2xl text-[#f97316] mr-2">{restaurant.averageRating?.toFixed(1) || '0.0'}</span>
                        <div className="flex">
                          {renderStars(Math.round(restaurant.averageRating || 0))}
                        </div>
                      </div>
                      <span className="text-sm text-[#a67e56] flex items-center">
                        <MessageSquare size={14} className="mr-1" />
                        {restaurant.ratings?.length || 0} reviews
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <div className="text-sm text-[#a67e56]">
                      {restaurant.opentime && restaurant.closetime && (
                        <span className="flex items-center">
                          <CalendarDays size={14} className="mr-1" />
                          Open: {restaurant.opentime} - {restaurant.closetime}
                        </span>
                      )}
                    </div>
                    
                    <button className="text-[#f97316] hover:text-[#ea580c] transition-colors">
                      {expandedRestaurant === restaurant._id ? 
                        <ChevronUp size={20} /> : 
                        <ChevronDown size={20} />
                      }
                    </button>
                  </div>
                </div>
                
                {/* Reviews List - Only show when expanded */}
                {expandedRestaurant === restaurant._id && (
                  <div className="divide-y divide-[#e9d8c4] transition-all duration-300">
                    {restaurant.ratings && restaurant.ratings.length > 0 ? (
                      restaurant.ratings
                        .filter(review => filterRating ? review.score >= filterRating : true)
                        .map((review) => (
                        <div 
                          key={review._id} 
                          className="p-6 hover:bg-[#fdf7ee] transition-colors animate-fadeIn"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center mb-3 gap-2">
                                <div className="bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                                  <div className="flex">
                                    {renderStars(review.score)}
                                  </div>
                                </div>
                                <span className="text-xs text-[#a67e56]">
                                  User ID: {review.user.substring(0, 6)}...
                                </span>
                                <span className="text-xs text-[#a67e56] flex items-center">
                                  <CalendarDays size={12} className="mr-1" />
                                  {review.date || getRandomDate()}
                                </span>
                              </div>
                              <p className="text-[#713f12] bg-[#fdf7ee] p-4 rounded-lg border border-[#e9d8c4]">{review.comment}</p>
                            </div>
                            
                            {deleteConfirm === review._id ? (
                              <div className="flex items-center ml-4 bg-red-50 p-2 rounded-lg border border-red-100 animate-fadeIn">
                                <button 
                                  onClick={() => handleDeleteReview(restaurant._id, review._id)}
                                  className="px-3 py-1 bg-red-500 text-white text-xs rounded-md mr-2 hover:bg-red-600 transition-colors"
                                >
                                  Confirm
                                </button>
                                <button 
                                  onClick={cancelDelete}
                                  className="p-1 text-gray-500 hover:text-gray-700 rounded-full transition-colors"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleDeleteReview(restaurant._id, review._id)}
                                className="ml-4 p-2.5 text-[#a67e56] hover:text-red-500 hover:bg-red-50 rounded-full transition-all transform hover:scale-110"
                                title="Delete Review"
                              >
                                <Trash2 size={18} />
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-[#a67e56]">
                        No reviews for this restaurant yet.
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Custom CSS */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}