import { useState } from "react";
import axios from "axios";

const SearchForm = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    // Construction de l'URL de la requête avec les paramètres de recherche
    const url = `https://localhost:8000/api/vehicles`;

    // Envoi de la requête à l'API Symfony avec les paramètres de recherche dans l'URL
    axios
      .get(url)
      .then((response) => {
        // Mettre à jour l'affichage avec les résultats de la recherche
        console.log("Vehicles available:", response.data);
      })
      .catch((error) => {
        console.error("Error fetching available vehicles:", error);
      });
  };

  return (
    <div>
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
        <button type="submit">Rechercher</button>
      </form>
    </div>
  );
};

export default SearchForm;
