

  <main>
    <div class="css-sj1k2s">
      <div class="css-wrap12">
        <div class="select-container">
          <div class="select-selected">
            <input type="text" value="Semua" readonly>
            <i class="fas fa-caret-down"></i>
          </div>
          <div class="control-select-option">
            <ul>
              <li class="active">Semua</li>
              <li>Per Periode</li>
          </ul>
          </div>
        </div>
        <form>
          <input type="text" placeholder="Cari Nama Supplier">
          <button class="fas fa-search"></button>
        </form>
      </div>
      <button class="css-addprd" id="addDataBtn">
        <i class="fas fa-plus"></i>
        Tambah Pembelian
      </button>
    </div>
    <div class="css-cons1s">
      <div class="css-headxs">
        <h3>Daftar Satuan</h3>
        <table border="0" class="tbl-c6">
          <thead>
            <tr>
              <th>No</th>
              <th>Foto</th>
              <th>Supplier</th>
              <th>Tanggal</th>
              <th>Catatan</th>
              <th>Aksi</th>
            </tr>
          </thead>
        </table>
      </div>
    </div>
    <div class="pagination-container"></div>
  </main>

  <script src="<?= base_url('assets/js/pembelian.js'); ?>"></script>

