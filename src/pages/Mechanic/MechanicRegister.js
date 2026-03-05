import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import '../../styles/MechanicRegister.css';

function MechanicRegister() {
  var navigate = useNavigate();

  // Form states
  var _s1 = useState(''); var shopName = _s1[0]; var setShopName = _s1[1];
  var _s2 = useState(''); var phone = _s2[0]; var setPhone = _s2[1];
  var _s3 = useState(''); var whatsapp = _s3[0]; var setWhatsapp = _s3[1];
  var _s4 = useState(''); var address = _s4[0]; var setAddress = _s4[1];
  var _s5 = useState(''); var city = _s5[0]; var setCity = _s5[1];
  var _s6 = useState(''); var stateName = _s6[0]; var setStateName = _s6[1];
  var _s7 = useState(''); var pincode = _s7[0]; var setPincode = _s7[1];
  var _s8 = useState(null); var latitude = _s8[0]; var setLatitude = _s8[1];
  var _s9 = useState(null); var longitude = _s9[0]; var setLongitude = _s9[1];
  var _s10 = useState([]); var vehicleTypes = _s10[0]; var setVehicleTypes = _s10[1];
  var _s11 = useState([]); var services = _s11[0]; var setServices = _s11[1];
  var _s12 = useState([]); var specializations = _s12[0]; var setSpecializations = _s12[1];
  var _s13 = useState(false); var isMobile = _s13[0]; var setIsMobile = _s13[1];
  var _s14 = useState(false); var is24x7 = _s14[0]; var setIs24x7 = _s14[1];
  var _s15 = useState('08:00'); var openingTime = _s15[0]; var setOpeningTime = _s15[1];
  var _s16 = useState('21:00'); var closingTime = _s16[0]; var setClosingTime = _s16[1];
  var _s17 = useState([]); var languages = _s17[0]; var setLanguages = _s17[1];
  var _s18 = useState(''); var experience = _s18[0]; var setExperience = _s18[1];
  var _s19 = useState([]); var paymentModes = _s19[0]; var setPaymentModes = _s19[1];
  var _s20 = useState(false); var towingAvailable = _s20[0]; var setTowingAvailable = _s20[1];
  var _s21 = useState(''); var towingRange = _s21[0]; var setTowingRange = _s21[1];
  var _s22 = useState(''); var error = _s22[0]; var setError = _s22[1];
  var _s23 = useState(''); var success = _s23[0]; var setSuccess = _s23[1];
  var _s24 = useState(false); var loading = _s24[0]; var setLoading = _s24[1];
  var _s25 = useState(''); var locationStatus = _s25[0]; var setLocationStatus = _s25[1];

  var allVehicleTypes = ['Bike', 'Car', 'Auto', 'EV', 'Truck'];
  var allServices = ['Puncture', 'Engine Repair', 'Battery', 'Oil Change', 'AC Repair', 'Towing', 'Denting & Painting', 'Electrical', 'Brake Repair', 'Chain/Belt', 'Fuel Issue', 'Key/Lock'];
  var allLanguages = ['Telugu', 'Hindi', 'English', 'Tamil', 'Kannada', 'Malayalam', 'Marathi', 'Bengali', 'Urdu'];
  var allPaymentModes = ['Cash', 'UPI', 'Card', 'Net Banking'];
  var allSpecializations = ['Royal Enfield Expert', 'Honda Expert', 'Maruti Suzuki Specialist', 'Hyundai Expert', 'Diesel Engine Expert', 'EV Specialist', 'Towing Specialist', 'AC Specialist'];

  // Toggle chip selection
  function toggleChip(list, setList, item) {
    if (list.indexOf(item) !== -1) {
      setList(list.filter(function(i) { return i !== item; }));
    } else {
      setList(list.concat([item]));
    }
  }

  // Detect GPS location
  function detectLocation() {
    setLocationStatus('Detecting...');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function(position) {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setLocationStatus('Location detected: ' + position.coords.latitude.toFixed(4) + ', ' + position.coords.longitude.toFixed(4));
        },
        function(err) {
          setLocationStatus('Failed to detect location. Please enter manually.');
        }
      );
    } else {
      setLocationStatus('Geolocation not supported by browser.');
    }
  }

  // Handle form submit
  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validation
    if (!shopName || !phone || !address || !city || !stateName) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    if (vehicleTypes.length === 0) {
      setError('Please select at least one vehicle type.');
      setLoading(false);
      return;
    }

    if (services.length === 0) {
      setError('Please select at least one service.');
      setLoading(false);
      return;
    }

    // Get current user
    supabase.auth.getUser().then(function(result) {
      if (result.error || !result.data.user) {
        setError('You must be logged in to register a shop. Please login first.');
        setLoading(false);
        return;
      }

      var userId = result.data.user.id;

      // Insert mechanic data
      supabase
        .from('mechanics')
        .insert({
          user_id: userId,
          shop_name: shopName,
          phone: phone,
          whatsapp: whatsapp || phone,
          address: address,
          city: city,
          state: stateName,
          pincode: pincode,
          latitude: latitude,
          longitude: longitude,
          vehicle_types: vehicleTypes,
          services: services,
          specializations: specializations,
          is_mobile: isMobile,
          is_24x7: is24x7,
          opening_time: is24x7 ? '00:00' : openingTime,
          closing_time: is24x7 ? '23:59' : closingTime,
          languages_spoken: languages,
          years_experience: parseInt(experience) || 0,
          payment_modes: paymentModes,
          towing_available: towingAvailable,
          towing_range_km: parseInt(towingRange) || 0,
          status: 'available',
          rating: 0,
          total_reviews: 0,
        })
        .then(function(insertResult) {
          if (insertResult.error) {
            setError(insertResult.error.message);
          } else {
            setSuccess('Shop registered successfully! Redirecting to dashboard...');
            setTimeout(function() {
              navigate('/search');
            }, 2000);
          }
          setLoading(false);
        });
    });
  }

  return (
    <div className="register-page">
      <div className="auth-blob-1"></div>
      <div className="auth-blob-2"></div>

      {/* Top Bar */}
      <div className="register-topbar">
        <Link to="/" className="logo">
          <div className="logo-icon">🔧</div>
          <div className="logo-text">Mech<span>N</span></div>
        </Link>
      </div>

      <div className="register-container">
        {/* Header */}
        <div className="register-header">
          <h1>Register Your <span className="highlight">Shop</span></h1>
          <p>Join MechN network and get discovered by thousands of vehicle owners</p>
        </div>

        {error && <div className="register-error">{error}</div>}
        {success && <div className="register-success">{success}</div>}

        <form onSubmit={handleSubmit}>

          {/* Basic Info */}
          <div className="form-section">
            <div className="form-section-title">
              <span className="icon">🏪</span> Shop Information
            </div>
            <div className="form-grid">
              <div className="reg-input-group full-width">
                <label>Shop Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Raju Motor Works"
                  value={shopName}
                  onChange={function(e) { setShopName(e.target.value); }}
                  required
                />
              </div>
              <div className="reg-input-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  placeholder="10-digit phone number"
                  value={phone}
                  onChange={function(e) { setPhone(e.target.value); }}
                  required
                />
              </div>
              <div className="reg-input-group">
                <label>WhatsApp Number</label>
                <input
                  type="tel"
                  placeholder="Same as phone if empty"
                  value={whatsapp}
                  onChange={function(e) { setWhatsapp(e.target.value); }}
                />
              </div>
              <div className="reg-input-group">
                <label>Years of Experience</label>
                <input
                  type="number"
                  placeholder="e.g. 5"
                  value={experience}
                  onChange={function(e) { setExperience(e.target.value); }}
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="form-section">
            <div className="form-section-title">
              <span className="icon">📍</span> Location
            </div>
            <div className="form-grid">
              <div className="reg-input-group full-width">
                <label>Full Address *</label>
                <input
                  type="text"
                  placeholder="e.g. Main Road, near Bus Stand"
                  value={address}
                  onChange={function(e) { setAddress(e.target.value); }}
                  required
                />
              </div>
              <div className="reg-input-group">
                <label>City *</label>
                <input
                  type="text"
                  placeholder="e.g. Rajahmundry"
                  value={city}
                  onChange={function(e) { setCity(e.target.value); }}
                  required
                />
              </div>
              <div className="reg-input-group">
                <label>State *</label>
                <input
                  type="text"
                  placeholder="e.g. Andhra Pradesh"
                  value={stateName}
                  onChange={function(e) { setStateName(e.target.value); }}
                  required
                />
              </div>
              <div className="reg-input-group">
                <label>Pincode</label>
                <input
                  type="text"
                  placeholder="e.g. 533101"
                  value={pincode}
                  onChange={function(e) { setPincode(e.target.value); }}
                />
              </div>
              <div className="reg-input-group">
                <label>GPS Coordinates</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="text"
                    placeholder="Latitude"
                    value={latitude || ''}
                    onChange={function(e) { setLatitude(parseFloat(e.target.value)); }}
                    style={{ flex: 1 }}
                  />
                  <input
                    type="text"
                    placeholder="Longitude"
                    value={longitude || ''}
                    onChange={function(e) { setLongitude(parseFloat(e.target.value)); }}
                    style={{ flex: 1 }}
                  />
                </div>
                <button type="button" className="location-detect-btn" onClick={detectLocation}>
                  📍 Auto-Detect My Location
                </button>
                {locationStatus && <p style={{ fontSize: '12px', color: '#00FF88', marginTop: '6px' }}>{locationStatus}</p>}
              </div>
            </div>
          </div>

          {/* Vehicle Types */}
          <div className="form-section">
            <div className="form-section-title">
              <span className="icon">🚗</span> Vehicle Types You Service *
            </div>
            <div className="checkbox-grid">
              {allVehicleTypes.map(function(type) {
                return (
                  <div
                    key={type}
                    className={'checkbox-chip' + (vehicleTypes.indexOf(type) !== -1 ? ' selected' : '')}
                    onClick={function() { toggleChip(vehicleTypes, setVehicleTypes, type); }}
                  >
                    {type}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Services */}
          <div className="form-section">
            <div className="form-section-title">
              <span className="icon">🛠️</span> Services You Offer *
            </div>
            <div className="checkbox-grid">
              {allServices.map(function(service) {
                return (
                  <div
                    key={service}
                    className={'checkbox-chip' + (services.indexOf(service) !== -1 ? ' selected' : '')}
                    onClick={function() { toggleChip(services, setServices, service); }}
                  >
                    {service}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Specializations */}
          <div className="form-section">
            <div className="form-section-title">
              <span className="icon">⭐</span> Specializations (Optional)
            </div>
            <div className="checkbox-grid">
              {allSpecializations.map(function(spec) {
                return (
                  <div
                    key={spec}
                    className={'checkbox-chip' + (specializations.indexOf(spec) !== -1 ? ' selected' : '')}
                    onClick={function() { toggleChip(specializations, setSpecializations, spec); }}
                  >
                    {spec}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Languages */}
          <div className="form-section">
            <div className="form-section-title">
              <span className="icon">🗣️</span> Languages Spoken
            </div>
            <div className="checkbox-grid">
              {allLanguages.map(function(lang) {
                return (
                  <div
                    key={lang}
                    className={'checkbox-chip' + (languages.indexOf(lang) !== -1 ? ' selected' : '')}
                    onClick={function() { toggleChip(languages, setLanguages, lang); }}
                  >
                    {lang}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment Modes */}
          <div className="form-section">
            <div className="form-section-title">
              <span className="icon">💰</span> Payment Modes Accepted
            </div>
            <div className="checkbox-grid">
              {allPaymentModes.map(function(mode) {
                return (
                  <div
                    key={mode}
                    className={'checkbox-chip' + (paymentModes.indexOf(mode) !== -1 ? ' selected' : '')}
                    onClick={function() { toggleChip(paymentModes, setPaymentModes, mode); }}
                  >
                    {mode}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Toggles */}
          <div className="form-section">
            <div className="form-section-title">
              <span className="icon">⚙️</span> Availability Settings
            </div>

            <div className="toggle-group">
              <div className="toggle-label">
                <span className="title">Mobile Mechanic</span>
                <span className="desc">Can you go to the customer's location?</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={isMobile}
                  onChange={function(e) { setIsMobile(e.target.checked); }}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="toggle-group">
              <div className="toggle-label">
                <span className="title">Available 24/7</span>
                <span className="desc">Are you available round the clock?</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={is24x7}
                  onChange={function(e) { setIs24x7(e.target.checked); }}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            {!is24x7 && (
              <div className="time-grid" style={{ marginTop: '16px' }}>
                <div className="reg-input-group">
                  <label>Opening Time</label>
                  <input
                    type="time"
                    value={openingTime}
                    onChange={function(e) { setOpeningTime(e.target.value); }}
                  />
                </div>
                <div className="reg-input-group">
                  <label>Closing Time</label>
                  <input
                    type="time"
                    value={closingTime}
                    onChange={function(e) { setClosingTime(e.target.value); }}
                  />
                </div>
              </div>
            )}

            <div className="toggle-group">
              <div className="toggle-label">
                <span className="title">Towing Service Available</span>
                <span className="desc">Can you tow vehicles?</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={towingAvailable}
                  onChange={function(e) { setTowingAvailable(e.target.checked); }}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            {towingAvailable && (
              <div className="reg-input-group" style={{ marginTop: '12px' }}>
                <label>Towing Range (km)</label>
                <input
                  type="number"
                  placeholder="e.g. 25"
                  value={towingRange}
                  onChange={function(e) { setTowingRange(e.target.value); }}
                />
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn-register-submit"
            disabled={loading}
          >
            {loading ? 'Registering...' : '🔧 Register My Shop on MechN'}
          </button>

        </form>
      </div>
    </div>
  );
}

export default MechanicRegister;
