import React from 'react';
import '../styles/SkeletonLoader.css';

function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-header">
        <div>
          <div className="skeleton-title"></div>
          <div className="skeleton-subtitle"></div>
        </div>
        <div className="skeleton-badge"></div>
      </div>
      <div className="skeleton-tags">
        <div className="skeleton-tag"></div>
        <div className="skeleton-tag" style={{ width: '60px' }}></div>
        <div className="skeleton-tag" style={{ width: '70px' }}></div>
        <div className="skeleton-tag" style={{ width: '45px' }}></div>
      </div>
      <div className="skeleton-meta">
        <div className="skeleton-meta-item"></div>
        <div className="skeleton-meta-item" style={{ width: '100px' }}></div>
        <div className="skeleton-meta-item" style={{ width: '60px' }}></div>
      </div>
      <div className="skeleton-buttons">
        <div className="skeleton-btn skeleton-btn-primary"></div>
        <div className="skeleton-btn skeleton-btn-secondary"></div>
        <div className="skeleton-btn skeleton-btn-secondary" style={{ width: '60px' }}></div>
      </div>
    </div>
  );
}

function SkeletonList({ count }) {
  var items = [];
  for (var i = 0; i < (count || 4); i++) {
    items.push(React.createElement(SkeletonCard, { key: i }));
  }
  return React.createElement('div', null, items);
}

export { SkeletonCard, SkeletonList };
export default SkeletonCard;
