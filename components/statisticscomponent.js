import styles from '../styles/Styles.module.css';

export const StatisticsComponent = props => {
  return (
    <>
      <div className={styles.bars}>
        <div>
          <p>Acousticness</p>
          <span className={styles.tooltip}>?
            <span className={styles.tooltiptext}>Acoustic music is music that solely or primarily uses instruments that produce sound through acoustic means, as opposed to electric or electronic means.</span>
          </span>
          <div className={styles.my_progress}>
            <div id="acousticnessBar" className={styles.my_bar}></div>
          </div>
        </div>
      
        <div>
          <p>Danceability</p>
          <span className={styles.tooltip}>?
            <span className={styles.tooltiptext}>Describes how suitable the playlist is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity.</span>
          </span>
          <div className={styles.my_progress}>
            <div id="danceabilityBar" className={styles.my_bar}></div>
          </div>
        </div>            

        <div>
          <p>Energy</p>
          <span className={styles.tooltip}>?
            <span className={styles.tooltiptext}>Represents a perceptual measure of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy. For example, death metal has high energy, while a Bach prelude scores low on the scale. Perceptual features contributing to this attribute include dynamic range, perceived loudness, timbre, onset rate, and general entropy.</span>
          </span>
          <div className={styles.my_progress}>
            <div id="energyBar" className={styles.my_bar}></div>
          </div>
        </div>

        <div>
          <p>Valence</p>
          <span className={styles.tooltip}>?
            <span className={styles.tooltiptext}>Describes the musical positiveness conveyed. Music with high valence sounds more positive (e.g. happy, cheerful, euphoric), while music with low valence sounds more negative (e.g. sad, depressed, angry).</span>
          </span>
          <div className={styles.my_progress}>
            <div id="valenceBar" className={styles.my_bar}></div>
          </div>
        </div>
      </div>

      <div className={styles.top_genres}>
        {props.topGenres?.map((item) => (
          <div key={item.id} className={styles.genre}>
            <p>{item.id.slice(1,item.id.length-1)}</p>
          </div>
        ))}
      </div>

      <div className={styles.top_artists}>
        {props.topArtists?.map((item) => (
        <div key={item.id} className={styles.artist}>
          <p>{item.name}</p>
        </div>
      ))}
      </div>
    </>
  );  
}