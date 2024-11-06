import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker, Circle, InfoWindow, useLoadScript } from '@react-google-maps/api';

type AtmLocation = {
  lat: number;
  lng: number;
  name: string; // Name of the ATM
  address: string; // Address of the ATM
};

const defaultLocation = {
  lat: 37.3382, // Latitude for San Jose, CA
  lng: -121.8863 // Longitude for San Jose, CA
};

export default function FindATMs() {
  const [location, setLocation] = useState(''); // Set default location
  const [mapCenter, setMapCenter] = useState(defaultLocation);
  const [atmLocations, setAtmLocations] = useState<AtmLocation[]>([]);
  const [selectedAtm, setSelectedAtm] = useState<AtmLocation | null>(null); // State to hold selected ATM

  // Load the Google Maps script
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyA6XertY-5bqa5hVgTRzkSmd0rIKmZywBg',
    libraries: ['places'], // Load the 'places' library for nearby search
  });

  // Function to fetch coordinates based on city using Ninja Geocoding API
  const fetchCoordinates = async (input: string) => {
    const url = `https://api.api-ninjas.com/v1/geocoding?city=${encodeURIComponent(input)}`;
    const options = {
      method: 'GET',
      headers: {
        'X-Api-Key': 'vaJ7/ASLqE06EHD1TXfvcA==R5MqwbDAwExbG4RS',
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

        // Perform nearby search for Chase ATMs after updating map center
        performNearbySearch({ lat: newLat, lng: newLng });
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

  // Function to perform nearby search using Google Places API for Chase ATMs
  const performNearbySearch = (location: { lat: number; lng: number }) => {
    if (isLoaded) {
      const service = new window.google.maps.places.PlacesService(document.createElement('div'));

      service.nearbySearch({
        location,
        radius: 24140,
        type: 'atm',
        keyword: 'Chase',
      }, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
          const locations: AtmLocation[] = results
            .filter((place) => place.geometry && place.geometry.location)
            .map((place) => ({
              lat: place.geometry!.location!.lat(),
              lng: place.geometry!.location!.lng(),
              name: place.name || 'Unknown Location', // Ensure name is a string
              address: place.vicinity || 'Address not available', // Get address from vicinity
            }));
          setAtmLocations(locations); // Update the ATM locations
        } else {
          console.error('No Chase ATMs found or an error occurred.');
          setAtmLocations([]); // Reset if no ATMs found or error
        }
      });
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
        {isLoaded ? (
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
            {atmLocations.map((atm, index) => (
              <Marker
                key={index}
                position={{ lat: atm.lat, lng: atm.lng }}
                onClick={() => setSelectedAtm(atm)} // Set selected ATM on click
              />
            ))}

            {/* InfoWindow to display ATM details */}
            {selectedAtm && (
              <InfoWindow
                position={{ lat: selectedAtm.lat, lng: selectedAtm.lng }}
                onCloseClick={() => setSelectedAtm(null)} // Close the InfoWindow
              >
                <div>
                  <h2>{selectedAtm.name}</h2>
                  <p>{selectedAtm.address}</p> {/* Display the address here */}
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        ) : (
          <div>Loading Map...</div>
        )}
      </div>
    </div>
  );
}
