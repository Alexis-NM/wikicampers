import { useState, useEffect } from "react";
import axios from "axios";
import AvailabilityForm from "./AvailabilityForm";

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/vehicles`)
      .then((response) => {
        setVehicles(response.data);
      })
      .catch((error) => {
        console.error("Error fetching vehicles:", error);
      });
  }, []);

  const handleAddAvailability = (vehicleId) => {
    setSelectedVehicleId(vehicleId);
  };

  return (
    <div>
      <h2>Liste des véhicules disponibles</h2>
      <table>
        <thead>
          <tr>
            <th>Marque</th>
            <th>Modèle</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((vehicle) => (
            <tr key={vehicle.id}>
              <td>{vehicle.marque}</td>
              <td>{vehicle.modele}</td>
              <td>
                <button onClick={() => handleAddAvailability(vehicle.id)}>
                  Gérer ce véhicule
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedVehicleId && <AvailabilityForm vehicleId={selectedVehicleId} />}
    </div>
  );
};

export default VehicleList;
