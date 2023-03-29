> # TUGAS UNTUK RISMOYYY

---

Nih ris kumpulan tugas yang harus lu lakukan dan beberapa update yang udah gua lakukin

> Update yang sudah dilakukan 🚀

Ketika pengguna pertama login sekarang akan di cek apakah pengguna sudah memiliki perangkat smart medicine. Jika pengguna sudah memiliki perangkat pengguna akan langsung di arahkan ke dashboard, jika belum memiliki perangkat pengguna akan di arahkan kembali ke menu link device. Update dilakukan pada [app/router](/app/router.js). Gambar dibawah ini merupakan implementasi dari middleware, sedangkan [FILE INI](/middlewares/smartMedicineMiddleware.js) berisi fungsi yang mengecek apakah pengguna sudah memiliki perangkat.

![Router app](/_TASK/asset/approuter.png)

> TUGAS RISMOY 🐺

Secara garis besar tugas lu kali ini adalah membuat fungsi untuk melakukan pairing smart box dan smart bracelet. Sebelumnya kita sudah membuat fungsi untuk membuat smart box dan smart bracelet dan memasukan data nay ke database. Nah untuk kali ini kita akan mengisi tabel medicine dibawah ini.

![Db Scheme](/_TASK/asset/db.png)

Untuk mengisi tabel smart medicine kita akan membuat relasi antara tabel SmartBracelet serta SmartMedicine. Untuk melakukan relasi pelajari [halaman ini](https://www.prisma.io/docs/concepts/components/prisma-schema/relations).

```javascript
const updateAuthor = await prisma.user.update({
    where: {
        id: 20,
    },
    data: {
        posts: {
            connect: {
                id: 4,
            },
        },
    },
});
```

Snippet kode di atas merupakan gambaran untuk menautkan postingan dan penggunanya. Perhatikan bagian data dan keyword connect, merupakan initi dari apa yang ingin kita lakukan nanti. Sedangkan pada kasus kita yang perlu di buat adalah tabel SmartMedicine. berikut ini adalah tahapan-tahapan untuk membuat fungsi yang kita inginkan. HAPPY CODING RIS...

1. Buat folder `api_smartmedicine`
2. Buat controller dan router seperti yang sudah sudah
3. Registrasikan api tersebut ke [router utama](/router.js) seperti biasanya
4. Pada file router di folder `api_smartmedicine` buat endpoint/fungsi bernama **_link-to-device_** dengan method `post`.
5. Fungsi akan menerima dua paramter yang diinput oleh user, parameter tersebut adalah name, smartBraceletId dan smartBoxId. Kedua paramter tersebut didapatkan melalui `req.body`. Buat variabel dengan nama yang sama untuk menyimpan masing-masing parameter tersebut. SmartBraceletId dan smartBoxId nantinya akan berisi Id pendek atau `uniqCode` yang sudah dibuat sebelumnya.
6. Tabel SmartMedicine juga memerlukan relasi ke pengguna. Untuk melakukan relasi tersebut import fungsi untuk mendapatkan id pengguna, letakan snippet di bawah ini di bagian paling atas file.

```javascript
const { getUser } = require("../../services/auth");
```

7. Setelah itu pada fungsi **_link-to-device_** untuk mendapatkan user guanakan:

```javascript
const userId = await getuser(req);
```

8. Setelah mendapatkan semua parameter yang diinginkan masukan data-data tersebut ke dalam tabel database. INGAT TABEL YANG AKAN DIGUNAKAN ADALAH `SmartMedicine`. Untuk memasukan data tersebut kita perlu melakukan connection seperti contoh dibawah ini.

```javascript
const data = await prisma.tableName.create({
    data: {
        param1: param1,
        tableToConnect1: {
            connect: {
                uniqueId: someId,
            },
        },
        tableToConnect2: {
            connect: {
                uniqueId: someId,
            },
        },
    },
});
```

9. Setelah semua fungsi sudah dibuat lakukan uji coba dengan postman
