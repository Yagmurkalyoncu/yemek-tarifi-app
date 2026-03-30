import { useState } from "react";

function App() {
  const [malzeme, setMalzeme] = useState("");
  const [tarifler, setTarifler] = useState([]);
  const [seciliTarif, setSeciliTarif] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(false);

  // Backend'e istek at, tarifleri getir
  const tarifleriAra = async () => {
    setYukleniyor(true);
    const cevap = await fetch(`http://localhost:5000/api/search?malzeme=${malzeme}`);
    const veri = await cevap.json();
    setTarifler(veri.meals || []);
    setYukleniyor(false);
    setSeciliTarif(null);
  };

  // Tarif detayını getir
  const detayGoster = async (id) => {
    const cevap = await fetch(`http://localhost:5000/api/detay/${id}`);
    const veri = await cevap.json();
    setSeciliTarif(veri.meals[0]);
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>🍽️ Yemek Tarifi Bul</h1>

      {/* Arama kutusu */}
      <input
        type="text"
        placeholder="Malzeme girin (örn: chicken)"
        value={malzeme}
        onChange={(e) => setMalzeme(e.target.value)}
        style={{ padding: "10px", width: "300px", fontSize: "16px" }}
      />
      <button
        onClick={tarifleriAra}
        style={{ padding: "10px 20px", marginLeft: "10px", fontSize: "16px" }}
      >
        Ara
      </button>

      {yukleniyor && <p>Yükleniyor...</p>}

      {/* Tarif listesi */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "15px", marginTop: "20px" }}>
        {tarifler.map((tarif) => (
          <div
            key={tarif.idMeal}
            onClick={() => detayGoster(tarif.idMeal)}
            style={{ cursor: "pointer", textAlign: "center", width: "150px" }}
          >
            <img src={tarif.strMealThumb} alt={tarif.strMeal} width="150" style={{ borderRadius: "10px" }} />
            <p>{tarif.strMeal}</p>
          </div>
        ))}
      </div>

      {/* Tarif detayı */}
      {seciliTarif && (
        <div style={{ marginTop: "30px", borderTop: "1px solid #ccc", paddingTop: "20px" }}>
          <h2>{seciliTarif.strMeal}</h2>
          <img src={seciliTarif.strMealThumb} alt={seciliTarif.strMeal} width="300" style={{ borderRadius: "10px" }} />
          <h3>Talimatlar:</h3>
          <p style={{ maxWidth: "600px" }}>{seciliTarif.strInstructions}</p>
        </div>
      )}
    </div>
  );
}

export default App;