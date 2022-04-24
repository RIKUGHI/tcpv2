

  <main class="documentation">
    <h2>Dashboard</h2>
    <div class="css-dashboard">
      <div class="css-hdcnt">
        <div class="hdcnt-card">
          <div class="content">
            <h2>-</h2>
            <div class="icon">
              <i class="fas fa-cubes"></i>
            </div>
          </div>
          <label>Total Barang</label>
        </div>
      </div>
      <div class="css-grcnt">
        <div class="grf-card" id="top-10-barang">
          <h3>-</h3>
          <canvas></canvas>
        </div>
        <div class="grf-card" id="transaksi-7-hari">
          <h3>-</h3>
          <canvas></canvas>
        </div>
        <div class="grf-card" id="transaksi-bulan">
          <h3>-</h3>
          <canvas></canvas>
        </div>
        <div class="grf-card" id="transaksi-tahun">
          <h3>Grafik Transaksi Tahun 2021</h3>
          <canvas></canvas>
        </div>
      </div>
    </div>
  </main>

  <script src="<?= base_url('assets/js/dashboard.js'); ?>"></script>