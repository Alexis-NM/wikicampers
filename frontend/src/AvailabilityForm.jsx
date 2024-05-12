import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";

function AvailabilityForm({ vehicleId }) {
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [prixParJour, setPrixParJour] = useState("");
  const [statut, setStatut] = useState("");
  const [availabilities, setAvailabilities] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [availabilityToDelete, setAvailabilityToDelete] = useState(null);
  const [availabilityToEdit, setAvailabilityToEdit] = useState(null); // Ajoutez un état pour stocker la disponibilité à modifier

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

  const handleModify = (availability) => {
    // Fonction pour sélectionner la disponibilité à modifier et pré-remplir le formulaire
    setAvailabilityToEdit(availability);
    setDateDebut(availability.dateDebut);
    setDateFin(availability.dateFin);
    setPrixParJour(availability.prixParJour);
    setStatut(availability.statut);
  };

  const handleEditSubmit = () => {
    // Fonction pour soumettre les modifications de la disponibilité
    const updatedAvailability = {
      ...availabilityToEdit,
      dateDebut: dateDebut,
      dateFin: dateFin,
      prixParJour: prixParJour,
      statut: statut,
    };

    axios
      .put(
        `http://localhost:8000/api/availabilities/${availabilityToEdit.id}`,
        updatedAvailability
      )
      .then((response) => {
        console.log("Availability updated successfully:", response.data);
        const updatedAvailabilities = availabilities.map((avail) => {
          if (avail.id === availabilityToEdit.id) {
            return response.data;
          }
          return avail;
        });
        setAvailabilities(updatedAvailabilities);
        setAvailabilityToEdit(null); // Réinitialiser la disponibilité à modifier après la modification réussie
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

  // Définissez la fonction pour ouvrir la modale et stocker l'ID de la disponibilité à supprimer
  const openModal = (availabilityId) => {
    setAvailabilityToDelete(availabilityId);
    setShowModal(true);
  };

  // Définissez la fonction pour fermer la modale
  const closeModal = () => {
    setShowModal(false);
    setAvailabilityToDelete(null); // Réinitialisez l'ID de la disponibilité à supprimer
  };

  return (
    <div>
      <h2>Disponibilités actuelles du véhicule</h2>
      <ul>
        {availabilities.map((availability) => (
          <li key={availability.id}>
            {availability.dateDebut} - {availability.dateFin} (Prix:{" "}
            {availability.prixParJour}€, Statut:{" "}
            {availability.statut ? "Disponible" : "Non Disponible"})
            <button onClick={() => handleModify(availability.id)}>
              Modifier
            </button>
            <button onClick={() => openModal(availability.id)}>
              Supprimer
            </button>
          </li>
        ))}
      </ul>

      {/* Modale de confirmation de suppression */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Confirmation de suppression</h2>
            <p>Êtes-vous sûr de vouloir supprimer cette disponibilité ?</p>
            <div className="modal-buttons">
              {/* Bouton pour confirmer la suppression */}
              <button
                onClick={() => {
                  handleDelete(availabilityToDelete);
                  closeModal(); // Fermez la modale après la suppression
                }}
              >
                Confirmer
              </button>
              {/* Bouton pour annuler la suppression */}
              <button onClick={closeModal}>Annuler</button>
            </div>
          </div>
        </div>
      )}
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
            onChange={(e) => setStatut(e.target.value === "true")}
            required
          >
            <option value="true">Disponible</option>
            <option value="false">Non Disponible</option>
          </select>
        </div>
        <button type="submit">Ajouter</button>
      </form>
    </div>
  );
}

AvailabilityForm.propTypes = {
  vehicleId: PropTypes.number.isRequired,
};

export default AvailabilityForm;
