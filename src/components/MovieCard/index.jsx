
import './index.css'

const MovieCard = ({movieDetails, onBookNow, isSelected}) => {
  const {id, title, genre, duration, rating, image} = movieDetails

  return (
    <div className={`movie-card ${isSelected ? 'active-movie' : ''}`}>
      <img src={image} alt={title} />

      <div className="movie-details">
        <h2>{title}</h2>
        <p>{genre}</p>
        <p>Duration: {duration}</p>
        <p>⭐ {rating}</p>

        <button onClick={() => onBookNow(id)}>
          {isSelected ? 'Selected' : 'Book Now'}
        </button>
      </div>
    </div>
  )
}

export default MovieCard
