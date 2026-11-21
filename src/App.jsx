
import {useState, useEffect} from 'react'

import Navbar from './components/Navbar'
import MovieCard from './components/MovieCard'
import SeatLayout from './components/SeatLayout'
import BookingSummary from './components/BookingSummary'
import Confirmation from './components/Confirmation'

import './App.css'

const moviesList = [
  {
    id: 1,
    title: 'Avengers Endgame',
    genre: 'Action',
    duration: '3h 1m',
    rating: 8.4,
    image: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
  },
  {
    id: 2,
    title: 'Spider-Man No Way Home',
    genre: 'Action',
    duration: '2h 28m',
    rating: 8.2,
    image: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
  },
  {
    id: 3,
    title: 'Interstellar',
    genre: 'Sci-Fi',
    duration: '2h 49m',
    rating: 8.7,
    image: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
  },
]

const showTimes = ['10:00 AM', '01:30 PM', '05:00 PM', '08:30 PM']

const App = () => {
  // State variables

  const [selectedMovie, setSelectedMovie] = useState(moviesList[0])
  const [showTime, setShowTime] = useState('05:00 PM')
  const [selectedSeats, setSelectedSeats] = useState([])
  const [bookings, setBookings] = useState([])
  const [confirmation, setConfirmation] = useState(null)
  const [editingBookingId, setEditingBookingId] = useState(null)
  const [seatMessage, setSeatMessage] = useState('')

  const ticketPrice = 200

  // Load bookings from Local Storage

  useEffect(() => {
    const savedBookings = JSON.parse(
      localStorage.getItem('cinemaBookings') || '[]'
    )

    setBookings(savedBookings)
  }, [])

  // Get booked seats

  const bookedSeats = bookings
    .filter(
      booking =>
        booking.movieId === selectedMovie?.id &&
        booking.showTime === showTime &&
        booking.id !== editingBookingId
    )
    .flatMap(booking => booking.seats)

  // Movie selection

  const onBookNow = id => {
    const movie = moviesList.find(each => each.id === id)

    setSelectedMovie(movie)
    setSelectedSeats([])
    setEditingBookingId(null)
    setConfirmation(null)
    setSeatMessage('')

    document.getElementById('booking')?.scrollIntoView({
      behavior: 'smooth',
    })
  }

  // Seat selection and deselection

  const onSeatSelect = seatId => {
    if (bookedSeats.includes(seatId)) {
      setSeatMessage(
        `Sorry! Seat ${seatId} is already booked. Please select another seat.`
      )
      return
    }

    setSeatMessage('')

    setSelectedSeats(prevSeats =>
      prevSeats.includes(seatId)
        ? prevSeats.filter(seat => seat !== seatId)
        : [...prevSeats, seatId]
    )
  }

  // Show time selection

  const onShowTimeChange = time => {
    setShowTime(time)
    setSelectedSeats([])
    setSeatMessage('')
    setConfirmation(null)
  }

  // Edit booking

  const onEditBooking = booking => {
    const movie = moviesList.find(
      each => each.id === booking.movieId
    )

    setSelectedMovie(movie)
    setShowTime(booking.showTime)
    setSelectedSeats(booking.seats)
    setEditingBookingId(booking.id)
    setSeatMessage('')
    setConfirmation(null)

    document.getElementById('booking')?.scrollIntoView({
      behavior: 'smooth',
    })
  }

  // Cancel booking

  const onCancelBooking = id => {
    const confirmCancel = window.confirm(
      'Are you sure you want to cancel this booking?'
    )

    if (!confirmCancel) {
      return
    }

    const updatedBookings = bookings.filter(
      booking => booking.id !== id
    )

    setBookings(updatedBookings)

    localStorage.setItem(
      'cinemaBookings',
      JSON.stringify(updatedBookings)
    )

    if (editingBookingId === id) {
      setEditingBookingId(null)
      setSelectedSeats([])
      setSeatMessage('')
    }
  }

  // Confirm or update booking

  const onConfirm = () => {
    if (!selectedMovie || selectedSeats.length === 0) {
      return
    }

    const latestBookings = JSON.parse(
      localStorage.getItem('cinemaBookings') || '[]'
    )

    const alreadyBooked = latestBookings
      .filter(
        booking =>
          booking.id !== editingBookingId &&
          booking.movieId === selectedMovie.id &&
          booking.showTime === showTime
      )
      .flatMap(booking => booking.seats)

    if (selectedSeats.some(seat => alreadyBooked.includes(seat))) {
      setBookings(latestBookings)
      setSelectedSeats([])
      setSeatMessage(
        'Some selected seats are already booked. Please select again.'
      )
      return
    }

    const existingBooking = latestBookings.find(
      booking => booking.id === editingBookingId
    )

    const newBooking = {
      id: editingBookingId || Date.now(),
      movieId: selectedMovie.id,
      movieTitle: selectedMovie.title,
      showTime,
      seats: [...selectedSeats],
      totalAmount: selectedSeats.length * ticketPrice,
      bookingDate:
        existingBooking?.bookingDate ||
        new Date().toLocaleDateString(),
    }

    let updatedBookings

    if (editingBookingId) {
      updatedBookings = latestBookings.map(booking =>
        booking.id === editingBookingId ? newBooking : booking
      )
    } else {
      updatedBookings = [...latestBookings, newBooking]
    }

    localStorage.setItem(
      'cinemaBookings',
      JSON.stringify(updatedBookings)
    )

    setBookings(updatedBookings)
    setConfirmation(newBooking)
    setSelectedSeats([])
    setEditingBookingId(null)
    setSeatMessage('')
  }

  // Close confirmation

  const closeConfirmation = () => {
    setConfirmation(null)
  }

  return (
    <>
      <Navbar />

      <div className="home-container">

        {/* Movie Section */}

        <section id="movies" className="movies-section">
          <h1>Now Showing</h1>

          <p>Choose your favourite movie and book your seats!</p>

          <div className="movies-container">
            {moviesList.map(movie => (
              <MovieCard
                key={movie.id}
                movieDetails={movie}
                onBookNow={onBookNow}
                isSelected={selectedMovie?.id === movie.id}
              />
            ))}
          </div>
        </section>

        {/* Seat Booking Section */}

        <section className="booking-section" id="booking">

          <div className="movie-banner">
            <h2>{selectedMovie?.title}</h2>

            <p>
              {selectedMovie?.genre} | {selectedMovie?.duration}
            </p>
          </div>

          {/* Show Time */}

          <h2>Select Show Time</h2>

          <div className="show-times">
            {showTimes.map(time => (
              <button
                key={time}
                className={showTime === time ? 'active-time' : ''}
                onClick={() => onShowTimeChange(time)}
              >
                {time}
              </button>
            ))}
          </div>

          {/* Seat Layout */}

          <h2>Select Your Seats</h2>

          <SeatLayout
            bookedSeats={bookedSeats}
            selectedSeats={selectedSeats}
            onSeatSelect={onSeatSelect}
          />

          {/* Already Booked Message */}

          {seatMessage && (
            <p className="seat-message">
              ⚠️ {seatMessage}
            </p>
          )}

          <p className="seat-count">
            Selected Seats: {selectedSeats.length}
          </p>
        </section>

        {/* Booking Summary */}

        <section className="summary-section">

          <BookingSummary
            movie={selectedMovie}
            showTime={showTime}
            selectedSeats={selectedSeats}
            ticketPrice={ticketPrice}
            onConfirm={onConfirm}
            isEditing={editingBookingId !== null}
          />

          {/* My Bookings */}

          <div id="bookings" className="my-bookings">

            <h2>My Bookings</h2>

            {bookings.length === 0 ? (
              <p>No bookings available.</p>
            ) : (
              bookings.map(booking => (
                <div key={booking.id} className="booking-item">

                  <h3>{booking.movieTitle}</h3>

                  <p>Show: {booking.showTime}</p>

                  <p>Seats: {booking.seats.join(', ')}</p>

                  <p>Amount: ₹{booking.totalAmount}</p>

                  <div className="booking-actions">

                    <button
                      className="edit-btn"
                      onClick={() => onEditBooking(booking)}
                    >
                      Edit
                    </button>

                    <button
                      className="cancel-btn"
                      onClick={() => onCancelBooking(booking.id)}
                    >
                      Cancel Booking
                    </button>

                  </div>

                </div>
              ))
            )}

          </div>

        </section>

        {/* Confirmation */}

        {confirmation && (
          <div className="confirmation-overlay">
            <Confirmation
              booking={confirmation}
              onClose={closeConfirmation}
            />
          </div>
        )}

      </div>
    </>
  )
}

export default App
