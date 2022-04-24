

  <main>
    <div class="css-sj1k2s">
      <div class="css-wrap12" style="opacity: 0;">
        <div class="select-container">
          <div class="select-selected">
            <input type="text" value="Semua" readonly>
            <i class="fas fa-caret-down"></i>
          </div>
          <div class="control-select-option">
            <ul class="">
              <li class="active">Semua</li>
              <li>Bulan Ini</li>
              <li>Per Periode</li>
          </ul>
          </div>
        </div>
        <form class="css-transaction">
          <input type="text" placeholder="Tanggal Awal">
          <input type="text" placeholder="Tanggal Akhir">
          <button>Tampilkan</button>
        </form>
      </div>
      <button class="css-addprd delete" style="width: 150px;">
        <i class="fas fa-trash-alt"></i>
        Hapus Semua
      </button>
    </div>
    <div class="css-cons1s">
      <div class="css-headxs">
        <h3>Histori Aktifitas</h3>
        <table border="0" class="tbl-4c">
          <thead>
            <tr>
              <th>No</th>
              <th>Pesan</th>
              <th>Tanggal</th>
              <th>Aksi</th>
            </tr>
          </thead>
        </table>
      </div>
    </div>
    <div class="pagination-container"></div>
  </main>

  <script src="<?= base_url('assets/js/logs.js'); ?>"></script>