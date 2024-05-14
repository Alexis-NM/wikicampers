import { useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import "./SearchForm.scss";

const SearchForm = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();

    // Construction de l'URL de la requête avec les paramètres de recherche
    const url = `${import.meta.env.VITE_BACKEND_URL}/availabilities`;

    // Envoi de la requête à l'API Symfony
    axios
      .get(url)
      .then((response) => {
        // Filtrer les résultats en fonction des critères de recherche
        const filteredResults = response.data.filter((availability) => {
          const availabilityStartDate = new Date(availability.dateDebut);
          const availabilityEndDate = new Date(availability.dateFin);

          const searchStartDate = new Date(startDate);
          const searchEndDate = new Date(endDate);

          const isWithinDateRange =
            availabilityStartDate <= searchStartDate &&
            availabilityEndDate >= searchEndDate;

          const isWithinPriceRange = availability.prixParJour <= maxPrice;

          return isWithinDateRange && isWithinPriceRange;
        });

        // Mettre à jour l'affichage avec les résultats de la recherche
        setSearchResults(filteredResults);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des données :", error);
      });
  };

  return (
    <article className="search-container">
      <h2>Rechercher des véhicules disponibles</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Date de départ :</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Date de retour :</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Prix maximum de location :</label>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
        <button type="submit" className="search-button">
          Rechercher
        </button>
      </form>

      {/* Affichage des résultats de la recherche */}
      <h3>Résultats de la recherche :</h3>
      {searchResults.length > 0 ? (
        <ul>
          {searchResults.map((availability) => (
            <li key={availability.id}>
              <h4>
                {availability.vehicle.marque} - {availability.vehicle.modele}
              </h4>
              <p>Prix par jour : {availability.prixParJour}€</p>
              <p>
                Disponible du{" "}
                {format(new Date(availability.dateDebut), "dd/MM/yyyy")} au{" "}
                {format(new Date(availability.dateFin), "dd/MM/yyyy")}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucun véhicule disponible pour ces dates ou ce prix.</p>
      )}
    </article>
  );
};

export default SearchForm;
