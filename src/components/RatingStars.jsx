import { IconStar } from "./icons"

function RatingStars({ rating = 0, reviews = 0 }) {
  const full = Math.round(rating)

  if (!reviews) {
    return (
      <span className="profile-stat rating-stars is-empty">
        No reviews yet
      </span>
    )
  }

  return (
    <span className="profile-stat rating-stars" title={`${rating} out of 5 from ${reviews} reviews`}>
      <span className="rating-glyphs" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i} className={i <= full ? "star is-filled" : "star"}>
            <IconStar />
          </span>
        ))}
      </span>
      <strong>{rating.toFixed(1)}</strong>
      <span className="rating-count">({reviews})</span>
    </span>
  )
}

export default RatingStars
