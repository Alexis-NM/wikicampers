import SearchForm from "./SearchForm";
import VehicleForm from "./VehicleForm";
import VehicleList from "./VehicleList";
// import Van from "./assets/VanLife.jpg";
import "./App.scss";

function App() {
  return (
    <main>
      <h1 className="main-title">WikiCampers</h1>
      {/* <img
        src={Van}
        alt="Van jaune à l'arrêt dans un paysage de nature désertique"
        className="van"
      /> */}
      <SearchForm />
      <VehicleForm />
      <VehicleList />
    </main>
  );
}
export default App;
