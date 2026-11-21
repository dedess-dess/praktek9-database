# Praktek 9 - REST API Node-RED untuk Sistem IoT

Nama  : Desyifa Salsabila
NPM   : 2410020093
Kelas : 5B Sistem Informasi (Reg Siang)

## Deskripsi
Sistem monitoring dan kontrol IoT sederhana:
- Simulator ESP32 (Python) mengirim data suhu dan kelembaban lewat MQTT (Mosquitto).
- Node-RED berperan sebagai backend REST API.
- Dashboard web (HTML/CSS/JS) mengambil data lewat REST API dan bisa mengirim perintah kontrol.

Alur data:

    Simulator ESP32 --MQTT--> Mosquitto --MQTT--> Node-RED --REST API--> Dashboard Web
    Dashboard Web --REST API--> Node-RED --MQTT--> Mosquitto --MQTT--> Simulator ESP32

## Isi Repository
| File | Fungsi |
|---|---|
| `simulasi_esp32.py` | Simulator ESP32: publish data sensor, menerima perintah kontrol dan notifikasi |
| `flow-iot-api.json` | Flow Node-RED (backend REST API + halaman dashboard) |
| `settings-snippet.js` | Potongan konfigurasi `settings.js` Node-RED untuk mengaktifkan SQLite |
| `dashboard.html` | Dashboard web (salinan; sudah tertanam di flow dan dilayani di `/iot`) |

## Cara Menjalankan
1. Pastikan Mosquitto berjalan: `net start mosquitto` (CMD Administrator).
2. Jalankan Node-RED: `node-red`, lalu buka `http://localhost:1880`.
3. Di Node-RED: menu > Import > pilih `flow-iot-api.json` > Deploy.
4. Install library Python: `pip install paho-mqtt`, lalu jalankan: `python simulasi_esp32.py`
5. Buka dashboard: `http://localhost:1880/iot`

## Setup Database SQLite (sekali saja)
Database memakai modul bawaan Node.js (`node:sqlite`, Node.js 22.5 ke atas), tanpa install package tambahan.
1. Hentikan Node-RED (Ctrl+C).
2. Buka `%USERPROFILE%\.node-red\settings.js`, cari `functionGlobalContext` dan tambahkan isi `settings-snippet.js` di dalamnya.
3. Simpan, lalu jalankan `node-red` lagi dan import `flow-iot-api.json`.
4. Cek di browser: `http://localhost:1880/api/db-status` harus menampilkan `"sqlite": true`.

File database tersimpan di `%USERPROFILE%\.node-red\iot-history.db`.

## Endpoint REST API
| Endpoint | Method | Fungsi | API Key |
|---|---|---|---|
| `/api/suhu` | GET | Data sensor terakhir (plus batas dan status alert) | Tidak |
| `/api/history` | GET | 50 data sensor terakhir (dari SQLite, field `source` menunjukkan sumbernya) | Tidak |
| `/api/db-status` | GET | Status database (aktif atau tidak, jumlah baris) | Tidak |
| `/api/kontrol` | POST | Kirim perintah ke perangkat (`{"device":"lamp","action":"on"}`) | Ya |
| `/api/threshold` | GET | Lihat batas suhu | Tidak |
| `/api/threshold` | PUT | Set batas suhu (`{"max":30}`) | Ya |

Selain REST, data sensor juga di-push lewat WebSocket di `ws://localhost:1880/ws/sensor`.

Endpoint yang butuh API key harus mengirim header `X-API-Key: iot-key-2026`.

Contoh:

    curl -X PUT http://localhost:1880/api/threshold -H "Content-Type: application/json" -H "X-API-Key: iot-key-2026" -d "{\"max\":28}"

## Tugas Pengembangan (Nilai Tambah)
- [x] Endpoint `/api/threshold` (PUT) untuk set batas suhu, dengan notifikasi MQTT (`iot/notifikasi`) dan banner peringatan di dashboard saat suhu melewati batas
- [x] Grafik real-time menggunakan Chart.js di dashboard
- [x] Autentikasi sederhana dengan API key via header `X-API-Key`
- [x] WebSocket di Node-RED (`ws://localhost:1880/ws/sensor`): data sensor di-push ke dashboard tanpa polling (polling hanya jadi cadangan kalau WebSocket putus)
- [x] Penyimpanan history ke database SQLite (`iot-history.db`, memakai SQLite bawaan Node.js), jadi riwayat tidak hilang saat Node-RED dimatikan; kalau SQLite tidak tersedia otomatis kembali memakai flow context

## Teknologi
Node-RED, Mosquitto (MQTT), SQLite, Python (paho-mqtt), HTML/CSS/JavaScript, Chart.js
