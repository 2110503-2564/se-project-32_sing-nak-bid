'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Filter, Star, StarHalf, ChevronDown, ArrowLeft } from 'lucide-react';
import getRatings from '@/libs/getRatings';
import getRestaurant from '@/libs/getRestaurant';
import Link from 'next/link';
import styles from './ManagerReviewPage.module.css';

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
      setFilteredReviews(reviews.filter(review => review.score === selectedRating));
    }
  }, [selectedRating, reviews]);

  const handleFilterClick = (rating: number | null) => {
    setSelectedRating(rating);
    setShowFilterMenu(false);
  };

  const renderStarRating = (rating: number) => {
    return (
      <div className={styles.starRating}>
        {[...Array(5)].map((_, i) => (
          <span key={i}>
            {i < Math.floor(rating) ? (
              <Star className={styles.starFilled} />
            ) : i < rating ? (
              <StarHalf className={styles.starHalf} />
            ) : (
              <Star className={styles.starEmpty} />
            )}
          </span>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingCard}>
          <div className={styles.loadingSpinner}></div>
          <p className={styles.loadingText}>Loading Reviews...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.errorCard}>
          <div className={styles.errorMessage}>
            {error}
            <button 
              onClick={() => window.location.reload()}
              className={styles.retryButton}
            >
             Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.score, 0);
    return (sum / reviews.length).toFixed(1);
  };

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <div className={styles.headerContainer}>
        <div className={styles.headerContent}>
          <Link href={`/`} className={styles.backButton}>
            <ArrowLeft />
          </Link>
          <h1 className={styles.headerTitle}>
            {restaurant?.name || 'Restaurant'} Reviews
          </h1>
        </div>
      </div>
      
      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Summary Card */}
        <div className={styles.summaryCard}>
          <div className={styles.summaryHeader}>
            <div>
              <h2 className={styles.summaryTitle}>Review Summary</h2>
              <div className={styles.ratingOverview}>
                <span className={styles.averageScore}>{getAverageRating()}</span>
                {renderStarRating(parseFloat(getAverageRating()))}
                <span className={styles.reviewCount}>({reviews.length} reviews)</span>
              </div>
            </div>
            
            <div className={styles.filterContainer}>
              <button 
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className={styles.filterButton}
              >
                <span>{selectedRating === null ? 'Filter Reviews' : `${selectedRating} Star Reviews`}</span>
                <ChevronDown size={16} />
              </button>
              
              {showFilterMenu && (
                <div className={styles.filterMenu}>
                  <ul>
                    <li 
                      className={styles.filterMenuItem}
                      onClick={() => handleFilterClick(null)}
                    >
                      All Reviews
                    </li>
                    {[5, 4, 3, 2, 1].map(rating => (
                      <li 
                        key={rating}
                        className={styles.filterMenuRating}
                        onClick={() => handleFilterClick(rating)}
                      >
                        <span>{rating} Star</span>
                        {renderStarRating(rating)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Reviews List */}
        {filteredReviews.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>
              <Star />
            </div>
            <h3 className={styles.emptyStateTitle}>No reviews found</h3>
            <p className={styles.emptyStateText}>
              {selectedRating === null
                ? "This restaurant hasn't received any reviews yet."
                : `No ${selectedRating}-star reviews available.`}
            </p>
          </div>
        ) : (
          <div className={styles.reviewsList}>
            {filteredReviews.map(review => (
              <div key={review._id} className={styles.reviewCard}>
                <div className={styles.reviewHeader}>
                  <div>
                    <div className={styles.reviewRating}>
                      {renderStarRating(review.score)}
                      <span className={styles.ratingText}>
                        {review.score === 5 ? "Excellent" : 
                         review.score === 4 ? "Very Good" : 
                         review.score === 3 ? "Good" : 
                         review.score === 2 ? "Fair" : "Poor"}
                      </span>
                    </div>
                    <p className={styles.reviewerName}>
                      {review.user ? review.user.split('@')[0] : 'Anonymous'}
                    </p>
                  </div>
                </div>
                <div className={styles.reviewContent}>
                  <p>{review.comment || "No comment provided."}</p>
                </div>
                <div className={styles.reviewFooter}>
                  <div className={styles.reviewerId}>
                    Customer ID: {review.user.substring(0, 8)}...
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}