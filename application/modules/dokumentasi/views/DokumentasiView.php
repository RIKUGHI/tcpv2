

  <main class="documentation">
    <h2>Dokumentasi</h2>
    <div class="css-doc">
      <div class="css-qstn">
        <div class="card" id="pertanyaan">
          <i class="far fa-question-circle"></i>
          <div class="wrapper">
            <h3>Pertanyaan Umum</h3>
            <span>Pengenalan Aplikasi</span>
          </div>
        </div>
        <div class="card" id="tentang">
          <i class="far fa-file-code"></i>
          <div class="wrapper">
            <h3>Tetang</h3>
            <span>Tetang Aplikasi</span>
          </div>
        </div>
      </div>
      <div class="css-rslt">
        <div class="card">
          <div class="head">
            <i class="far fa-play-circle"></i>
            <div class="wrapper">
              <h3>Cara Menjalankan Aplikasi</h3>
            </div>
            <button class="fas fa-angle-down"></button>
          </div>
          <div class="content">
            <ul>
              <li>
                <label>1. Buka aplikasi XAMPP</label>
                <img src="<?= base_url('assets/images/dokumentasi/run app/1.png'); ?>">
                <img src="<?= base_url('assets/images/dokumentasi/run app/2.png'); ?>">
              </li>
              <li>
                <label>2. Kemudian tekan tombol start pada Apache dan MySQL</label>
                <img src="<?= base_url('assets/images/dokumentasi/run app/3.png'); ?>">
              </li>
              <li>
                <label>3. Lalu buka browser copykan alamat http://localhost/tcpv2/ atau dengan klik <a href="http://localhost/tcpv2/">disini</a></label>
                <img src="<?= base_url('assets/images/dokumentasi/run app/4.png'); ?>">
              </li>
            </ul>
          </div>
        </div>
        <div class="card">
          <div class="head">
            <i class="fas fa-cash-register"></i>
            <div class="wrapper">
              <h3>Cara Melakukan Transaksi</h3>
            </div>
            <button class="fas fa-angle-down"></button>
          </div>
          <div class="content">
            <ul>
              <li>
                <label>1. Buka menu kasir atau <a href="http://localhost/tcpv2/kasir">disini</a></label>
                <img src="<?= base_url('assets/images/dokumentasi/how to transaction/1.png'); ?>">
              </li>
              <li>
                <label>2. Sorot salah satu barang, lalu klik tombol keranjang, kemudian pilih harga dan masukan jumlah pembelian, jika sudah klik tambah</label>
                <img src="<?= base_url('assets/images/dokumentasi/how to transaction/2.png'); ?>">
                <img src="<?= base_url('assets/images/dokumentasi/how to transaction/3.png'); ?>">
              </li>
              <li>
                <label>3. Otomatis barang masuk ke keranjang</label>
                <img src="<?= base_url('assets/images/dokumentasi/how to transaction/4.png'); ?>">
              </li>
              <li>
                <label>4. Klik tombol pilih pembeli, lalu pilih pembeli</label>
                <img src="<?= base_url('assets/images/dokumentasi/how to transaction/5.png'); ?>">
              </li>
              <li>
                <label>5. Masukan uang pembayaran, jika sudah klik tombol simpan transaksi</label>
                <img src="<?= base_url('assets/images/dokumentasi/how to transaction/6.png'); ?>">
              </li>
              <li>
                <label>6. Jika transaksi berhasil akan muncul seperti gambar dibawah</label>
                <img src="<?= base_url('assets/images/dokumentasi/how to transaction/7.png'); ?>">
              </li>
              <li>
                <label>7. Cetak struk</label>
                <img src="<?= base_url('assets/images/dokumentasi/how to transaction/8.png'); ?>">
              </li>
            </ul>
          </div>
        </div>
        <div class="card">
          <div class="head">
            <i class="fas fa-plus"></i>
            <div class="wrapper">
              <h3>Cara Menambah Data Barang</h3>
              <span>Berlaku sama pada fitur satuan, kategori, supplier, dan pelanggan</span>
            </div>
            <button class="fas fa-angle-down"></button>
          </div>
          <div class="content">
            <ul>
              <li>
                <label>1. Pilih menu barang atau <a href="http://localhost/tcpv2/master/barang">disini</a></label>
                <img src="<?= base_url('assets/images/dokumentasi/insert barang/1.png'); ?>">
              </li>
              <li>
                <label>2. Klik tombol tambah barang dipokok kanan atas dan masukan data</label>
                <img src="<?= base_url('assets/images/dokumentasi/insert barang/2.png'); ?>">
              </li>
              <li>
                <label>3. Jika di simpan dan berhasil akan muncul notifikasi seperti dibawah</label>
                <img src="<?= base_url('assets/images/dokumentasi/insert barang/3.png'); ?>">
              </li>
            </ul>
          </div>
        </div>
        <div class="card">
          <div class="head">
            <i class="fas fa-pen"></i>
            <div class="wrapper">
              <h3>Cara Mengubah Data Barang</h3>
              <span>Berlaku sama pada fitur satuan, kategori, supplier, dan pelanggan</span>
            </div>
            <button class="fas fa-angle-down"></button>
          </div>
          <div class="content">
            <ul>
              <li>
                <label>1. Sorot salah satu data barang yang ingin diubah, lalu klik tombol pensil</label>
                <img src="<?= base_url('assets/images/dokumentasi/update barang/1.png'); ?>">
              </li>
              <li>
                <label>2. Ubah beberapa data yang diperlukan</label>
                <img src="<?= base_url('assets/images/dokumentasi/update barang/2.png'); ?>">
              </li>
              <li>
                <label>3. Jika disimpan dan berhasil akan muncul notifikasi seperti gambar dibawah</label>
                <img src="<?= base_url('assets/images/dokumentasi/update barang/3.png'); ?>">
              </li>
            </ul>
          </div>
        </div>
        <div class="card">
          <div class="head">
            <i class="fas fa-trash-alt"></i>
            <div class="wrapper">
              <h3>Cara Menghapus Data Barang</h3>
              <span>Berlaku sama pada fitur satuan, kategori, supplier, pelanggan, dan pembelian</span>
            </div>
            <button class="fas fa-angle-down"></button>
          </div>
          <div class="content">
            <ul>
              <li>
                <label>1. Sorot salah satu barang yang ingin dihapus</label>
                <img src="<?= base_url('assets/images/dokumentasi/delete barang/1.png'); ?>">
              </li>
              <li>
                <label>2. Konfirmasi</label>
                <img src="<?= base_url('assets/images/dokumentasi/delete barang/2.png'); ?>">
              </li>
              <li>
                <label>3. Jika memilih "iya" akan muncul notifikasi seperti gambar dibawah</label>
                <img src="<?= base_url('assets/images/dokumentasi/delete barang/3.png'); ?>">
              </li>
            </ul>
          </div>
        </div>
        <div class="card">
          <div class="head">
            <i class="fas fa-hand-holding-usd"></i>
            <div class="wrapper">
              <h3>Cara Melakukan Pembayaran Hutang</h3>
            </div>
            <button class="fas fa-angle-down"></button>
          </div>
          <div class="content">
            <ul>
              <li>
                <label>1. Masuk ke menu penjualan atau klik <a href="<?= base_url('transaksi/penjualan'); ?>">disini</a></label>
                <img src="<?= base_url('assets/images/dokumentasi/hutang/1.png'); ?>">
              </li>
              <li>
                <label>2. Sorot salah satu transaksi yang berstatus hutang, setelah disorot status hutang akan berubah menjadi bayar, lalu klik bayar</label>
                <img src="<?= base_url('assets/images/dokumentasi/hutang/2.png'); ?>">
              </li>
              <li>
                <label>3. Akan muncul tampilan seperti gambar dibawah, lalu masukan uang pembayaran di bagian bayar hutang</label>
                <img src="<?= base_url('assets/images/dokumentasi/hutang/3.png'); ?>">
              </li>
              <li>
                <label>4. Jika sudah tekan tombol bayar dan akan muncul notifikasi seperti gambar di bawah</label>
                <img src="<?= base_url('assets/images/dokumentasi/hutang/4.png'); ?>">
              </li>
            </ul>
          </div>
        </div>
        <div class="card">
          <div class="head">
            <i class="fas fa-cart-plus"></i>
            <div class="wrapper">
              <h3>Cara Menambah Pembelian</h3>
            </div>
            <button class="fas fa-angle-down"></button>
          </div>
          <div class="content">
            <ul>
              <li>
                <label>1. Masuk ke menu pembelian atau klik <a href="<?= base_url('transaksi/pembelian'); ?>">disini</a></label>
                <img src="<?= base_url('assets/images/dokumentasi/insert pembelian/1.png'); ?>">
              </li>
              <li>
                <label>2. Tekan tombol tambah pembelian yang berada di pojok kanan atas, kemudian tekan browse file to upload, lalu masukan foto bukti transaksi</label>
                <img src="<?= base_url('assets/images/dokumentasi/insert pembelian/2.png'); ?>">
              </li>
              <li>
                <label>3. Pilih supplier atau buat supplier baru dari transaksi pembelian</label>
                <img src="<?= base_url('assets/images/dokumentasi/insert pembelian/3.png'); ?>">
              </li>
              <li>
                <label>4. Masukan tanggal dan catatan jika ada</label>
                <img src="<?= base_url('assets/images/dokumentasi/insert pembelian/4.png'); ?>">
              </li>
              <li>
                <label>5. Setelah itu simpan dan akan muncul notifikasi seperti berikut</label>
                <img src="<?= base_url('assets/images/dokumentasi/insert pembelian/5.png'); ?>">
              </li>
            </ul>
          </div>
        </div>
        <div class="card">
          <div class="head">
            <i class="fas fa-pen"></i>
            <div class="wrapper">
              <h3>Cara Mengubah Pembelian</h3>
            </div>
            <button class="fas fa-angle-down"></button>
          </div>
          <div class="content">
            <ul>
              <li>
                <label>1. Sorot salah satu transaksi dari supplier tertentu, lalu klik tombol berlogo pen</label>
                <img src="<?= base_url('assets/images/dokumentasi/update pembelian/1.png'); ?>">
              </li>
              <li>
                <label>2. Tambahkan foto baru jika ada atau bisa menghapus foto, lalu ubah beberapa data yang diperlukan, lalu simpan</label>
                <img src="<?= base_url('assets/images/dokumentasi/update pembelian/2.png'); ?>">
              </li>
              <li>
                <label>3. Jika berhasil akan muncul notifikasi seperti berikut</label>
                <img src="<?= base_url('assets/images/dokumentasi/update pembelian/3.png'); ?>">
              </li>
            </ul>
          </div>
        </div>
        <div class="card">
          <div class="head">
          <i class="fas fa-dollar-sign"></i>
            <div class="wrapper">
              <h3>Cara Merubah Paksa Harga Tanpa Ke Menu Barang</h3>
            </div>
            <button class="fas fa-angle-down"></button>
          </div>
          <div class="content">
            <ul>
              <li>
                <label>1. Sorot salah satu barang yang ada di keranjang</label>
                <img src="<?= base_url('assets/images/dokumentasi/force change price/1.png'); ?>">
              </li>
              <li>
                <label>2. Kemudian klik 2 kali pada bagian harga, jika muncul warna biru muda di sekitar harga berarti mode paksa ubah harga aktif</label>
                <img src="<?= base_url('assets/images/dokumentasi/force change price/2.png'); ?>">
              </li>
              <li>
                <label>3. Lalu ubah harga sesuai kebutuhan</label>
                <img src="<?= base_url('assets/images/dokumentasi/force change price/3.png'); ?>">
              </li>
              <li>
                <label>4. Kemudian tekan enter atau klik 2 kali lagi pada bagian harga untuk menonaktifkan mode paksa ubah harga</label>
                <img src="<?= base_url('assets/images/dokumentasi/force change price/4.png'); ?>">
              </li>
            </ul>
          </div>
        </div>
        <!-- Tentang -->
        <img src="<?= base_url('assets/images/favicomatic/mstile-310x310.png'); ?>" class="tcpv2-logo none">
        <div class="card none">
          <div class="head">
          <i class="fas fa-cash-register"></i>
            <div class="wrapper">
              <h3>TCP</h3>
              <span>Basic Features - Release Date</span>
            </div>
            <button class="fas fa-angle-down"></button>
          </div>
          <div class="content">
            <ul>
              <li>
                <label>1. Halaman Depan</label>
                <img src="<?= base_url('assets/images/dokumentasi/tcp/1.png'); ?>">
              </li>
              <li>
                <label>2. Kasir</label>
                <img src="<?= base_url('assets/images/dokumentasi/tcp/2.png'); ?>">
              </li>
              <li>
                <label>3. Dashboard</label>
                <img src="<?= base_url('assets/images/dokumentasi/tcp/3.png'); ?>">
              </li>
              <li>
                <label>4. Data Barang</label>
                <img src="<?= base_url('assets/images/dokumentasi/tcp/4.png'); ?>">
              </li>
              <li>
                <label>5. Modal Box Tambah Barang</label>
                <img src="<?= base_url('assets/images/dokumentasi/tcp/5.png'); ?>">
              </li>
              <li>
                <label>6. Delete</label>
                <img src="<?= base_url('assets/images/dokumentasi/tcp/6.png'); ?>">
              </li>
              <li>
                <label>7. Kategori</label>
                <img src="<?= base_url('assets/images/dokumentasi/tcp/7.png'); ?>">
              </li>
              <li>
                <label>8. Penjualan</label>
                <img src="<?= base_url('assets/images/dokumentasi/tcp/8.png'); ?>">
              </li>
              <li>
                <label>9. Grafik Penjualan</label>
                <img src="<?= base_url('assets/images/dokumentasi/tcp/9.png'); ?>">
              </li>
              <li>
                <label>10. Transaksi</label>
                <img src="<?= base_url('assets/images/dokumentasi/tcp/10.png'); ?>">
              </li>
              <li>
                <label>11. Stock < 5</label>
                <img src="<?= base_url('assets/images/dokumentasi/tcp/11.png'); ?>">
              </li>
            </ul>
          </div>
        </div>
        <div class="card none">
          <div class="head">
          <i class="fas fa-cash-register"></i>
            <div class="wrapper">
              <h3>TCPV2</h3>
              <span>More Simple, More Interactive, New UI - Release Date 03/08/2021</span>
            </div>
            <button class="fas fa-angle-down"></button>
          </div>
          <div class="content">
            <ul>
              <li>
                <label>1. Halaman Depan/Kasir</label>
                <img src="<?= base_url('assets/images/dokumentasi/tcpv2/1.png'); ?>">
              </li>
              <li>
                <label>2. Dashboard</label>
                <img src="<?= base_url('assets/images/dokumentasi/tcpv2/2.png'); ?>">
              </li>
              <li>
                <label>3. Master - Barang</label>
                <img src="<?= base_url('assets/images/dokumentasi/tcpv2/3.png'); ?>">
              </li>
              <li>
                <label>4. Modal Box Tambah Barang</label>
                <img src="<?= base_url('assets/images/dokumentasi/tcpv2/4.png'); ?>">
              </li>
              <li>
                <label>5. Sub Modal Box</label>
                <img src="<?= base_url('assets/images/dokumentasi/tcpv2/5.png'); ?>">
              </li>
              <li>
                <label>6. Detail</label>
                <img src="<?= base_url('assets/images/dokumentasi/tcpv2/6.png'); ?>">
              </li>
              <li>
                <label>7. Konfirmasi Hapus</label>
                <img src="<?= base_url('assets/images/dokumentasi/tcpv2/7.png'); ?>">
              </li>
              <li>
                <label>8. Satuan</label>
                <img src="<?= base_url('assets/images/dokumentasi/tcpv2/8.png'); ?>">
              </li>
              <li>
                <label>9. Kategori</label>
                <img src="<?= base_url('assets/images/dokumentasi/tcpv2/9.png'); ?>">
              </li>
              <li>
                <label>10. Supplier</label>
                <img src="<?= base_url('assets/images/dokumentasi/tcpv2/10.png'); ?>">
              </li>
              <li>
                <label>11. Pelanggan</label>
                <img src="<?= base_url('assets/images/dokumentasi/tcpv2/11.png'); ?>">
              </li>
              <li>
                <label>12. Transaksi - Penjualan</label>
                <img src="<?= base_url('assets/images/dokumentasi/tcpv2/12.png'); ?>">
              </li>
              <li>
                <label>13. Modal Box Bayar Hutang</label>
                <img src="<?= base_url('assets/images/dokumentasi/tcpv2/13.png'); ?>">
              </li>
              <li>
                <label>14. Detail Transaksi</label>
                <img src="<?= base_url('assets/images/dokumentasi/tcpv2/14.png'); ?>">
              </li>
              <li>
                <label>15. Modal Box Tambah Pembelian</label>
                <img src="<?= base_url('assets/images/dokumentasi/tcpv2/15.png'); ?>">
              </li>
              <li>
                <label>16. Detail Pembelian</label>
                <img src="<?= base_url('assets/images/dokumentasi/tcpv2/16.png'); ?>">
              </li>
              <li>
                <label>17. Modal Box Ubah Pembelian</label>
                <img src="<?= base_url('assets/images/dokumentasi/tcpv2/17.png'); ?>">
              </li>
              <li>
                <label>18. Dokumentasi</label>
                <img src="<?= base_url('assets/images/dokumentasi/tcpv2/18.png'); ?>">
              </li>
              <li>
                <label>19. Logs/Histori</label>
                <img src="<?= base_url('assets/images/dokumentasi/tcpv2/19.png'); ?>">
              </li>
              <li>
                <label>20. Pengaturan</label>
                <img src="<?= base_url('assets/images/dokumentasi/tcpv2/20.png'); ?>">
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </main>

  <script src="<?= base_url('assets/js/dokumentasi.js'); ?>"></script>