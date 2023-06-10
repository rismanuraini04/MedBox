# MQTT TOPIC LIST

1. Update Bracelet Temprature Data

```
/bracelet/update/temp/+
```

Gunakan topic di atas jika ingin memperbaharui data temprature. Ganti `+` dengan Kode Unik Smart Bracelet. Parameter yang diperlukan dikirim ke topic tersebut adalah:

```json
{
  "temp": "str number",
  "id": "kode unik perangkat smart bracelet"
}
```

Contoh pengiriman data pada topin update temprature seperti berikut:

```json
//topic /bracelet/update/temp/GsEgt
//payload
{
  "temp": "30",
  "id": "GsEgt"
}
```

2. Update Berat Obat

```
/smartbox/update/weight/+
```

Gunakan topic di atas jika ingin memperbaharui data berat obat. Ganti `+` dengan Kode Unik Smart Box. Parameter yang diperlukan dikirim ke topic tersebut adalah:

```json
{
  "id": "kode unik perangkat smart box",
  "Box 1": "str number",
  "Box 2": "str number"
}
```

Contoh pengiriman data pada topik update temprature seperti berikut:

```json
//topic /smartbox/update/weight/A9Cac
//payload
{
  "id": "A9Cac",
  "Box 1": "11",
  "Box 2": "8"
}
```

3. Update History Pengambilan Obat

```json
//topic /smartbox/update/history/A9Cac
//payload
{
  "id": "A9Cac",
  "box": "Box 2"
}
```

4. Topic Untuk Perangkat Mendengarkan Event reminder

```
reminder-SMART_BOX_UNIQUE_ID
```

5. Topic Untuk memperbaharui riwayat pengambilan obat ketika terlambat

```
/smartbox/update/not-taken/history/SMART_BOX_UNIQUE_ID
```

```
{
  "id":"SMART_BOX_UNIQUE_ID",
  "box":"Box 1",
  "schedule":"Panadol medicine schedule 1 for, 10 Juni 2023 12.43@Panadol"
}
```
