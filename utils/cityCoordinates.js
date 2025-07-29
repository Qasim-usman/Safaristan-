// utils/cityCoordinates.js
const CITY_COORDINATES = {
    // Pakistan Cities
    'lahore,pakistan': { lat: 31.5204, lng: 74.3587 },
    'karachi,pakistan': { lat: 24.8607, lng: 67.0011 },
    'islamabad,pakistan': { lat: 33.6844, lng: 73.0479 },
    'rawalpindi,pakistan': { lat: 33.5651, lng: 73.0169 },
    'faisalabad,pakistan': { lat: 31.4504, lng: 73.1350 },
    'multan,pakistan': { lat: 30.1575, lng: 71.5249 },
    
    // India Cities  
    'mumbai,india': { lat: 19.0760, lng: 72.8777 },
    'delhi,india': { lat: 28.7041, lng: 77.1025 },
    'bangalore,india': { lat: 12.9716, lng: 77.5946 },
    
    // US Cities
    'new york,united states': { lat: 40.7128, lng: -74.0060 },
    'los angeles,united states': { lat: 34.0522, lng: -118.2437 }
};

function getCoordinatesManual(location, country) {
    const key = `${location.toLowerCase().trim()},${country.toLowerCase().trim()}`;
    console.log('🔍 [MANUAL] Looking for:', key);
    
    const coords = CITY_COORDINATES[key];
    if (coords) {
        console.log('✅ [MANUAL] Found:', coords);
        return coords;
    }
    
    console.log('❌ [MANUAL] Not found, using default');
    return getDefaultCoordinates(country);
}

module.exports = { getCoordinatesManual };