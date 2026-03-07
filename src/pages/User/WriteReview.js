import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import '../../styles/Review.css';

function WriteReview() {
  var params = useParams();
  var navigate = useNavigate();
  var mechanicId = params.id;

  var _s1 = useState(null); var mechanic = _s1[0]; var setMechanic = _s1[1];
  var _s2 = useState(0); var rating = _s2[0]; var setRating = _s2[1];
  var _s3 = useState(0); var hoverRating = _s3[0]; var setHoverRating = _s3[1];
  var _s4 = useState(''); var reviewText = _s4[0]; var setReviewText = _s4[1];
  var _s5 = useState(''); var serviceType = _s5[0]; var setServiceType = _s5[1];
  var _s6 = useState(''); var pricePaid = _s6[0]; var setPricePaid = _s6[1];
  var _s7 = useState(''); var error = _s7[0]; var setError = _s7[1];
  var _s8 = useState(''); var success = _s8[0]; var setSuccess = _s8[1];
  var _s9 = useState(false); var loading = _s9[0]; var setLoading = _s9[1];
  var _s10 = useState(true); var pageLoading = _s10[0]; var setPageLoading = _s10[1];

  var serviceTypes = ['Puncture Repair', 'Engine Repair', 'Battery Replacement', 'Oil Change', 'AC Repair', 'Towing', 'Electrical', 'Brake Repair', 'General Service', 'Other'];

  var ratingLabels = ['', 'Terrible', 'Poor', 'Average', 'Good', 'Excellent'];

  // Fetch mechanic details
  useEffect(function() {
    supabase
      .from('mechanics')
      .select('*')
      .eq('id', mechanicId)
      .single()
      .then(function(result) {
        if (result.error) {
          console.error('Error:', result.error);
        } else {
          setMechanic(result.data);
        }
        setPageLoading(false);
      });
  }, [mechanicId]);

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (rating === 0) {
      setError('Please select a star rating');
      return;
    }

    if (!serviceType) {
      setError('Please select the service type');
      return;
    }

    setLoading(true);

    // Get current user
    supabase.auth.getUser().then(function(userResult) {
      if (userResult.error || !userResult.data.user) {
        setError('You must be logged in to write a review. Please login first.');
        setLoading(false);
        return;
      }

      var userId = userResult.data.user.id;

      // Insert review
      supabase
        .from('reviews')
        .insert({
          mechanic_id: mechanicId,
          user_id: userId,
          rating: rating,
          review_text: reviewText,
          service_type: serviceType,
          price_paid: pricePaid ? parseFloat(pricePaid) : null,
        })
        .then(function(insertResult) {
          if (insertResult.error) {
            setError(insertResult.error.message);
            setLoading(false);
            return;
          }

          // Update mechanic's average rating and total reviews
          supabase
            .from('reviews')
            .select('rating')
            .eq('mechanic_id', mechanicId)
            .then(function(reviewsResult) {
              if (!reviewsResult.error && reviewsResult.data) {
                var allReviews = reviewsResult.data;
                var totalReviews = allReviews.length;
                var avgRating = 0;
                for (var i = 0; i < allReviews.length; i++) {
                  avgRating += allReviews[i].rating;
                }
                avgRating = avgRating / totalReviews;

                supabase
                  .from('mechanics')
                  .update({
                    rating: Math.round(avgRating * 10) / 10,
                    total_reviews: totalReviews,
                  })
                  .eq('id', mechanicId)
                  .then(function() {
                    setSuccess('Review submitted successfully! Thank you!');
                    setLoading(false);
                    setTimeout(function() {
                      navigate('/mechanic/' + mechanicId);
                    }, 2000);
                  });
              } else {
                setSuccess('Review submitted successfully!');
                setLoading(false);
              }
            });
        });
    });
  }

  if (pageLoading) {
    return (
      <div className="review-page">
        <div className="review-topbar">
          <Link to="/" className="logo">
            <div className="logo-icon">🔧</div>
            <div className="logo-text">Mech<span>N</span></div>
          </Link>
        </div>
        <div className="review-loading">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!mechanic) {
    return (
      <div className="review-page">
        <div className="review-topbar">
          <Link to="/" className="logo">
            <div className="logo-icon">🔧</div>
            <div className="logo-text">Mech<span>N</span></div>
          </Link>
        </div>
        <div className="review-loading">
          <p>Mechanic not found.</p>
          <Link to="/search" className="btn-back-review" style={{ display: 'inline-block', marginTop: '16px' }}>Back to Search</Link>
        </div>
      </div>
    );
  }

  var displayRating = hoverRating || rating;

  return (
    <div className="review-page">
      <div className="auth-blob-1"></div>

      {/* Top Bar */}
      <div className="review-topbar">
        <Link to="/" className="logo">
          <div className="logo-icon">🔧</div>
          <div className="logo-text">Mech<span>N</span></div>
        </Link>
        <Link to={'/mechanic/' + mechanicId} className="btn-back-review">
          ← Back to Profile
        </Link>
      </div>

      <div className="review-container">
        {/* Header */}
        <div className="review-header">
          <h1>Rate & <span className="highlight">Review</span></h1>
          <p>Share your experience to help others</p>
        </div>

        {/* Mechanic Info */}
        <div className="review-mechanic-card">
          <div className="mechanic-icon">🔧</div>
          <div>
            <h3>{mechanic.shop_name}</h3>
            <p className="mechanic-address">{mechanic.address}, {mechanic.city}</p>
          </div>
        </div>

        {error && <div className="review-error">{error}</div>}
        {success && <div className="review-success">{success}</div>}

        <form onSubmit={handleSubmit}>

          {/* Star Rating */}
          <div className="review-section">
            <div className="review-section-title">
              <span>⭐</span> Your Rating
            </div>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map(function(star) {
                return (
                  <button
                    key={star}
                    type="button"
                    className={'star-btn' + (star <= displayRating ? ' active' : '')}
                    onClick={function() { setRating(star); }}
                    onMouseEnter={function() { setHoverRating(star); }}
                    onMouseLeave={function() { setHoverRating(0); }}
                  >
                    ★
                  </button>
                );
              })}
            </div>
            {displayRating > 0 && (
              <div className="rating-text">{ratingLabels[displayRating]}</div>
            )}
          </div>

          {/* Service Type */}
          <div className="review-section">
            <div className="review-section-title">
              <span>🛠️</span> What service did you get?
            </div>
            <div className="service-chips">
              {serviceTypes.map(function(type) {
                return (
                  <div
                    key={type}
                    className={'service-chip' + (serviceType === type ? ' selected' : '')}
                    onClick={function() { setServiceType(type); }}
                  >
                    {type}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Review Text */}
          <div className="review-section">
            <div className="review-section-title">
              <span>💬</span> Write your review
            </div>
            <textarea
              className="review-textarea"
              placeholder="How was your experience? Was the mechanic professional? Was the price fair? Would you recommend them?"
              value={reviewText}
              onChange={function(e) { setReviewText(e.target.value); }}
            ></textarea>
          </div>

          {/* Price Paid */}
          <div className="review-section">
            <div className="review-section-title">
              <span>💰</span> How much did you pay? (Optional)
            </div>
            <div className="price-input-group">
              <span className="price-symbol">₹</span>
              <input
                type="number"
                className="price-input"
                placeholder="e.g. 150"
                value={pricePaid}
                onChange={function(e) { setPricePaid(e.target.value); }}
              />
            </div>
            <p style={{ fontSize: '12px', color: '#475569', marginTop: '8px' }}>
              This helps other users know the fair price for this service
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn-submit-review"
            disabled={loading}
          >
            {loading ? 'Submitting...' : '⭐ Submit Review'}
          </button>

        </form>
      </div>
    </div>
  );
}

export default WriteReview;
