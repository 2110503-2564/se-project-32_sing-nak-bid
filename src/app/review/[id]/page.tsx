'use client';

import { useEffect, useState } from 'react';
import getRestaurant from '@/libs/getRestaurant';
import { Rating } from '@mui/material';
import styles from './ReviewPage.module.css'

export default function ReviewPage({ params }: { params: { id: string } }) {
  const [restaurant, setRestaurant] = useState<any | null>(null);
  const [name, setName] = useState('');
  const [rating, setRating] = useState<number | null>(0); 
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await getRestaurant(params.id);
        setRestaurant(response.data);
      } catch (error) {
        console.error('Error fetching restaurant:', error);
      }
    };

    fetchRestaurant();
  }, [params.id]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    // Still WIP
  };

  if (!restaurant) {
    return <p>Loading restaurant details...</p>;
  }

  return (
    <div className={styles.container}>
    <img src="/img/Food4.png" alt={`${restaurant.name} picture`} className={styles.restaurantImage} />
      <div className='flex flex-col items-center justify-center'>
      <h1 className={styles.header}>Review {restaurant.name} Restaurant</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>Your Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
            className={styles.input}
          />
        </div>
        
        {/* Rating */}
        <div className={styles.formGroup}>
          <label htmlFor="rating" className={styles.label}>Rating</label>
          <Rating
            className={styles.rating}
            id="rating"
            value={rating}
            onChange={(_, newValue) => setRating(newValue)}
            precision={0.5}
            size="large"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="comment" className={styles.label}>Your Comment</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Leave a comment..."
            rows={4}
            className={styles.textarea}
          />
        </div>
        
        
      </form>
      <button type="submit" disabled={isSubmitting} className={styles.submitButton}>Post Review</button>
      </div>
    </div>
  );
}