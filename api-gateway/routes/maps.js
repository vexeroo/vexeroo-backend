// First, you'll need an API Key from Google: https://developers.google.com/maps/documentation/javascript/get-api-key 
const GOOGLE_MAPS_API_KEY = 'YOUR_ACTUAL_API_KEY'; 

// This function serves to load the Google Maps script asynchronously
function loadMapScript() {
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=initMap`;  
  script.async = true;
  document.body.appendChild(script); 
}

// Initialize map, called once  Google Maps script finishes loading
function initMap() {
  const mapOptions = {
      zoom: 12,  // Start with a moderately zoomed view
      center: { lat: 37.7749, lng: -122.4194 } // Default: Center around San Francisco
  };

  const map = new google.maps.Map(document.getElementById('map-container'), mapOptions);

  // Example fetch and adding a marker:
  fetch('https://your-api/locations') // Assuming you have an API endpoint
    .then(response => response.json())
    .then(locationsData => {
      locationsData.forEach(location => {
         const marker = new google.maps.Marker({
           position: { lat: location.latitude, lng: location.longitude },
           map: map, 
           title: location.name // Display location name on hover
         });
      });
    })
    .catch(error => console.error('Error fetching location data:', error)); 
}

// // In your HTML where you want your map to display:
// <div id="map-container"></div>

// // At the end of your <body> in HTML (or an appropriately linked JS file)
// <script>loadMapScript();</script> 
