import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";

function AvailabilityForm({ vehicleId }) {
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [prixParJour, setPrixParJour] = useState("");
  const [statut, setStatut] = useState(true);
  const [availabilities, setAvailabilities] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [availabilityToDelete, setAvailabilityToDelete] = useState(null);
  const [availabilityToEdit, setAvailabilityToEdit] = useState(null);

  useEffect(() => {
    // Récupérer les disponibilités actuelles du véhicule
    axios
      .get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/availabilities/vehicle/${vehicleId}`
      )
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
      .post(
        `${import.meta.env.VITE_BACKEND_URL}/availabilities`,
        newAvailability
      )
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
    setAvailabilityToEdit(availability);
    setDateDebut(availability.dateDebut);
    setDateFin(availability.dateFin);
    setPrixParJour(availability.prixParJour);
    setStatut(availability.statut);
  };

  const handleEditSubmit = () => {
    const updatedAvailability = {
      ...availabilityToEdit,
      dateDebut: dateDebut,
      dateFin: dateFin,
      prixParJour: prixParJour,
      statut: statut,
    };

    // Mettre à jour l'état `availabilities` avec la nouvelle version de la disponibilité modifiée
    const updatedAvailabilities = availabilities.map((availability) =>
      availability.id === availabilityToEdit.id
        ? updatedAvailability
        : availability
    );
    setAvailabilities(updatedAvailabilities);

    // Effectuer la requête PUT vers le backend pour mettre à jour la disponibilité dans la base de données
    axios
      .put(
        `${import.meta.env.VITE_BACKEND_URL}/availabilities/${
          availabilityToEdit.id
        }`,
        updatedAvailability
      )
      .then((response) => {
        console.log("Availability updated successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error updating availability:", error);
      });
  };

  const handleDelete = (availabilityId) => {
    // Logique pour la suppression d'une disponibilité
    axios
      .delete(
        `${import.meta.env.VITE_BACKEND_URL}/availabilities/${availabilityId}`
      )
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
            {availability === availabilityToEdit ? (
              <form>
                <div>
                  <label htmlFor="dateDebut">Date de début :</label>
                  <input
                    type="datetime-local"
                    id="dateDebut"
                    value={dateDebut}
                    onChange={(e) => setDateDebut(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="dateFin">Date de fin :</label>
                  <input
                    type="datetime-local"
                    id="dateFin"
                    value={dateFin}
                    onChange={(e) => setDateFin(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="prixParJour">Prix par jour :</label>
                  <input
                    type="number"
                    id="prixParJour"
                    value={prixParJour}
                    onChange={(e) => setPrixParJour(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="statut">Statut :</label>
                  <select
                    id="statut"
                    value={statut}
                    onChange={(e) => setStatut(e.target.value === "true")}
                    required
                  >
                    <option value="true">Disponible</option>
                    <option value="false">Non Disponible</option>
                  </select>
                </div>
                <button onClick={() => handleEditSubmit()}>Valider</button>
              </form>
            ) : (
              <>
                {availability.dateDebut} - {availability.dateFin} (Prix:{" "}
                {availability.prixParJour}€, Statut:{" "}
                {availability.statut ? "Disponible" : "Non Disponible"})
                <button onClick={() => handleModify(availability)}>
                  Modifier
                </button>
                <button onClick={() => openModal(availability.id)}>
                  Supprimer
                </button>
              </>
            )}
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
            onChange={(e) => setStatut(Boolean(e.target.value))}
            required
          >
            <option value={true}>Disponible</option>
            <option value={false}>Non Disponible</option>
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
