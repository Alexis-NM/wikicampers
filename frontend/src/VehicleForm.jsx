import { useState } from "react";
import axios from "axios";

const VehicleForm = () => {
  const [marque, setMarque] = useState("");
  const [modele, setModele] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const newVehicle = {
      marque: marque,
      modele: modele,
    };

    axios
      .post("http://localhost:8000/api/vehicles", newVehicle)
      .then((response) => {
        console.log("Vehicle created successfully:", response.data);
        // Vous pouvez effectuer une action ici après la création réussie du véhicule, comme afficher un message de confirmation.
      })
      .catch((error) => {
        console.error("Error creating vehicle:", error);
        // Gérer les erreurs ici, par exemple afficher un message d'erreur à l'utilisateur.
      });
  };

  return (
    <div>
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
        <button type="submit">Ajouter</button>
      </form>
    </div>
  );
};

export default VehicleForm;
