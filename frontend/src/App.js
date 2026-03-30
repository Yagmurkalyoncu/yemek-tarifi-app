import { useState, useEffect } from "react"; // 1. useEffect eklendi

const ceviri = {
  "tavuk": "chicken", "dana": "beef", "kuzu": "lamb",
  "balik": "fish", "domates": "tomato", "sogan": "onion",
  "sarimsak": "garlic", "patates": "potato", "havuc": "carrot",
  "pirinc": "rice", "makarna": "pasta", "peynir": "cheese",
  "yumurta": "egg", "sut": "milk", "un": "flour",
  "cikolata": "chocolate", "elma": "apple", "muz": "banana",
  "portakal": "orange", "limon": "lemon", "mantar": "mushroom",
  "ispanak": "spinach", "biber": "pepper", "salatalik": "cucumber",
  "kiyma": "mince", "somon": "salmon", "karides": "shrimp",
  "nohut": "chickpea", "mercimek": "lentil", "fasulye": "beans",
  "zeytin": "olive", "tereyagi": "butter", "seker": "sugar",
  "kabartma tozu": "baking powder", "vanilya": "vanilla",
  "tuz": "salt", "zeytinyagi": "olive oil"
};

const renkler = {
  lavanta: "#C9B8E8",
  lavantaKoyu: "#9B8EC4",
  mint: "#B8E8D8",
  mintKoyu: "#7CC4A8",
  krem: "#FFF8F0",
  beyaz: "#FFFFFF",
  yazi: "#5C5470",
  acik: "#F3EEFF",
};

function cevir(metin) {
  const normalize = metin.toLowerCase().trim()
    .replace(/ş/g, "s").replace(/ğ/g, "g").replace(/ü/g, "u")
    .replace(/ö/g, "o").replace(/ı/g, "i").replace(/ç/g, "c");
  return ceviri[normalize] || metin;
}

