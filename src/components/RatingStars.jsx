function RatingStars({ rating = 4.8, reviews = 12 }) {
  const full = Math.round(rating)
  return (
    <span className="profile-stat rating-stars" title={`${rating} out of 5 from ${reviews} reviews`}>
      <span className="rating-glyphs" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i} className={i <= full ? "star is-filled" : "star"}>
            ★
          </span>
        ))}
      </span>
      <strong>{rating.toFixed(1)}</strong>
      <span className="rating-count">({reviews})</span>
    </span>
  )
}

export default RatingStars
