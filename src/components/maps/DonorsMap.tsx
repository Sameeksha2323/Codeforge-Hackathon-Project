
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Sample data for donors
const sampleDonors = [
  {
    id: 1,
    name: "John Doe Pharmaceuticals",
    location: [19.0760, 72.8777], // Mumbai coordinates
    medicines: ["Antibiotics", "Painkillers", "Insulin"],
    distance: 2.5 // Distance in km
  },
  {
    id: 2,
    name: "MediCare Hospital",
    location: [19.1136, 72.8560], // Andheri, Mumbai
    medicines: ["Asthma Inhalers", "Diabetes Medication"],
    distance: 1.8 // Distance in km
  },
  {
    id: 3,
    name: "HealthPlus Clinic",
    location: [19.1004, 72.8296], // Juhu, Mumbai
    medicines: ["Vitamin C", "Antibiotic Ointment"],
    distance: 3.2 // Distance in km
  }
];

// Sort donors by distance
const sortedDonors = [...sampleDonors].sort((a, b) => a.distance - b.distance);

interface DonorsMapProps {
  title: string;
  className?: string;
}

// Create custom blue marker
const blueIcon = new L.Icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'blue-marker' // This class will be styled with CSS
});

const DonorsMap: React.FC<DonorsMapProps> = ({ title, className }) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ height: '400px', width: '100%' }}>
          <MapContainer 
            center={[19.0760, 72.8777]} 
            zoom={11} 
            style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {sortedDonors.map(donor => (
              <Marker 
                key={donor.id} 
                position={[donor.location[0], donor.location[1]]} 
                icon={blueIcon}
              >
                <Popup>
                  <div>
                    <h3 className="font-bold">{donor.name}</h3>
                    <p>Available Medicines: {donor.medicines.join(', ')}</p>
                    <p className="text-sm text-green-600 font-medium mt-1">
                      {donor.distance} km away
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default DonorsMap;
