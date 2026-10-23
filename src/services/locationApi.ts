/**
 * Smart Neighborhood Help Network - Location & Geolocation API Service
 * Handles HTML5 GPS location, reverse-geocoding (Nominatim & BigDataCloud fallbacks),
 * forward location search, and distance calculation.
 */

export interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface UserLocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  formattedAddress: string;
  neighborhood?: string;
  locality?: string;
  city?: string;
  state?: string;
  pincode?: string;
  source: 'gps' | 'manual' | 'search';
  timestamp?: string;
}

export interface LocationSearchResult {
  displayName: string;
  latitude: number;
  longitude: number;
  neighborhood?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

/**
 * Cleanly formats coordinate numbers into human-readable cardinal strings
 * e.g. 12.9716, 77.5946 -> "12.9716° N, 77.5946° E"
 */
export function formatCoordinates(lat: number, lng: number): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lng).toFixed(4)}° ${lngDir}`;
}

/**
 * Calculates distance in kilometers between two geo-coordinates using the Haversine formula
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Promisified browser HTML5 Geolocation API with robust timeout & error handling
 */
export function getCurrentBrowserPosition(
  options: PositionOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 30000,
  }
): Promise<GeolocationCoordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator || !navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser or environment.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve(position.coords);
      },
      (error) => {
        let msg = 'Failed to retrieve location.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            msg = 'Location permission was denied. Please allow location access in your browser or enter your address manually.';
            break;
          case error.POSITION_UNAVAILABLE:
            msg = 'Location signal is currently unavailable from your device.';
            break;
          case error.TIMEOUT:
            msg = 'Location request timed out. Please try again or type your locality.';
            break;
          default:
            msg = error.message || 'Unable to detect device location.';
        }
        reject(new Error(msg));
      },
      options
    );
  });
}

/**
 * Reverse-geocodes latitude and longitude into human-readable address & neighborhood details.
 * Attempts OpenStreetMap Nominatim first, with fallback to BigDataCloud client API,
 * and finally fallback to structured coordinate string.
 */
export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<UserLocationData> {
  const defaultFallback: UserLocationData = {
    latitude: lat,
    longitude: lng,
    formattedAddress: `Coordinates: ${formatCoordinates(lat, lng)}`,
    neighborhood: 'Detected Locality',
    locality: 'Detected Locality',
    city: 'Bengaluru',
    source: 'gps',
    timestamp: new Date().toISOString(),
  };

  // 1. Try OpenStreetMap Nominatim API
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
    const res = await fetch(nominatimUrl, {
      signal: controller.signal,
      headers: {
        'Accept-Language': 'en',
      },
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};

      const neighborhood =
        addr.suburb ||
        addr.neighbourhood ||
        addr.quarter ||
        addr.residential ||
        addr.subdistrict ||
        addr.village ||
        addr.road ||
        'Local Neighborhood';

      const city =
        addr.city ||
        addr.town ||
        addr.municipality ||
        addr.county ||
        addr.state_district ||
        'Bengaluru';

      const state = addr.state || 'Karnataka';
      const pincode = addr.postcode || '';

      const road = addr.road || '';
      const displayParts: string[] = [];
      if (addr.house_number) displayParts.push(addr.house_number);
      if (road) displayParts.push(road);
      if (neighborhood && neighborhood !== road) displayParts.push(neighborhood);
      if (city) displayParts.push(city);
      if (pincode) displayParts.push(pincode);

      const formatted =
        displayParts.length > 1
          ? displayParts.join(', ')
          : data.display_name || defaultFallback.formattedAddress;

      return {
        latitude: lat,
        longitude: lng,
        formattedAddress: formatted,
        neighborhood,
        locality: neighborhood,
        city,
        state,
        pincode,
        source: 'gps',
        timestamp: new Date().toISOString(),
      };
    }
  } catch {
    // Proceed to fallback 2
  }

  // 2. Fallback: BigDataCloud Client Reverse Geocode (free, high availability, no API key needed)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const bdcUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`;
    const res = await fetch(bdcUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const neighborhood = data.locality || data.principalSubdivision || 'Local Area';
      const city = data.city || data.localityInfo?.administrative?.[2]?.name || 'Bengaluru';
      const state = data.principalSubdivision || 'Karnataka';
      const pincode = data.postcode || '';

      const formatted = [neighborhood, city, state, pincode].filter(Boolean).join(', ');

      return {
        latitude: lat,
        longitude: lng,
        formattedAddress: formatted || defaultFallback.formattedAddress,
        neighborhood,
        locality: neighborhood,
        city,
        state,
        pincode,
        source: 'gps',
        timestamp: new Date().toISOString(),
      };
    }
  } catch {
    // Proceed to fallback 3
  }

  // 3. Fallback to coordinate representation
  return defaultFallback;
}

/**
 * Complete all-in-one helper to acquire device location and reverse-geocode to address
 */
export async function detectCurrentLocation(): Promise<UserLocationData> {
  const coords = await getCurrentBrowserPosition();
  const locationData = await reverseGeocode(coords.latitude, coords.longitude);
  locationData.accuracy = coords.accuracy;
  return locationData;
}

/**
 * Searches places/neighborhoods by search string query using OpenStreetMap Nominatim
 */
export async function searchLocations(query: string): Promise<LocationSearchResult[]> {
  const clean = query.trim();
  if (clean.length < 2) return [];

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(
      clean
    )}&limit=5&addressdetails=1`;

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept-Language': 'en',
      },
    });
    clearTimeout(timeoutId);

    if (!res.ok) return [];

    const list = await res.json();
    return list.map((item: any) => {
      const addr = item.address || {};
      const neighborhood =
        addr.suburb ||
        addr.neighbourhood ||
        addr.residential ||
        addr.road ||
        item.name ||
        '';
      const city = addr.city || addr.town || addr.county || '';
      const state = addr.state || '';
      const pincode = addr.postcode || '';

      return {
        displayName: item.display_name,
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon),
        neighborhood,
        city,
        state,
        pincode,
      };
    });
  } catch {
    return [];
  }
}
