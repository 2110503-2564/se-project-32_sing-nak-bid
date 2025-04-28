'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Filter, Star, StarHalf, ChevronDown, ArrowLeft, MessageSquare, AlertTriangle, BarChart3 } from 'lucide-react';
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
  
  // New states for frontend enhancements
  const [sortOption, setSortOption] = useState('newest');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [activeReviewId, setActiveReviewId] = useState<string | null>(null);
  const [managerNotes, setManagerNotes] = useState<{[key: string]: string}>({});
  const [noteInputValue, setNoteInputValue] = useState('');
  const [highlightedReviews, setHighlightedReviews] = useState<{[key: string]: boolean}>({});
  const [showAnalytics, setShowAnalytics] = useState(false);

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
    // Apply rating filter and sorting
    let filtered = [...reviews];
    
    // Apply rating filter
    if (selectedRating !== null) {
      filtered = filtered.filter(review => review.score === selectedRating);
    }
    
    // Apply sorting
    if (sortOption === 'newest') {
      // For demo purpose, sort by ID as a proxy for date
      filtered.sort((a, b) => b._id.localeCompare(a._id));
    } else if (sortOption === 'oldest') {
      filtered.sort((a, b) => a._id.localeCompare(b._id));
    } else if (sortOption === 'highest') {
      filtered.sort((a, b) => b.score - a.score);
    } else if (sortOption === 'lowest') {
      filtered.sort((a, b) => a.score - b.score);
    }
    
    setFilteredReviews(filtered);
  }, [selectedRating, sortOption, reviews]);

  const handleFilterClick = (rating: number | null) => {
    setSelectedRating(rating);
    setShowFilterMenu(false);
  };
  
  const handleSortChange = (option: string) => {
    setSortOption(option);
    setShowSortMenu(false);
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
  
  const toggleNoteEditor = (reviewId: string) => {
    if (activeReviewId === reviewId) {
      setActiveReviewId(null);
    } else {
      setActiveReviewId(reviewId);
      setNoteInputValue(managerNotes[reviewId] || '');
    }
  };
  
  const saveNote = (reviewId: string) => {
    setManagerNotes(prev => ({
      ...prev,
      [reviewId]: noteInputValue
    }));
    setActiveReviewId(null);
  };
  
  const toggleHighlight = (reviewId: string) => {
    setHighlightedReviews(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
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
  
  // Manager analytics data
  const ratingDistribution = {
    5: reviews.filter(r => r.score === 5).length,
    4: reviews.filter(r => r.score === 4).length,
    3: reviews.filter(r => r.score === 3).length,
    2: reviews.filter(r => r.score === 2).length,
    1: reviews.filter(r => r.score === 1).length,
  };
  
  const highRatings = ratingDistribution[5] + ratingDistribution[4];
  const lowRatings = ratingDistribution[2] + ratingDistribution[1];
  const highPercentage = reviews.length > 0 ? Math.round((highRatings / reviews.length) * 100) : 0;

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <div className={styles.headerContainer}>
        <div className={styles.headerContent}>
          <Link href={`/`} className={styles.backButton}>
            <ArrowLeft />
          </Link>
          <h1 className={styles.headerTitle}>
            {restaurant?.name || 'Restaurant'} Review Management
          </h1>
        </div>
      </div>
      
      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Manager Dashboard */}
        <div className={styles.managerDashboard}>
          <div className={styles.dashboardHeader}>
            <h2 className={styles.dashboardTitle}>Review Management Dashboard</h2>
            <button 
              className={styles.analyticsToggle}
              onClick={() => setShowAnalytics(!showAnalytics)}
            >
              <BarChart3 size={16} />
              {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
            </button>
          </div>

          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{reviews.length}</div>
              <div className={styles.statLabel}>Total Reviews</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{getAverageRating()}</div>
              <div className={styles.statLabel}>Average Rating</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{highPercentage}%</div>
              <div className={styles.statLabel}>Positive Reviews</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{highlightedReviews ? Object.keys(highlightedReviews).filter(key => highlightedReviews[key]).length : 0}</div>
              <div className={styles.statLabel}>Highlighted</div>
            </div>
          </div>
          
          {showAnalytics && (
            <div className={styles.analyticsSection}>
              <h3 className={styles.analyticsTitle}>Rating Distribution</h3>
              <div className={styles.ratingBars}>
                {[5, 4, 3, 2, 1].map(rating => {
                  const count = ratingDistribution[rating as keyof typeof ratingDistribution];
                  const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                  
                  return (
                    <div key={rating} className={styles.ratingBar}>
                      <div className={styles.ratingLabel}>{rating} Star</div>
                      <div className={styles.barContainer}>
                        <div 
                          className={`${styles.bar} ${
                            rating >= 4 ? styles.barHigh : 
                            rating === 3 ? styles.barMedium : 
                            styles.barLow
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className={styles.ratingCount}>{count}</div>
                    </div>
                  );
                })}
              </div>
              
              <div className={styles.insightSection}>
                <h3 className={styles.insightTitle}>Quick Insights</h3>
                <ul className={styles.insightList}>
                  <li>
                    {highPercentage >= 80 ? '👍 Excellent customer satisfaction.' : 
                     highPercentage >= 60 ? '👍 Good customer satisfaction.' : 
                     '⚠️ Customer satisfaction needs improvement.'}
                  </li>
                  <li>
                    {ratingDistribution[3] > (reviews.length * 0.25) ? 
                      '⚠️ High number of neutral reviews - opportunity to convert to positive.' : 
                      '✓ Low number of neutral reviews.'}
                  </li>
                  <li>
                    {lowRatings > 0 ? 
                      `⚠️ ${lowRatings} negative reviews require attention.` : 
                      '👍 No negative reviews.'}
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
        
        {/* Filter Controls */}
        <div className={styles.filterControls}>
          {/* Rating Filter */}
          <div className={styles.filterContainer}>
            <button 
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className={styles.filterButton}
            >
              <Filter size={16} />
              <span>{selectedRating === null ? 'All Ratings' : `${selectedRating} Star Reviews`}</span>
              <ChevronDown size={16} />
            </button>
            
            {showFilterMenu && (
              <div className={styles.filterMenu}>
                <ul>
                  <li 
                    className={styles.filterMenuItem}
                    onClick={() => handleFilterClick(null)}
                  >
                    All Ratings
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
          
          {/* Sort Control */}
          <div className={styles.filterContainer}>
            <button 
              onClick={() => setShowSortMenu(!showSortMenu)}
              className={styles.sortButton}
            >
              <span>
                {sortOption === 'newest' ? 'Newest First' : 
                 sortOption === 'oldest' ? 'Oldest First' : 
                 sortOption === 'highest' ? 'Highest Rated' : 
                 'Lowest Rated'}
              </span>
              <ChevronDown size={16} />
            </button>
            
            {showSortMenu && (
              <div className={styles.filterMenu}>
                <ul>
                  <li 
                    className={styles.filterMenuItem}
                    onClick={() => handleSortChange('newest')}
                  >
                    Newest First
                  </li>
                  <li 
                    className={styles.filterMenuItem}
                    onClick={() => handleSortChange('oldest')}
                  >
                    Oldest First
                  </li>
                  <li 
                    className={styles.filterMenuItem}
                    onClick={() => handleSortChange('highest')}
                  >
                    Highest Rated
                  </li>
                  <li 
                    className={styles.filterMenuItem}
                    onClick={() => handleSortChange('lowest')}
                  >
                    Lowest Rated
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
        
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
              <div 
                key={review._id} 
                className={`${styles.reviewCard} ${highlightedReviews[review._id] ? styles.highlightedReview : ''}`}
              >
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
                  
                  {/* Manager action buttons */}
                  <div className={styles.reviewActions}>
                    <button 
                      className={`${styles.actionButton} ${highlightedReviews[review._id] ? styles.activeButton : ''}`} 
                      onClick={() => toggleHighlight(review._id)}
                      title={highlightedReviews[review._id] ? "Remove highlight" : "Highlight review"}
                    >
                      <AlertTriangle size={16} />
                    </button>
                    <button 
                      className={`${styles.actionButton} ${activeReviewId === review._id ? styles.activeButton : ''}`}
                      onClick={() => toggleNoteEditor(review._id)}
                      title="Add manager note"
                    >
                      <MessageSquare size={16} />
                    </button>
                  </div>
                </div>
                
                <div className={styles.reviewContent}>
                  <p>{review.comment || "No comment provided."}</p>
                </div>
                
                {/* Manager Notes Section */}
                {managerNotes[review._id] && (
                  <div className={styles.managerNoteContainer}>
                    <div className={styles.managerNoteHeader}>
                      <span className={styles.managerBadge}>Manager Note</span>
                    </div>
                    <div className={styles.managerNoteContent}>
                      <p>{managerNotes[review._id]}</p>
                    </div>
                  </div>
                )}
                
                {/* Note Editor */}
                {activeReviewId === review._id && (
                  <div className={styles.noteEditorContainer}>
                    <textarea 
                      className={styles.noteTextarea}
                      value={noteInputValue}
                      onChange={(e) => setNoteInputValue(e.target.value)}
                      placeholder="Add your private note about this review..."
                      rows={3}
                    />
                    <div className={styles.noteEditorActions}>
                      <button 
                        className={styles.cancelButton}
                        onClick={() => setActiveReviewId(null)}
                      >
                        Cancel
                      </button>
                      <button 
                        className={styles.saveButton}
                        onClick={() => saveNote(review._id)}
                        disabled={!noteInputValue.trim()}
                      >
                        Save Note
                      </button>
                    </div>
                  </div>
                )}
                
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