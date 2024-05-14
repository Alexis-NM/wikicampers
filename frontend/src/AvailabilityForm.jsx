import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import "./AvailabilityForm.scss";

function AvailabilityForm({ vehicleId, onShowVehicleList }) {
  // State variables for adding availability
  const [newDateDebut, setNewDateDebut] = useState("");
  const [newDateFin, setNewDateFin] = useState("");
  const [newPrixParJour, setNewPrixParJour] = useState("");
  const [newStatut, setNewStatut] = useState("");

  // State variables for editing availability
  const [editedDateDebut, setEditedDateDebut] = useState("");
  const [editedDateFin, setEditedDateFin] = useState("");
  const [editedPrixParJour, setEditedPrixParJour] = useState("");
  const [editedStatut, setEditedStatut] = useState("");

  const [availabilities, setAvailabilities] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [availabilityToDelete, setAvailabilityToDelete] = useState(null);
  const [availabilityToEdit, setAvailabilityToEdit] = useState(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const [isNotAvailable, setIsNotAvailable] = useState(false);

  const handleChange = (e) => {
    const { name, checked } = e.target;

    if (name === "available") {
      setIsAvailable(checked);
      setIsNotAvailable(false);
      setNewStatut(checked);
    } else if (name === "not-available") {
      setIsAvailable(false);
      setIsNotAvailable(checked);
      setNewStatut(false);
    }
  };

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
      dateDebut: newDateDebut,
      dateFin: newDateFin,
      prixParJour: newPrixParJour,
      statut: newStatut,
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
    setEditedDateDebut(availability.dateDebut);
    setEditedDateFin(availability.dateFin);
    setEditedPrixParJour(availability.prixParJour);
    setEditedStatut(availability.statut);
  };

  const handleEditSubmit = () => {
    const updatedAvailability = {
      ...availabilityToEdit,
      dateDebut: editedDateDebut,
      dateFin: editedDateFin,
      prixParJour: editedPrixParJour,
      statut: editedStatut,
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

  //Fonction pour ouvrir la modale de confirmation de suppression
  const openModal = (availabilityId) => {
    setAvailabilityToDelete(availabilityId);
    setShowModal(true);
  };

  // Fonction pour fermer la modale
  const closeModal = () => {
    setShowModal(false);
    setAvailabilityToDelete(null);
  };

  return (
    <section className="availability-container">
      <h2>Disponibilités du véhicule :</h2>
      {availabilities.length === 0 ? (
        <p>Aucune disponibilité pour le moment.</p>
      ) : (
        <ul>
          {availabilities.map((availability) => (
            <li key={availability.id}>
              {availability === availabilityToEdit ? (
                <form>
                  <div className="mod">
                    <label htmlFor="dateDebut">Date de début :</label>
                    <input
                      type="datetime-local"
                      id="dateDebut"
                      value={editedDateDebut}
                      onChange={(e) => setEditedDateDebut(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mod">
                    <label htmlFor="dateFin">Date de fin :</label>
                    <input
                      type="datetime-local"
                      id="dateFin"
                      value={editedDateFin}
                      onChange={(e) => setEditedDateFin(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mod">
                    <label htmlFor="prixParJour">Prix par jour :</label>
                    <input
                      type="number"
                      id="prixParJour"
                      value={editedPrixParJour}
                      onChange={(e) => setEditedPrixParJour(e.target.value)}
                      required
                    />
                  </div>
                  <div className="checkbox">
                    <label htmlFor="available">Disponible :</label>
                    <input
                      type="checkbox"
                      id="available"
                      name="available"
                      checked={editedStatut}
                      onChange={(e) => setEditedStatut(e.target.checked)}
                    />
                    <label htmlFor="not-available">Non disponible :</label>
                    <input
                      type="checkbox"
                      id="not-available"
                      name="not-available"
                      checked={!editedStatut}
                      onChange={(e) => setEditedStatut(!e.target.checked)}
                    />
                  </div>

                  <button
                    onClick={() => handleEditSubmit()}
                    className="validate"
                  >
                    Valider
                  </button>
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
      )}
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
      <h2>Ajouter une disponibilité pour ce véhicule :</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Date de début :</label>
          <input
            type="datetime-local"
            value={newDateDebut}
            onChange={(e) => setNewDateDebut(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Date de fin :</label>
          <input
            type="datetime-local"
            value={newDateFin}
            onChange={(e) => setNewDateFin(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Prix par jour :</label>
          <input
            type="number"
            value={newPrixParJour}
            onChange={(e) => setNewPrixParJour(e.target.value)}
            required
          />
        </div>
        <div className="checkbox">
          <label htmlFor="available"></label>
          Disponible :
          <input
            type="checkbox"
            id="available"
            name="available"
            checked={isAvailable}
            onChange={handleChange}
          />
          <label htmlFor="not-available">Non disponible :</label>
          <input
            type="checkbox"
            id="not-available"
            name="not-available"
            checked={isNotAvailable}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="add-button">
          Ajouter
        </button>
      </form>
      <button onClick={onShowVehicleList} className="button-back">
        Retour à la liste des véhicules
      </button>
    </section>
  );
}

AvailabilityForm.propTypes = {
  vehicleId: PropTypes.number.isRequired,
  onShowVehicleList: PropTypes.func.isRequired,
};

export default AvailabilityForm;
