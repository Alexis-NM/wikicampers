import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";

const AvailabilityForm = ({ vehicleId }) => {
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [prixParJour, setPrixParJour] = useState("");
  const [statut, setStatut] = useState("");
  const [availabilities, setAvailabilities] = useState([]);

  useEffect(() => {
    // Récupérer les disponibilités actuelles du véhicule
    axios
      .get(`http://localhost:8000/api/availabilities/vehicle/${vehicleId}`)
      .then((response) => {
        setAvailabilities(response.data); // Pas besoin de mettre les données dans un tableau
      })
      .catch((error) => {
        console.error("Error fetching availabilities:", error);
      });
  }, [vehicleId]); // Effectuer cette requête à chaque changement de vehicleId

  const handleSubmit = (event) => {
    event.preventDefault();

    const newAvailability = {
      dateDebut: dateDebut,
      dateFin: dateFin,
      prixParJour: prixParJour,
      statut: statut,
      vehicle: { id: vehicleId },
    };

    axios
      .post("http://localhost:8000/api/availabilities", newAvailability)
      .then((response) => {
        console.log("Availability created successfully:", response.data);
        // Actualiser la liste des disponibilités après la création réussie
        setAvailabilities([...availabilities, response.data]);
      })
      .catch((error) => {
        console.error("Error creating availability:", error);
        // Gérer les erreurs ici, par exemple afficher un message d'erreur à l'utilisateur.
      });
  };
  const handleModify = (availabilityId) => {
    // Logique pour la modification d'une disponibilité
    const updatedAvailability = availabilities.find(
      (avail) => avail.id === availabilityId
    );
    if (!updatedAvailability) return;

    axios
      .put(
        `http://localhost:8000/api/availabilities/${availabilityId}`,
        updatedAvailability
      )
      .then((response) => {
        console.log("Availability updated successfully:", response.data);
        // Mettre à jour les disponibilités
        const updatedAvailabilities = availabilities.map((avail) => {
          if (avail.id === availabilityId) {
            return response.data;
          }
          return avail;
        });
        setAvailabilities(updatedAvailabilities);
      })
      .catch((error) => {
        console.error("Error updating availability:", error);
      });
  };

  const handleDelete = (availabilityId) => {
    // Logique pour la suppression d'une disponibilité
    axios
      .delete(`http://localhost:8000/api/availabilities/${availabilityId}`)
      .then((response) => {
        console.log("Availability deleted successfully:", response.data);
        // Filtrer les disponibilités pour supprimer celle qui a été supprimée
        const updatedAvailabilities = availabilities.filter(
          (avail) => avail.id !== availabilityId
        );
        setAvailabilities(updatedAvailabilities);
      })
      .catch((error) => {
        console.error("Error deleting availability:", error);
      });
  };

  return (
    <div>
      <h2>Disponibilités actuelles du véhicule</h2>
      <ul>
        {availabilities.map((availability) => (
          <li key={availability.id}>
            {availability.dateDebut} - {availability.dateFin} (Prix:{" "}
            {availability.prixParJour}€, Statut:{" "}
            {availability.statut ? "Disponible" : "Non disponible"})
            <button onClick={() => handleModify(availability.id)}>
              Modifier
            </button>
            <button onClick={() => handleDelete(availability.id)}>
              Supprimer
            </button>
          </li>
        ))}
      </ul>

      <h2>Ajouter une disponibilité pour ce véhicule</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Date de début :</label>
          <input
            type="datetime-local"
            value={dateDebut}
            onChange={(e) => setDateDebut(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Date de fin :</label>
          <input
            type="datetime-local"
            value={dateFin}
            onChange={(e) => setDateFin(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Prix par jour :</label>
          <input
            type="number"
            value={prixParJour}
            onChange={(e) => setPrixParJour(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Statut :</label>
          <select
            value={statut}
            onChange={(e) => setStatut(e.target.value)}
            required
          >
            <option value="true">Disponible</option>
            <option value="false">Non disponible</option>
          </select>
        </div>
        <button type="submit">Ajouter</button>
      </form>
    </div>
  );
};

AvailabilityForm.propTypes = {
  vehicleId: PropTypes.number.isRequired,
};

export default AvailabilityForm;
