import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import AvailabilityForm from "./AvailabilityForm";
import VehicleForm from "./VehicleForm";
import "./VehicleList.scss";

function VehicleList({ onShowAvailabilityForm }) {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [availabilities, setAvailabilities] = useState({});
  const [showVehicles, setShowVehicles] = useState(false);

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
    onShowAvailabilityForm(vehicleId);
  };

  const handleDeleteVehicle = (vehicleId) => {
    axios
      .delete(`${import.meta.env.VITE_BACKEND_URL}/vehicles/${vehicleId}`)
      .then(() => {
        setVehicles(vehicles.filter((vehicle) => vehicle.id !== vehicleId));
      })
      .catch((error) => {
        console.error("Error deleting vehicle:", error);
      });
  };

  const getAvailabilities = (vehicleId) => {
    if (!availabilities[vehicleId]) {
      axios
        .get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/availabilities/vehicle/${vehicleId}`
        )
        .then((response) => {
          setAvailabilities((prevAvailabilities) => ({
            ...prevAvailabilities,
            [vehicleId]: response.data,
          }));
        })
        .catch((error) => {
          console.error("Error fetching availabilities:", error);
        });
    }
    return availabilities[vehicleId];
  };

  const handleToggleVehicles = () => {
    setShowVehicles(!showVehicles);
  };

  const onAddVehicle = (newVehicle) => {
    setVehicles((prevVehicles) => [...prevVehicles, newVehicle]);
  };

  return (
    <section>
      <button onClick={handleToggleVehicles} className="show-vehicle">
        {showVehicles ? "Masquer les véhicules" : "Afficher les véhicules"}
      </button>
      {showVehicles && (
        <>
          <h2>Liste des véhicules disponibles :</h2>
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
                      Gérer les disponibilités
                    </button>
                    {(getAvailabilities(vehicle.id) || []).length === 0 && (
                      <button
                        onClick={() => handleDeleteVehicle(vehicle.id)}
                        className="delete-button"
                      >
                        Supprimer ce véhicule
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {selectedVehicleId && (
            <AvailabilityForm vehicleId={selectedVehicleId} />
          )}
          <VehicleForm onAddVehicle={onAddVehicle} />
        </>
      )}
    </section>
  );
}

VehicleList.propTypes = {
  onShowAvailabilityForm: PropTypes.func.isRequired,
};

export default VehicleList;
