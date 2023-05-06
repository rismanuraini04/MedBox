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
    "id": "kode unik perangkat smart bracelet",
    "box1": "str number",
    "box2": "str number"
}
```

Contoh pengiriman data pada topin update temprature seperti berikut:

```json
//topic /smartbox/update/weight/GsEgt
//payload
{
    "id": "A9Cac",
    "box1": "11",
    "box2": "8"
}
```
