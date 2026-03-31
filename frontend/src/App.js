import { useState } from "react";

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
  "ekmek": "bread", "tuz": "salt", "zeytinyagi": "olive oil",
  "tarcin": "cinnamon", "nane": "mint", "maydanoz": "parsley",
  "kimyon": "cumin", "zencefil": "ginger"
};

const renkler = {
  lavanta: "#C9B8E8", lavantaKoyu: "#9B8EC4",
  mint: "#B8E8D8", mintKoyu: "#7CC4A8",
  krem: "#FFF8F0", beyaz: "#FFFFFF", yazi: "#5C5470", acik: "#F3EEFF",
};

const kategoriler = ["Beef", "Chicken", "Dessert", "Pasta", "Seafood", "Vegetarian", "Breakfast"];

const metin = {
  en: {
    baslik: "🍽️ Recipe Finder",
    altyazi: "✨ Enter ingredients, find your recipe ✨",
    ara: "Search",
    kategori: "📂 Category",
    ulke: "🌍 Country",
    araTab: "🔍 Search",
    placeholder: "Enter ingredients (e.g: chicken, onion)",
    yukleniyor: "🌀 Loading...",
    sonucYok: "😔 No results found.",
    malzemeler: "🥕 Ingredients",
    talimatlar: "📋 Instructions",
    cevir: "🌍 Translate to Turkish",
    geri: "← Back",
    tarifDetay: "Recipe Detail",
    kategoriler: { "Beef": "Beef 🥩", "Chicken": "Chicken 🍗", "Dessert": "Dessert 🍰", "Pasta": "Pasta 🍝", "Seafood": "Seafood 🦞", "Vegetarian": "Vegetarian 🥗", "Breakfast": "Breakfast 🍳" },
    ulkeler: { "Turkish": "Turkish 🇹🇷", "Italian": "Italian 🇮🇹", "French": "French 🇫🇷", "American": "American 🇺🇸", "Japanese": "Japanese 🇯🇵", "Chinese": "Chinese 🇨🇳", "Mexican": "Mexican 🇲🇽", "Greek": "Greek 🇬🇷" },
  },
  tr: {
    baslik: "🍽️ Yemek Tarifi Bul",
    altyazi: "✨ Malzeme gir, sihirli tarifini bul ✨",
    ara: "Ara",
    kategori: "📂 Kategori",
    ulke: "🌍 Ülke",
    araTab: "🔍 Ara",
    placeholder: "Malzeme girin (örn: tavuk, soğan)",
    yukleniyor: "🌀 Yükleniyor...",
    sonucYok: "😔 Sonuç bulunamadı.",
    malzemeler: "🥕 Malzemeler",
    talimatlar: "📋 Talimatlar",
    cevir: "🌍 Türkçeye Çevir",
    geri: "← Geri",
    tarifDetay: "Tarif Detayı",
    kategoriler: { "Beef": "Dana 🥩", "Chicken": "Tavuk 🍗", "Dessert": "Tatlı 🍰", "Pasta": "Makarna 🍝", "Seafood": "Deniz Ürünleri 🦞", "Vegetarian": "Vejetaryen 🥗", "Breakfast": "Kahvaltı 🍳" },
    ulkeler: { "Turkish": "Türk 🇹🇷", "Italian": "İtalyan 🇮🇹", "French": "Fransız 🇫🇷", "American": "Amerikan 🇺🇸", "Japanese": "Japon 🇯🇵", "Chinese": "Çin 🇨🇳", "Mexican": "Meksika 🇲🇽", "Greek": "Yunan 🇬🇷" },
  }
};

function cevir(m) {
  const n = m.toLowerCase().trim()
    .replace(/ş/g, "s").replace(/ğ/g, "g").replace(/ü/g, "u")
    .replace(/ö/g, "o").replace(/ı/g, "i").replace(/ç/g, "c");
  return ceviri[n] || m;
}

