import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Navigation,
  Search,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  X,
  Compass,
} from 'lucide-react';
import {
  detectCurrentLocation,
  searchLocations,
  formatCoordinates,
  UserLocationData,
  LocationSearchResult,
} from '../../services/locationApi';

export const POPULAR_NEIGHBORHOODS = [
  'Indiranagar / 100ft Road',
  'Koramangala 4th Block',
  'HSR Layout Sector 2',
  'Whitefield / ITPL Area',
  'Jayanagar 4th T Block',
  'Electronic City Phase 1',
  'JP Nagar 7th Phase',
  'Malleshwaram 15th Cross',
  'Hebbal / Outer Ring Road',
  'Bannerghatta Road Enclave',
];

interface LocationPickerProps {
  valueNeighborhood: string;
  onChangeNeighborhood: (val: string) => void;
  location: UserLocationData | null;
  onLocationChange: (loc: UserLocationData | null) => void;
  accentColor?: 'blue' | 'emerald' | 'amber';
  label?: string;
  required?: boolean;
  showRadius?: boolean;
  radiusKm?: number;
  onRadiusChange?: (radius: number) => void;
  helperText?: string;
}

export function LocationPicker({
  valueNeighborhood,
  onChangeNeighborhood,
  location,
  onLocationChange,
  accentColor = 'blue',
  label = 'Neighborhood & Service Location',
  required = true,
  showRadius = false,
  radiusKm = 5,
  onRadiusChange,
  helperText,
}: LocationPickerProps) {
  const [mode, setMode] = useState<'preset' | 'search' | 'gps'>('preset');
  const [isDetecting, setIsDetecting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Search autocomplete states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync mode if location provided with GPS
  useEffect(() => {
    if (location?.source === 'gps') {
      setMode('gps');
    }
  }, [location]);

  // Handle GPS Auto-Detection
  const handleDetectGPS = async () => {
    setIsDetecting(true);
    setErrorMsg(null);
    try {
      const data = await detectCurrentLocation();
      onLocationChange(data);
      setMode('gps');

      // Best effort matching or set formatted neighborhood
      const matched = POPULAR_NEIGHBORHOODS.find((n) =>
        data.neighborhood && n.toLowerCase().includes(data.neighborhood.toLowerCase())
      );
      if (matched) {
        onChangeNeighborhood(matched);
      } else if (data.neighborhood) {
        onChangeNeighborhood(`${data.neighborhood}, ${data.city || 'Bengaluru'}`);
      } else if (data.locality) {
        onChangeNeighborhood(`${data.locality}, ${data.city || 'Bengaluru'}`);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Unable to retrieve your location via GPS.');
    } finally {
      setIsDetecting(false);
    }
  };

  // Search input change with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    setErrorMsg(null);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (val.trim().length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await searchLocations(val);
        setSearchResults(results);
        setShowDropdown(results.length > 0);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 350);
  };

  const handleSelectSearchResult = (item: LocationSearchResult) => {
    const locData: UserLocationData = {
      latitude: item.latitude,
      longitude: item.longitude,
      formattedAddress: item.displayName,
      neighborhood: item.neighborhood || item.city || 'Custom Location',
      locality: item.neighborhood || item.city,
      city: item.city || 'Bengaluru',
      state: item.state || 'Karnataka',
      pincode: item.pincode || '',
      source: 'search',
      timestamp: new Date().toISOString(),
    };

    onLocationChange(locData);
    const cleanNeighborhood = item.neighborhood
      ? `${item.neighborhood}, ${item.city || ''}`.trim()
      : item.displayName.split(',').slice(0, 2).join(',').trim();
    onChangeNeighborhood(cleanNeighborhood);
    setSearchQuery(cleanNeighborhood);
    setShowDropdown(false);
    setMode('search');
  };

  const handleClearLocation = () => {
    onLocationChange(null);
    setMode('preset');
    setErrorMsg(null);
    setSearchQuery('');
  };

  const borderFocusColor =
    accentColor === 'emerald'
      ? 'focus:border-emerald-600'
      : accentColor === 'amber'
      ? 'focus:border-amber-600'
      : 'focus:border-blue-600';

  const badgeBg =
    accentColor === 'emerald'
      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
      : accentColor === 'amber'
      ? 'bg-amber-50 border-amber-200 text-amber-800'
      : 'bg-blue-50 border-blue-200 text-blue-800';

  return (
    <div className="space-y-3">
      {/* Header with Label and GPS Quick-Button */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>

        <button
          type="button"
          onClick={handleDetectGPS}
          disabled={isDetecting}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold transition border shadow-xs ${
            isDetecting
              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
              : accentColor === 'emerald'
              ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-300'
              : accentColor === 'amber'
              ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-300'
              : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-300'
          }`}
          title="Use device GPS to auto-detect accurate coordinates & address"
        >
          {isDetecting ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin text-slate-500" />
              <span>Detecting GPS...</span>
            </>
          ) : (
            <>
              <Navigation className="w-3 h-3 text-current" />
              <span>Auto-Detect GPS</span>
            </>
          )}
        </button>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="grid grid-cols-2 p-0.5 bg-slate-100 rounded-lg text-[11px] font-semibold text-slate-600">
        <button
          type="button"
          onClick={() => {
            setMode('preset');
            setErrorMsg(null);
          }}
          className={`py-1.5 px-2 rounded-md transition text-center ${
            mode === 'preset' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'hover:text-slate-900'
          }`}
        >
          Select Sector
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('search');
            setErrorMsg(null);
          }}
          className={`py-1.5 px-2 rounded-md transition text-center ${
            mode === 'search' || mode === 'gps'
              ? 'bg-white text-slate-900 shadow-xs font-bold'
              : 'hover:text-slate-900'
          }`}
        >
          Search / Custom Address
        </button>
      </div>

      {/* Mode 1: Sector Dropdown */}
      {mode === 'preset' && (
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <MapPin className="w-3.5 h-3.5" />
          </div>
          <select
            value={valueNeighborhood}
            onChange={(e) => onChangeNeighborhood(e.target.value)}
            className={`w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 ${borderFocusColor} focus:bg-white rounded-xl text-slate-900 text-xs outline-none cursor-pointer`}
          >
            {POPULAR_NEIGHBORHOODS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Mode 2: Search / Custom Location Input */}
      {(mode === 'search' || mode === 'gps') && (
        <div className="relative">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              {isSearching ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400" />
              ) : (
                <Search className="w-3.5 h-3.5" />
              )}
            </div>
            <input
              type="text"
              value={searchQuery || valueNeighborhood}
              onChange={handleSearchChange}
              onFocus={() => {
                if (searchResults.length > 0) setShowDropdown(true);
              }}
              placeholder="Type locality, area, street, or pincode..."
              className={`w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 ${borderFocusColor} focus:bg-white rounded-xl text-slate-900 text-xs placeholder-slate-400 outline-none`}
            />
            {(searchQuery || valueNeighborhood) && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  onChangeNeighborhood(POPULAR_NEIGHBORHOODS[0]);
                  setShowDropdown(false);
                }}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {showDropdown && searchResults.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-30 max-h-48 overflow-y-auto divide-y divide-slate-100 text-left">
              {searchResults.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSearchResult(item)}
                  className="w-full px-3 py-2 text-left hover:bg-slate-50 transition flex items-start gap-2"
                >
                  <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">
                      {item.neighborhood || item.city || item.displayName.split(',')[0]}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">{item.displayName}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Verified Location Card (when GPS/Search has coordinates) */}
      {location && (
        <div className={`p-2.5 rounded-xl border ${badgeBg} flex items-start justify-between gap-2 animate-fadeIn`}>
          <div className="flex items-start gap-2 min-w-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-bold text-slate-800">
                  {location.source === 'gps' ? 'GPS Location Captured' : 'Verified Location'}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/80 border border-slate-200 text-slate-600">
                  {formatCoordinates(location.latitude, location.longitude)}
                </span>
                {location.accuracy && (
                  <span className="text-[9px] text-slate-500">
                    ±{Math.round(location.accuracy)}m
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-600 truncate mt-0.5 max-w-sm">
                {location.formattedAddress}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={handleDetectGPS}
              disabled={isDetecting}
              className="p-1 rounded-md text-slate-500 hover:text-slate-800 hover:bg-white/60 transition"
              title="Refresh GPS coordinates"
            >
              <RefreshCw className={`w-3 h-3 ${isDetecting ? 'animate-spin' : ''}`} />
            </button>
            <button
              type="button"
              onClick={handleClearLocation}
              className="p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-white/60 transition"
              title="Remove coordinates"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Error message */}
      {errorMsg && (
        <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] flex items-start gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span>{errorMsg}</span>
            <span className="block text-[10px] text-amber-700 mt-0.5">
              Tip: You can select a sector from the dropdown or type your locality manually.
            </span>
          </div>
        </div>
      )}

      {/* Optional Service Radius Selector (for Worker / Pro) */}
      {showRadius && onRadiusChange && (
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-blue-600" />
              <span>Service Travel Radius:</span>
            </span>
            <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
              Within {radiusKm} km
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1.5 text-center">
            {[3, 5, 10, 15].map((km) => (
              <button
                key={km}
                type="button"
                onClick={() => onRadiusChange(km)}
                className={`py-1.5 px-1 rounded-lg text-[11px] font-bold transition border ${
                  radiusKm === km
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                }`}
              >
                {km} km
              </button>
            ))}
          </div>
          <p className="text-[10px] text-slate-500">
            Residents within {radiusKm} km will see your profile as an available nearby provider.
          </p>
        </div>
      )}

      {helperText && !location && (
        <p className="text-[10px] text-slate-500 italic">{helperText}</p>
      )}
    </div>
  );
}
