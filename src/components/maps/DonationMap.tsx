
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

// Sample data for donation centers
const sampleCenters = [
  {
    id: 1,
    name: "City Hospital",
    location: [19.0760, 72.8777], // Mumbai coordinates (lat, lng)
    medicines: ["Antibiotics", "Painkillers"],
    distance: 2.3 // Distance in km
  },
  {
    id: 2,
    name: "Rural Health Center",
    location: [19.1136, 72.8560], // Andheri, Mumbai
    medicines: ["Asthma Inhalers", "Vitamins"],
    distance: 4.5 // Distance in km
  },
  {
    id: 3,
    name: "Community Clinic",
    location: [19.1004, 72.8296], // Juhu, Mumbai
    medicines: ["First Aid Supplies", "Diabetes Medication"],
    distance: 1.7 // Distance in km
  }
];

// Sort centers by distance
const sortedCenters = [...sampleCenters].sort((a, b) => a.distance - b.distance);

interface DonationMapProps {
  title: string;
  className?: string;
}

// Create custom orange marker
const orangeIcon = new L.Icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'orange-marker' // This class will be styled with CSS
});

const DonationMap: React.FC<DonationMapProps> = ({ title, className }) => {
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
            
            {sortedCenters.map(center => (
              <Marker 
                key={center.id} 
                position={[center.location[0], center.location[1]]} 
                icon={orangeIcon}
              >
                <Popup>
                  <div>
                    <h3 className="font-bold">{center.name}</h3>
                    <p>Needed Medicines: {center.medicines.join(', ')}</p>
                    <p className="text-sm text-green-600 font-medium mt-1">
                      {center.distance} km away
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

export default DonationMap;
