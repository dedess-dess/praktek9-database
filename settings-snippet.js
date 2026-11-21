// Tambahkan entri 'iotdb' ini DI DALAM blok functionGlobalContext pada settings.js Node-RED
// (C:\Users\<nama-user>\.node-red\settings.js). Jangan lupa koma kalau sudah ada entri lain.
//
//    functionGlobalContext: {
//        // os:require('os'),
//        iotdb: (function () { ... })(),   <-- isi seperti di bawah
//    },

        iotdb: (function () {
            try {
                const { DatabaseSync } = require('node:sqlite');
                const path = require('path');
                const os = require('os');
                return new DatabaseSync(path.join(os.homedir(), '.node-red', 'iot-history.db'));
            } catch (e) {
                console.log('SQLite tidak tersedia:', e.message);
                return null;
            }
        })(),
