from flask import Flask, jsonify, request
from flask_cors import CORS
import requests

# Uygulamayı başlat
app = Flask(__name__)
CORS(app)  # React frontend'in bağlanabilmesi için

# Malzemeye göre tarif ara
@app.route('/api/search', methods=['GET'])
def search():
    malzeme = request.args.get('malzeme', '')
    if not malzeme:
        return jsonify({'error': 'Malzeme giriniz'}), 400
    
    url = "https://www.themealdb.com/api/json/v1/1/filter.php?i=" + malzeme
    sonuc = requests.get(url).json()
    return jsonify(sonuc)

# Tarif detayını getir
@app.route('/api/detay/<id>', methods=['GET'])
def detay(id):
    url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id
    sonuc = requests.get(url).json()
    return jsonify(sonuc)

# Uygulama çalışıyor mu kontrol et
@app.route('/api/saglik', methods=['GET'])
def saglik():
    return jsonify({'durum': 'calisiyor'})
# Kategoriye göre tarif ara
@app.route('/api/kategori/<kategori>', methods=['GET'])
def kategori(kategori):
    url = "https://www.themealdb.com/api/json/v1/1/filter.php?c=" + kategori
    sonuc = requests.get(url).json()
    return jsonify(sonuc)

# Ülkeye göre tarif ara
@app.route('/api/ulke/<ulke>', methods=['GET'])
def ulke(ulke):
    url = "https://www.themealdb.com/api/json/v1/1/filter.php?a=" + ulke
    sonuc = requests.get(url).json()
    return jsonify(sonuc)
# Rastgele tarif getir
@app.route('/api/rastgele', methods=['GET'])
def rastgele():
    url = "https://www.themealdb.com/api/json/v1/1/random.php"
    sonuc = requests.get(url).json()
    return jsonify(sonuc)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)