function AnaSayfa({ onTarifSec }) {
  const [malzeme, setMalzeme] = useState("");
  const [tarifler, setTarifler] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [dil, setDil] = useState("tr");

  const tarifleriAra = async () => {
    if (!malzeme.trim()) return;
    setYukleniyor(true);
    setTarifler([]);
    try {
      const malzemeler = malzeme.split(",").map(m => dil === "tr" ? cevir(m) : m.trim());
      const tumSonuclar = await Promise.all(
        malzemeler.map(m =>
          fetch("http://localhost:5000/api/search?malzeme=" + m)
            .then(r => r.json())
            .then(v => v.meals || [])
        )
      );
      
      const ilk = tumSonuclar[0] || [];
      const ortak = ilk.filter(tarif =>
        tumSonuclar.every(liste =>
          liste.some(t => t.idMeal === tarif.idMeal)
        )
      );
      setTarifler(ortak);
    } catch (e) {
      console.error(e);
    } finally {
      setYukleniyor(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: renkler.krem, fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{
        background: "linear-gradient(135deg, " + renkler.lavanta + ", " + renkler.mint + ")",
        padding: "40px 30px",
        textAlign: "center",
        borderBottom: "3px solid " + renkler.lavantaKoyu
      }}>
        <h1 style={{ color: renkler.yazi, margin: 0, fontSize: "42px", fontWeight: "800", letterSpacing: "1px" }}>
          🍽️ Yemek Tarifi Bul
        </h1>
        <p style={{ color: renkler.yazi, opacity: 0.8, fontSize: "16px", marginTop: "8px" }}>
          ✨ Malzeme gir, sihirli tarifini bul ✨
        </p>
      </div>

      <div style={{ textAlign: "center", paddingTop: "25px", gap: "10px", display: "flex", justifyContent: "center" }}>
        <button onClick={() => setDil("tr")} style={{ padding: "8px 20px", background: dil === "tr" ? renkler.lavantaKoyu : renkler.acik, color: dil === "tr" ? "white" : renkler.yazi, border: "2px solid " + renkler.lavantaKoyu, borderRadius: "20px", cursor: "pointer", fontWeight: "bold" }}>🇹🇷 Türkçe Ara</button>
        <button onClick={() => setDil("en")} style={{ padding: "8px 20px", background: dil === "en" ? renkler.mintKoyu : renkler.acik, color: dil === "en" ? "white" : renkler.yazi, border: "2px solid " + renkler.mintKoyu, borderRadius: "20px", cursor: "pointer", fontWeight: "bold" }}>🇬🇧 English Search</button>
      </div>

      <div style={{ textAlign: "center", padding: "20px 30px 30px" }}>
        <input
          type="text"
          placeholder={dil === "tr" ? "✏️ Malzeme girin (örn: tavuk, soğan)" : "✏️ Enter ingredient (e.g: chicken, onion)"}
          value={malzeme}
          onChange={(e) => setMalzeme(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && tarifleriAra()}
          style={{ padding: "14px 18px", width: "320px", borderRadius: "30px", border: "2px solid " + renkler.lavanta, outline: "none" }}
        />
        <button onClick={tarifleriAra} style={{ padding: "14px 28px", marginLeft: "12px", background: "linear-gradient(135deg, " + renkler.lavantaKoyu + ", " + renkler.mintKoyu + ")", color: "white", border: "none", borderRadius: "30px", cursor: "pointer", fontWeight: "bold" }}>Ara 🔍</button>
      </div>

      {yukleniyor && <p style={{ textAlign: "center", color: renkler.lavantaKoyu }}>🌀 Tarifler aranıyor...</p>}
      {!yukleniyor && tarifler.length === 0 && malzeme && <p style={{ textAlign: "center", color: "#aaa" }}>😔 Sonuç bulunamadı.</p>}

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", padding: "40px", justifyContent: "center" }}>
        {tarifler.map((tarif) => (
          <div key={tarif.idMeal} onClick={() => onTarifSec(tarif.idMeal)} style={{ background: renkler.beyaz, borderRadius: "20px", padding: "12px", width: "165px", textAlign: "center", cursor: "pointer", border: "2px solid " + renkler.lavanta }}>
            <img src={tarif.strMealThumb} alt={tarif.strMeal} width="145" style={{ borderRadius: "12px" }} />
            <p style={{ fontSize: "13px", marginTop: "8px", fontWeight: "bold", color: renkler.yazi }}>{tarif.strMeal}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function DetaySayfa({ tarifId, onGeri }) {
  const [tarif, setTarif] = useState(null);

  // DÜZELTME: useState yerine useEffect kullanıldı
  useEffect(() => {
    fetch("http://localhost:5000/api/detay/" + tarifId)
      .then(r => r.json())
      .then(v => setTarif(v.meals[0]))
      .catch(err => console.error("Hata:", err));
  }, [tarifId]);

  const malzemeleriGetir = (tarif) => {
    const liste = [];
    for (let i = 1; i <= 20; i++) {
      const m = tarif["strIngredient" + i];
      const miktar = tarif["strMeasure" + i];
      if (m && m.trim()) liste.push((miktar ? miktar.trim() : "") + " " + m.trim());
    }
    return liste;
  };

  if (!tarif) return <p style={{ textAlign: "center", padding: "50px", color: "#9B8EC4" }}>🌀 Yükleniyor...</p>;

  return (
    <div style={{ minHeight: "100vh", background: renkler.krem, fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ background: "linear-gradient(135deg, " + renkler.lavanta + ", " + renkler.mint + ")", padding: "20px 30px", borderBottom: "3px solid " + renkler.lavantaKoyu, display: "flex", alignItems: "center", gap: "15px" }}>
        <button onClick={onGeri} style={{ background: renkler.beyaz, color: renkler.lavantaKoyu, border: "2px solid " + renkler.lavantaKoyu, padding: "8px 18px", borderRadius: "20px", cursor: "pointer", fontWeight: "bold" }}>← Geri</button>
        <h2 style={{ color: renkler.yazi, margin: 0 }}>Tarif Detayı</h2>
      </div>

      <div style={{ maxWidth: "800px", margin: "30px auto", background: renkler.beyaz, borderRadius: "24px", padding: "35px", border: "2px solid " + renkler.lavanta }}>
        <h2 style={{ color: renkler.lavantaKoyu }}>🍴 {tarif.strMeal}</h2>
        <div style={{ display: "flex", gap: "25px", flexWrap: "wrap" }}>
          <img src={tarif.strMealThumb} alt={tarif.strMeal} width="280" style={{ borderRadius: "16px" }} />
          <div style={{ flex: 1, minWidth: "200px" }}>
            <h3 style={{ color: renkler.mintKoyu }}>🥕 Malzemeler</h3>
            <ul style={{ paddingLeft: "18px", lineHeight: "1.9", color: renkler.yazi }}>
              {malzemeleriGetir(tarif).map((m, i) => <li key={i}>{m}</li>)}
            </ul>
          </div>
        </div>
        <h3 style={{ color: renkler.mintKoyu, marginTop: "25px" }}>📋 Talimatlar</h3>
        <p style={{ lineHeight: "1.8", whiteSpace: "pre-line", color: renkler.yazi }}>{tarif.strInstructions}</p>
        
        {/* DÜZELTME: <a> etiketi eklendi */}
        <a 
          href={"https://translate.google.com/?sl=en&tl=tr&text=" + encodeURIComponent("MALZEMELER:\n" + malzemeleriGetir(tarif).join("\n") + "\n\nTALIMATLAR:\n" + tarif.strInstructions)}
          target="_blank"
          rel="noreferrer"
          style={{
            display: "inline-block", marginTop: "20px", padding: "12px 24px",
            background: "linear-gradient(135deg, #4285F4, #34A853)",
            color: "white", borderRadius: "25px", textDecoration: "none", fontWeight: "bold"
          }}
        >
          🌍 Türkçeye Çevir
        </a>
      </div>
    </div>
  );
}

function App() {
  const [secilenTarifId, setSecilenTarifId] = useState(null);
  return secilenTarifId ? <DetaySayfa tarifId={secilenTarifId} onGeri={() => setSecilenTarifId(null)} /> : <AnaSayfa onTarifSec={setSecilenTarifId} />;
}

export default App;