import SearchForm from "./SearchForm";
import VehicleList from "./VehicleList";
import AvailabilityForm from "./AvailabilityForm";
import "./App.scss";
import { useState } from "react";

function App() {
  const [showAvailabilityForm, setShowAvailabilityForm] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);

  const handleShowAvailabilityForm = (vehicleId) => {
    setShowAvailabilityForm(true);
    setSelectedVehicleId(vehicleId);
  };
  const handleShowVehicleList = () => {
    setShowAvailabilityForm(false);
  };

  return (
    <main>
      <h1 className="main-title">WikiCampers</h1>
      {!showAvailabilityForm && (
        <section className="search-container">
          <SearchForm />
        </section>
      )}
      {!showAvailabilityForm && (
        <section className="vehicle-list-container">
          <VehicleList onShowAvailabilityForm={handleShowAvailabilityForm} />
        </section>
      )}
      {showAvailabilityForm && (
        <section className="availability-form-container">
          <AvailabilityForm
            vehicleId={selectedVehicleId}
            onShowVehicleList={handleShowVehicleList}
          />
        </section>
      )}
    </main>
  );
}

export default App;
