<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8" />
<title>Invoice</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<link rel="stylesheet" href="css/style.css"/>
<script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></script>
</head>
<body>

<div class="invoice-wrapper" id="invoiceArea">
  <div class="invoice">
    <div class="header">
      <h1>Sayfullah</h1>
      <p>Jl. Murung Selong RT 12 No. 04 Sungai Lulut, Banjarmasin Timur</p>
      <p>WA: 082152412854</p>
    </div>

    <div class="customer">
      <strong id="custName"></strong><br>
      <span id="custWa"></span>
    </div>

    <table>
      <thead>
        <tr>
          <th>No</th>
          <th>Tgl</th>
          <th>Item</th>
          <th>Qty</th>
          <th>Harga</th>
          <th>Jumlah</th>
          <th class="no-print">Aksi</th>
        </tr>
      </thead>
      <tbody id="items"></tbody>
    </table>

    <div class="summary" id="summary"></div>

    <h3>Pembayaran</h3>
    <div id="payments"></div>
  </div>
</div>

<div class="bottom-bar no-print">
  <button onclick="history.back()">Kembali</button>
  <button onclick="addItem()">Tambah Item</button>
  <button onclick="addPayment()">Bayar</button>
  <button onclick="sendWhatsApp()">WhatsApp</button>
  <button onclick="window.print()">PDF</button>
</div>

<script type="module" src="js/invoice.js"></script>
</body>
</html>
