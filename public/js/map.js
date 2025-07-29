// const map = L.map('map').setView([<%= listing.coordinates.lat %>, <%= listing.coordinates.lng %>], 12);

// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '© OpenStreetMap contributors'
// }).addTo(map);

// const customIcon = L.divIcon({
//     html: '<div style="background-color: #FF5A5F; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-size: 16px;">🏠</div>',
//     iconSize: [30, 30],
//     iconAnchor: [15, 15]
// });

// L.marker([<%= listing.coordinates.lat %>, <%= listing.coordinates.lng %>], { icon: customIcon })
//     .addTo(map)
//     .bindPopup(`
//         <div style="text-align: center;">
//             <h6><%= listing.title %></h6>
//             <p>📍 <%= listing.location %>, <%= listing.country %></p>
//             <p style="color: #FF5A5F; font-weight: bold;">₹<%= listing.price %>/night</p>
//         </div>
//     `)
//     .openPopup();
