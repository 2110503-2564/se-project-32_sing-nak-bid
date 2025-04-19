import styles from "./Homepagecard.module.css";


export default function HomeCard({ restaurantName, imgSrc, description }:{restaurantName : string, imgSrc :string , description : string}) {
  return (
    <div className={styles.card}>
     <img src={imgSrc} alt={restaurantName} className={styles.cardsvg}/>
      <div className={styles.card__content}>
        <h2 className={styles.card__title}>{restaurantName}</h2>
        <p className={styles.card__description}>{description}</p>
      </div>
    </div>
  );
}