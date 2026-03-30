from flask import Flask, jsonify, request
from flask_cors import CORS
import requests

# Uygulamayı başlat
app = Flask(__name__)
CORS(app)  # Frontend'in bağlanabilmesi için

# Malzemeye göre tarif ara
@app.route('/api/search', methods=['GET'])
def search():
    malzeme = request.args.get('malzeme', '')
    url = f"https://www.themealdb.com/api/json/v1/1/filter.php?i={malzeme}"
    sonuc = requests.get(url).json()
    return jsonify(sonuc)

# Tarif detayını getir
@app.route('/api/detay/<id>', methods=['GET'])
def detay(id):
    url = f"https://www.themealdb.com/api/json/v1/1/lookup.php?i={id}"
    sonuc = requests.get(url).json()
    return jsonify(sonuc)

# Uygulama çalışıyor mu kontrol et
@app.route('/api/saglik', methods=['GET'])
def saglik():
    return jsonify({'durum': 'çalışıyor'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)