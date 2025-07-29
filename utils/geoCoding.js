const fetch = require('node-fetch');

async function getCoordinatesFromLocation(location, country) {
    console.log('🌐 [RENDER] Geocoding started:', location, country);
    
    try {
        // Input validation
        if (!location || !country) {
            console.log('❌ [RENDER] Missing location/country');
            return getDefaultCoordinates(country);
        }
        
        const query = encodeURIComponent(`${location.trim()}, ${country.trim()}`);
        console.log('📡 [RENDER] Query:', query);
        
        // Render-optimized fetch with longer timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 seconds
        
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1&addressdetails=1`,
            {
                method: 'GET',
                headers: {
                    'User-Agent': 'AirbnbClone-Render/1.0 (https://yourapp.onrender.com)',
                    'Accept': 'application/json',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Referer': 'https://yourapp.onrender.com' // Important for Render
                },
                signal: controller.signal
            }
        );
        
        clearTimeout(timeoutId);
        
        console.log('📊 [RENDER] Response Status:', response.status);
        console.log('📊 [RENDER] Response Headers:', Object.fromEntries(response.headers));
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('📋 [RENDER] API Data length:', data?.length);
        
        if (data && data.length > 0 && data[0].lat && data[0].lon) {
            const coordinates = {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon)
            };
            
            console.log('✅ [RENDER] SUCCESS:', coordinates);
            return coordinates;
        }
        
        console.log('⚠️ [RENDER] No coordinates found, using default');
        return getDefaultCoordinates(country);
        
    } catch (error) {
        if (error.name === 'AbortError') {
            console.log('⏰ [RENDER] Request timeout');
        } else {
            console.error('❌ [RENDER] Error:', error.message);
        }
        
        return getDefaultCoordinates(country);
    }
}

// Enhanced default coordinates
function getDefaultCoordinates(country) {
    console.log('🏠 [RENDER] Default coordinates for:', country);
    
    const coords = {
        'Pakistan': { lat: 30.3753, lng: 69.3451 },
        'India': { lat: 20.5937, lng: 78.9629 },
        'United States': { lat: 39.8283, lng: -98.5795 },
        'United Kingdom': { lat: 55.3781, lng: -3.4360 },
        'Canada': { lat: 56.1304, lng: -106.3468 }
    };
    
    return coords[country] || { lat: 0, lng: 0 };
}

module.exports = { getCoordinatesFromLocation };