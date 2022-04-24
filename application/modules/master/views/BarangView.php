


  <main>
    <div class="css-sj1k2s">
      <div class="css-wrap12">
        <form>
          <input type="text" placeholder="Cari Nama Barang/Kode/Kategori">
          <button class="fas fa-search"></button>
        </form>
        <button class="css-exprt1">
          <i class="fas fa-file-export"></i>
          Export
        </button>
      </div>
      <button class="css-addprd" id="addDataBtn">
        <i class="fas fa-plus"></i>
        Tambah Barang
      </button>
    </div>
    <div class="css-cons1s">
      <div class="css-headxs">
        <h3>Daftar Barang</h3>
        <table border="0" class="tbl-c8">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Barang</th>
              <th>Barcode</th>
              <th>Harga Pokok</th>
              <th>Harga Grosir</th>
              <th>Harga Eceran</th>
              <th>Aksi</th>
            </tr>
          </thead>
        </table>
      </div>
    </div>
    <div class="pagination-container"></div>
  </main>

  <script src="<?= base_url('assets/js/barang.js'); ?>"></script>



