// Location ko coordinates mein convert karne ka function

async function getCoordinatesFromLocation(location, country) {
    try {
        // Location string ko URL-safe banayiye
        const query = encodeURIComponent(`${location}, ${country}`);
        
        // Free geocoding API call (Nominatim)
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`
        );
        
        const data = await response.json();
        
        // Agar data mila hai
        if (data && data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon)
            };
        }
        
        // Agar API fail ho jaye to default coordinates
        return getDefaultCoordinates(country);
        
    } catch (error) {
        console.error('Geocoding error:', error);
        return getDefaultCoordinates(country);
    }
}

// Backup coordinates for major countries
function getDefaultCoordinates(country) {
    const coords = {
        'Pakistan': { lat: 30.3753, lng: 69.3451 },
        'India': { lat: 20.5937, lng: 78.9629 },
        'United States': { lat: 39.8283, lng: -98.5795 },
        'United Kingdom': { lat: 55.3781, lng: -3.4360 }
    };
    
    return coords[country] || { lat: 0, lng: 0 };
}

module.exports = { getCoordinatesFromLocation };