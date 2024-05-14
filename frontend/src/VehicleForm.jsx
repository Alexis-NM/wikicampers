import { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import "./VehicleForm.scss";

function VehicleForm({ onAddVehicle }) {
  const [marque, setMarque] = useState("");
  const [modele, setModele] = useState("");
  const [showVehicleForm, setShowVehicleForm] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    const newVehicle = {
      marque: marque,
      modele: modele,
    };

    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/vehicles`, newVehicle)
      .then((response) => {
        console.info("Vehicle created successfully:", response.data);
        onAddVehicle(response.data);
        setShowVehicleForm(false);
      })
      .catch((error) => {
        console.error("Error creating vehicle:", error);
        // Gérer les erreurs ici, par exemple afficher un message d'erreur à l'utilisateur.
      });
  };

  const handleToggleVehicleForm = () => {
    setShowVehicleForm(!showVehicleForm);
  };

  return (
    <>
      {showVehicleForm ? (
        <article className="add-container">
          <button onClick={handleToggleVehicleForm} className="close-button">
            X
          </button>
          <h2>Ajouter un nouveau véhicule</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Marque :</label>
              <input
                type="text"
                value={marque}
                onChange={(e) => setMarque(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Modèle :</label>
              <input
                type="text"
                value={modele}
                onChange={(e) => setModele(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="add-button">
              Ajouter
            </button>
          </form>
        </article>
      ) : (
        <button onClick={handleToggleVehicleForm} className="add-button">
          Ajouter un véhicule
        </button>
      )}
    </>
  );
}

VehicleForm.propTypes = {
  onAddVehicle: PropTypes.func.isRequired,
};

export default VehicleForm;
