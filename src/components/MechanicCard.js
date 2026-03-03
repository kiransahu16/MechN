import React from 'react';

function MechanicCard({ mechanic }) {
  // Calculate distance text
  const distanceText = mechanic.distance
    ? mechanic.distance < 1
      ? `${(mechanic.distance * 1000).toFixed(0)}m away`
      : `${mechanic.distance.toFixed(1)}km away`
    : 'Distance unknown';

  // Status class
  const statusClass =
    mechanic.status === 'available'
      ? 'status-available'
      : mechanic.status === 'busy'
      ? 'status-busy'
      : 'status-closed';

  // Handle call
  const handleCall = (e) => {
    e.stopPropagation();
    window.location.href = `tel:${mechanic.phone}`;
  };

  // Handle directions
  const handleDirections = (e) => {
    e.stopPropagation();
    const url = `https://www.google.com/maps/dir/?api=1&destination=${mechanic.latitude},${mechanic.longitude}`;
    window.open(url, '_blank');
  };

  return (
    <div className="mechanic-card">
      {/* Header */}
      <div className="mechanic-card-header">
        <div className="mechanic-info">
          <h3>{mechanic.shop_name}</h3>
          <p className="shop-address">{mechanic.address || mechanic.city}</p>
        </div>
        <div className={`mechanic-status ${statusClass}`}>
          {mechanic.status}
        </div>
      </div>

      {/* Tags - Vehicle Types & Services */}
      <div className="mechanic-tags">
        {mechanic.vehicle_types &&
          mechanic.vehicle_types.map((type, i) => (
            <span className="tag" key={`v-${i}`}>
              {type}
            </span>
          ))}
        {mechanic.services &&
          mechanic.services.slice(0, 3).map((service, i) => (
            <span className="tag" key={`s-${i}`}>
              {service}
            </span>
          ))}
      </div>

      {/* Meta Info */}
      <div className="mechanic-meta">
        <div className="meta-item">
          <span className="star">★</span>
          <span>
            {mechanic.rating > 0 ? mechanic.rating.toFixed(1) : 'New'}
          </span>
          <span>({mechanic.total_reviews})</span>
        </div>
        <div className="meta-item">
          <span className="distance">{distanceText}</span>
        </div>
        {mechanic.is_24x7 && (
          <div className="meta-item">
            <span>🟢 24/7</span>
          </div>
        )}
        {mechanic.is_mobile && (
          <div className="meta-item">
            <span>🏍️ Comes to you</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mechanic-actions">
        <button className="btn-call" onClick={handleCall}>
          📞 Call Now
        </button>
        <button className="btn-directions" onClick={handleDirections}>
          🗺️ Directions
        </button>
        <button className="btn-view-profile">
          View
        </button>
      </div>
    </div>
  );
}

export default MechanicCard;