function TarifKarti({ tarif, onClick, renk }) {
  return (
    <div onClick={() => onClick(tarif.idMeal)}
      style={{ background: renkler.beyaz, borderRadius: "20px", padding: "12px", width: "165px", textAlign: "center", cursor: "pointer", boxShadow: "0 4px 15px rgba(201,184,232,0.3)", border: "2px solid " + renk, transition: "transform 0.2s" }}
      onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
      onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}>
      <img src={tarif.strMealThumb} alt={tarif.strMeal} width="145" style={{ borderRadius: "12px" }} />
      <p style={{ fontSize: "13px", marginTop: "8px", fontWeight: "bold", color: renkler.yazi }}>{tarif.strMeal}</p>
    </div>
  );
}

function AnaSayfa({ onTarifSec, dil, setDil }) {
  const t = metin[dil];
  const [sekme, setSekme] = useState("arama");
  const [malzeme, setMalzeme] = useState("");
  const [tarifler, setTarifler] = useState([]);
  const [filtreTarifler, setFiltreTarifler] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(false);

  const tarifleriAra = async () => {
    if (!malzeme.trim()) return;
    setYukleniyor(true);
    setTarifler([]);
    try {
      const malzemeler = malzeme.split(",").map(m => dil === "tr" ? cevir(m) : m.trim());
      const tumSonuclar = await Promise.all(
        malzemeler.map(m =>
          fetch("http://localhost:5000/api/search?malzeme=" + m)
            .then(r => r.json()).then(v => v.meals || [])
        )
      );
      const ilk = tumSonuclar[0] || [];
      const ortak = ilk.filter(tarif =>
        tumSonuclar.every(liste => liste.some(t => t.idMeal === tarif.idMeal))
      );
      setTarifler(ortak);
    } catch (e) {
      console.error(e);
    } finally {
      setYukleniyor(false);
    }
  };

  const filtreAra = async (tip, deger) => {
    setYukleniyor(true);
    setFiltreTarifler([]);
    const url = tip === "kategori"
      ? "http://localhost:5000/api/kategori/" + deger
      : "http://localhost:5000/api/ulke/" + deger;
    const cevap = await fetch(url).then(r => r.json());
    setFiltreTarifler(cevap.meals || []);
    setYukleniyor(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: renkler.krem, fontFamily: "'Segoe UI', sans-serif" }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, " + renkler.lavanta + ", " + renkler.mint + ")", padding: "40px 30px 30px", textAlign: "center", borderBottom: "3px solid " + renkler.lavantaKoyu, position: "relative" }}>
        
        {/* Dil butonu sağ üstte */}
        <div style={{ position: "absolute", top: "15px", right: "20px", display: "flex", gap: "6px" }}>
          <button onClick={() => setDil("en")}
            style={{ padding: "6px 14px", background: dil === "en" ? renkler.lavantaKoyu : renkler.beyaz, color: dil === "en" ? "white" : renkler.yazi, border: "2px solid " + renkler.lavantaKoyu, borderRadius: "15px", cursor: "pointer", fontWeight: "bold", fontSize: "13px" }}>
            EN
          </button>
          <button onClick={() => setDil("tr")}
            style={{ padding: "6px 14px", background: dil === "tr" ? renkler.lavantaKoyu : renkler.beyaz, color: dil === "tr" ? "white" : renkler.yazi, border: "2px solid " + renkler.lavantaKoyu, borderRadius: "15px", cursor: "pointer", fontWeight: "bold", fontSize: "13px" }}>
            TR
          </button>
        </div>

        <h1 style={{ color: renkler.yazi, margin: 0, fontSize: "42px", fontWeight: "800" }}>{t.baslik}</h1>
        <p style={{ color: renkler.yazi, opacity: 0.8, marginTop: "8px" }}>{t.altyazi}</p>
      </div>

      {/* Sekmeler */}
      <div style={{ display: "flex", justifyContent: "center", gap: "10px", padding: "25px 0 0" }}>
        {["arama", "kategori", "ulke"].map((s) => (
          <button key={s} onClick={() => setSekme(s)}
            style={{ padding: "10px 22px", background: sekme === s ? renkler.lavantaKoyu : renkler.acik, color: sekme === s ? "white" : renkler.yazi, border: "2px solid " + renkler.lavantaKoyu, borderRadius: "20px", cursor: "pointer", fontWeight: "bold" }}>
            {s === "arama" ? t.araTab : s === "kategori" ? t.kategori : t.ulke}
          </button>
        ))}
      </div>

      {/* Arama sekmesi */}
      {sekme === "arama" && (
        <div>
          <div style={{ textAlign: "center", padding: "20px 30px" }}>
            <input type="text" placeholder={t.placeholder} value={malzeme}
              onChange={(e) => setMalzeme(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && tarifleriAra()}
              style={{ padding: "14px 18px", width: "320px", fontSize: "15px", borderRadius: "30px", border: "2px solid " + renkler.lavanta, outline: "none", background: renkler.beyaz, color: renkler.yazi }} />
            <button onClick={tarifleriAra}
              style={{ padding: "14px 28px", marginLeft: "12px", fontSize: "15px", background: "linear-gradient(135deg, " + renkler.lavantaKoyu + ", " + renkler.mintKoyu + ")", color: "white", border: "none", borderRadius: "30px", cursor: "pointer", fontWeight: "bold" }}>
              {t.ara} 🔍
            </button>
          </div>
          {yukleniyor && <p style={{ textAlign: "center", color: renkler.lavantaKoyu }}>{t.yukleniyor}</p>}
          {!yukleniyor && tarifler.length === 0 && malzeme && <p style={{ textAlign: "center", color: "#aaa" }}>{t.sonucYok}</p>}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", padding: "0 40px 40px", justifyContent: "center" }}>
            {tarifler.map(tarif => <TarifKarti key={tarif.idMeal} tarif={tarif} onClick={onTarifSec} renk={renkler.lavanta} />)}
          </div>
        </div>
      )}

      {/* Kategori sekmesi */}
      {sekme === "kategori" && (
        <div style={{ padding: "20px 40px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center", marginBottom: "20px" }}>
            {kategoriler.map(k => (
              <button key={k} onClick={() => filtreAra("kategori", k)}
                style={{ padding: "10px 20px", background: renkler.lavanta, border: "none", borderRadius: "20px", cursor: "pointer", fontWeight: "bold", color: renkler.yazi }}>
                {t.kategoriler[k]}
              </button>
            ))}
          </div>
          {yukleniyor && <p style={{ textAlign: "center", color: renkler.lavantaKoyu }}>{t.yukleniyor}</p>}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
            {filtreTarifler.map(tarif => <TarifKarti key={tarif.idMeal} tarif={tarif} onClick={onTarifSec} renk={renkler.lavanta} />)}
          </div>
        </div>
      )}

      {/* Ülke sekmesi */}
      {sekme === "ulke" && (
        <div style={{ padding: "20px 40px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center", marginBottom: "20px" }}>
            {Object.keys(t.ulkeler).map(u => (
              <button key={u} onClick={() => filtreAra("ulke", u)}
                style={{ padding: "10px 20px", background: renkler.mint, border: "none", borderRadius: "20px", cursor: "pointer", fontWeight: "bold", color: renkler.yazi }}>
                {t.ulkeler[u]}
              </button>
            ))}
          </div>
          {yukleniyor && <p style={{ textAlign: "center", color: renkler.mintKoyu }}>{t.yukleniyor}</p>}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
            {filtreTarifler.map(tarif => <TarifKarti key={tarif.idMeal} tarif={tarif} onClick={onTarifSec} renk={renkler.mint} />)}
          </div>
        </div>
      )}

      <div style={{ textAlign: "center", padding: "20px", color: renkler.lavantaKoyu, fontSize: "13px" }}>
        🌸 Made with love & code 🌸
      </div>
    </div>
  );
}

