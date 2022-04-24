

  <div class="navigation">
    <img src="<?= base_url('assets/images/logo/logo.png'); ?>">
    <ul class="menu">
      <li class="list">
        <a href="<?= base_url('kasir'); ?>">
          <span class="icon">
            <i class="fas fa-cash-register"></i>
          </span>
          <span class="title">Kasir</span>
        </a>
      </li>
      <li class="list">
        <a href="<?= base_url('dashboard'); ?>">
          <span class="icon">
            <i class="fas fa-desktop"></i>
          </span>
          <span class="title">Dashboard</span>
        </a>
      </li>
      <li class="list">
        <a href="<?= base_url('master'); ?>">
          <span class="icon">
            <i class="fas fa-crown"></i>
          </span>
          <span class="title">Master</span>
          <button class="fas fa-caret-down"></button>
        </a>
        <ul class="sub-nav">
          <li>
            <a href="<?= base_url('master/barang'); ?>">
              <span class="icon">
                <i class="fas fa-box-open"></i>
              </span>
              <span class="title">Barang</span>
            </a>
          </li>
          <li>
            <a href="<?= base_url('master/satuan'); ?>"">
              <span class="icon">
                <i class="fas fa-puzzle-piece"></i>
              </span>
              <span class="title">Satuan</span>
            </a>
          </li>
          <li>
            <a href="<?= base_url('master/kategori'); ?>"">
              <span class="icon">
                <i class="far fa-object-group"></i>
              </span>
              <span class="title">Kategori</span>
            </a>
          </li>
          <li>
            <a href="<?= base_url('master/supplier'); ?>"">
              <span class="icon">
                <i class="fas fa-luggage-cart"></i>
              </span>
              <span class="title">Supplier</span>
            </a>
          </li>
        </ul>
      </li>
      <li class="list">
        <a href="<?= base_url('transaksi'); ?>">
          <span class="icon">
            <i class="fas fa-file-invoice-dollar"></i>
          </span>
          <span class="title">Transaksi</span>
          <button class="fas fa-caret-down"></button>
        </a>
        <ul class="sub-nav">
          <li>
            <a href="<?= base_url('transaksi/penjualan'); ?>">
              <span class="icon">
                <i class="fas fa-cart-arrow-down"></i>
              </span>
              <span class="title">Penjualan</span>
            </a>
          </li>
          <li>
            <a href="<?= base_url('transaksi/pembelian'); ?>">
              <span class="icon">
                <i class="fas fa-cart-plus"></i>
              </span>
              <span class="title">Pembelian</span>
            </a>
          </li>
        </ul>
      </li>
      <li class="list">
        <a href="<?= base_url('dokumentasi'); ?>">
          <span class="icon">
            <i class="fas fa-book"></i>
          </span>
          <span class="title">Dokumentasi</span>
        </a>
      </li>
      <li class="list">
        <a href="<?= base_url('logs'); ?>">
          <span class="icon">
            <i class="fas fa-history"></i>
          </span>
          <span class="title">Logs</span>
        </a>
      </li>
      <li class="list" id="set">
        <a href="<?= base_url('pengaturan'); ?>">
          <span class="icon">
            <i class="fas fa-cog"></i>
          </span>
          <span class="title">Pengaturan</span>
        </a>
      </li>
    </ul>
  </div>
  
  <div class="closed"></div>