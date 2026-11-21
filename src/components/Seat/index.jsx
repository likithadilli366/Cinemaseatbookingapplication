
const Seat = ({seatId, status, onSelect}) => {
  return (
    <button
      className={`seat ${status}`}
      onClick={() => onSelect(seatId)}
      title={status === 'booked' ? 'Already Booked' : seatId}
    >
      {seatId}
    </button>
  )
}

export default Seat