function DetaySayfa({ tarifId, onGeri, dil }) {
  const t = metin[dil];
  const [tarif, setTarif] = useState(null);

  useState(() => {
    fetch("http://localhost:5000/api/detay/" + tarifId)
      .then(r => r.json()).then(v => setTarif(v.meals[0]));
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

  if (!tarif) return <p style={{ textAlign: "center", padding: "50px", color: renkler.lavantaKoyu }}>{t.yukleniyor}</p>;

  return (
    <div style={{ minHeight: "100vh", background: renkler.krem, fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ background: "linear-gradient(135deg, " + renkler.lavanta + ", " + renkler.mint + ")", padding: "20px 30px", borderBottom: "3px solid " + renkler.lavantaKoyu, display: "flex", alignItems: "center", gap: "15px" }}>
        <button onClick={onGeri}
          style={{ background: renkler.beyaz, color: renkler.lavantaKoyu, border: "2px solid " + renkler.lavantaKoyu, padding: "8px 18px", borderRadius: "20px", cursor: "pointer", fontWeight: "bold" }}>
          {t.geri}
        </button>
        <h2 style={{ color: renkler.yazi, margin: 0 }}>{t.tarifDetay}</h2>
      </div>

      <div style={{ maxWidth: "800px", margin: "30px auto", background: renkler.beyaz, borderRadius: "24px", padding: "35px", boxShadow: "0 8px 30px rgba(201,184,232,0.3)", border: "2px solid " + renkler.lavanta }}>
        <h2 style={{ color: renkler.lavantaKoyu, marginTop: 0 }}>🍴 {tarif.strMeal}</h2>
        <div style={{ display: "flex", gap: "25px", flexWrap: "wrap" }}>
          <img src={tarif.strMealThumb} alt={tarif.strMeal} width="280" style={{ borderRadius: "16px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }} />
          <div style={{ flex: 1, minWidth: "200px" }}>
            <h3 style={{ color: renkler.mintKoyu }}>{t.malzemeler}</h3>
            <ul style={{ paddingLeft: "18px", lineHeight: "1.9", color: renkler.yazi }}>
              {malzemeleriGetir(tarif).map((m, i) => <li key={i}>{m}</li>)}
            </ul>
          </div>
        </div>
        <h3 style={{ color: renkler.mintKoyu, marginTop: "25px" }}>{t.talimatlar}</h3>
        <p style={{ lineHeight: "1.8", whiteSpace: "pre-line", color: renkler.yazi }}>{tarif.strInstructions}</p>
        <a href={"https://translate.google.com/?sl=en&tl=tr&text=" + encodeURIComponent("INGREDIENTS:\n" + malzemeleriGetir(tarif).join("\n") + "\n\nINSTRUCTIONS:\n" + tarif.strInstructions)}
          target="_blank" rel="noreferrer"
          style={{ display: "inline-block", marginTop: "20px", padding: "12px 24px", background: "linear-gradient(135deg, #4285F4, #34A853)", color: "white", borderRadius: "25px", textDecoration: "none", fontWeight: "bold" }}>
          {t.cevir}
        </a>
      </div>

      <div style={{ textAlign: "center", padding: "20px", color: renkler.lavantaKoyu, fontSize: "13px" }}>
        🌸 Made with love & code 🌸
      </div>
    </div>
  );
}

function App() {
  const [secilenTarifId, setSecilenTarifId] = useState(null);
  const [dil, setDil] = useState("en");

  if (secilenTarifId) {
    return <DetaySayfa tarifId={secilenTarifId} onGeri={() => setSecilenTarifId(null)} dil={dil} />;
  }

  return <AnaSayfa onTarifSec={setSecilenTarifId} dil={dil} setDil={setDil} />;
}

export default App;