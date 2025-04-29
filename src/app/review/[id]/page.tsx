'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import getRestaurant from '@/libs/getRestaurant';
import { Rating } from '@mui/material';
import styles from './ReviewPage.module.css';
import { useSession } from 'next-auth/react';
import addRating from '@/libs/addRating';

export default function ReviewPage({ params }: { params: { id: string } }) {
  const router = useRouter(); // add router for a button to navigate to restaurant page after click the button
  const { data: session } = useSession();
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

  // Handle form submission // WIP from Markkongphop anyone can edit I need to do some other thing ....... Chanunchita edit some more can look what i have edited from the comment 
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true); // Set loading state
    console.log("Session Token:", session?.user?.token);
    console.log("Selected Restaurant ID:", restaurant.id);
    console.log("Score:", rating);
    console.log("Comment:", comment);

    if (!session?.user?.token || !restaurant || !rating || !comment) {
      alert("Please fill all field");
      // setShowErrorAlert(true);
      setIsSubmitting(false); //add setissubmitting to false
      return;
    }
    //Add Try-catch error
    try{
      //change restaurant -> restaurant.id
    const success = await addRating(rating,comment,restaurant.id,session?.user?.token)

    if(success){
      router.push(`/restaurant/${params.id}`)
      alert("Thank for review our Restaurant!");
      alert(restaurant.id);
      alert(rating);
      alert(comment);

      // Reset form after Post a review
      setRating(0);
      setComment('');
      setName('');

    }
  }catch (error) {
    console.error("Error submitting review:", error);
    alert("There was an error submitting your review. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
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
            data-testid="rating-stars"
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
        
        <button type="submit" disabled={isSubmitting} className={styles.submitButton}> {isSubmitting ? 'Submitting...' : 'Post Review'}</button>
      </form>
     
      </div>
    </div>    
  );
}