import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, Circle } from '@react-google-maps/api';

const defaultLocation = {
  lat: 37.3382, // Latitude for San Jose, CA
  lng: -121.8863 // Longitude for San Jose, CA
};

export default function FindATMs() {
  const [location, setLocation] = useState(''); // Set default location
  const [mapCenter, setMapCenter] = useState(defaultLocation);
  const [atmLocations, setAtmLocations] = useState([]); // Store ATM locations

  // Function to fetch coordinates based on city using Ninja Geocoding API
  const fetchCoordinates = async (input: string) => {
    const url = `https://api.api-ninjas.com/v1/geocoding?city=${encodeURIComponent(input)}`;
    const options = {
      method: 'GET',
      headers: {
        'X-Api-Key': 'vaJ7/ASLqE06EHD1TXfvcA==R5MqwbDAwExbG4RS', // Replace with your actual API key
      },
      contentType: 'application/json',
    };

    try {
      const res = await fetch(url, options);
      const data = await res.json();
      if (data && data.length > 0) {
        const cityData = data[0]; // Assuming the first result is the most relevant
        const newLat = cityData.latitude;
        const newLng = cityData.longitude;

        setMapCenter({
          lat: newLat,
          lng: newLng,
        });

        // Fetch ATM locations with new coordinates
        await fetchATMLocations(newLat, newLng); // Ensure to wait for this to complete
      } else {
        console.error('No valid city found. Please check the input format (City, State).');
        setMapCenter(defaultLocation);
        setAtmLocations([]); // Reset ATM locations
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      setMapCenter(defaultLocation);
      setAtmLocations([]); // Reset ATM locations on error
    }
  };

  // Function to fetch ATM locations using Yext API
  const fetchATMLocations = async (lat: number, lng: number) => {
    const url = `https://prod-cdn.us.yextapis.com/v2/accounts/me/search/vertical/query?experienceKey=locatorchasecom-locator&api_key=1faa61c769b0576b73d8081040aa651c&v=20220511&version=PRODUCTION&locale=en&input=&verticalKey=locations&limit=50&retrieveFacets=true&facetFilters=%7B"c_allowsDeposits"%3A%5B%5D%2C"c_chaseForBusiness"%3A%5B%5D%2C"c_hLAReviewsRating"%3A%5B%5D%2C"c_privateClient"%3A%5B%5D%2C"c_accessType"%3A%5B%5D%2C"c_hLALanguages"%3A%5B%5D%2C"c_bankLocationType"%3A%5B%5D%2C"c_jPMorganAdvisors"%3A%5B%5D%2C"c_limitedAccess"%3A%5B%5D%2C"c_homeLendingLocator"%3A%5B%5D%2C"c_openOnSunday"%3A%5B%5D%7D&skipSpellCheck=false&sessionTrackingEnabled=false&sortBys=%5B%5D&source=STANDARD`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.response && data.response.results.length > 0) {
        const locations = data.response.results.map((atm: any) => ({
          lat: atm.data.geocodedCoordinate.latitude,
          lng: atm.data.geocodedCoordinate.longitude,
        }));
        setAtmLocations(locations); // Update ATM locations
      } else {
        console.error('No ATMs found in this area.');
        setAtmLocations([]); // Reset if no ATMs are found
      }
    } catch (error) {
      console.error('Error fetching ATM locations:', error);
    }
  };

  // Handle search to update map center based on user input
  const handleSearch = () => {
    console.log('Searching for ATMs near:', location);
    fetchCoordinates(location); // Fetch coordinates when searching
  };

  return (
    <div className="flex flex-col h-[calc(100vh-88px)]">
      {/* Top Search Bar */}
      <div className="w-1/4 p-4 bg-white">
        <input
          type="text"
          placeholder="Enter a U.S. city, state (e.g., San Jose, California)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-2/3 p-2 border rounded-md focus:ring focus:ring-indigo-300"
        />
        <button
          onClick={handleSearch}
          className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Search
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow bg-white p-4">
        <LoadScript googleMapsApiKey="AIzaSyA6XertY-5bqa5hVgTRzkSmd0rIKmZywBg">
          <GoogleMap
            mapContainerStyle={{ height: "100%", width: "100%" }}
            center={mapCenter}
            zoom={12} // Adjust the zoom level as needed
          >
            {/* Circle to represent the 15-mile radius */}
            <Circle
              center={mapCenter}
              radius={24140} // 15 miles in meters
              options={{
                strokeColor: "#FF0000",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "#FF0000",
                fillOpacity: 0.35,
              }}
            />

            {/* Plot ATM locations as markers */}
            {atmLocations.map((location, index) => (
              <Marker key={index} position={location} />
            ))}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
}
