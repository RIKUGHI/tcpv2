

  <main class="cashier-container">
    <div class="prdct">
      <div class="css-cons1sc">
        <div class="css-headxs">
          <h3>Daftar Barang</h3>
          <div class="srch-box">
            <form>
              <input type="text" placeholder="Pencarian Otomatis Nama Barang/Kode">
              <button class="fas fa-search"></button>
            </form>
            <form>  
              <input type="text" placeholder="Scan Barcode" autofocus>
              <button class="fas fa-barcode"></button>
            </form>
          </div>
          <table border="0" class="tbl-c5">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Barang</th>
                <th>Barcode</th>
                <th>Satuan</th>
                <th>Aksi</th>
              </tr>
            </thead>
          </table>
        </div>
      </div>
      <div class="pagination-container"></div>
    </div>
    <div class="cshr">
      <div class="css-cons1sc">
        <div class="css-headxs">
          <h3>Keranjang</h3>
          <table border="0" class="tbl-c5">
            <thead>
              <tr>
                <th>Nama Barang</th>
                <th>Harga</th>
                <th>Jumlah</th>
                <th>Sub Total</th>
                <th>Aksi</th>
              </tr>
            </thead>
          </table>
        </div>
      </div>
      <div class="css-rs"></div>
    </div>
  </main>





  

  <script src="<?= base_url('assets/js/kasir.js'); ?>"></script>