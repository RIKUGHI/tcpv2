<?php
  defined('BASEPATH') OR exit('No direct script access allowed');

  class ServiceModel extends CI_Model{

    public function getData($table,$nama,$strt,$limit){
      if ($table == 'barang') {
        return $this->db->query("SELECT * FROM $table WHERE nama LIKE '%$nama%' OR barcode LIKE '%$nama%' OR kategori LIKE '%$nama%' ORDER BY nama ASC LIMIT $strt,$limit")->result_array();
      } else if ($table == 'satuan' || $table == 'kategori' || $table == 'supplier') {
        return $this->db->query("SELECT * FROM $table WHERE nama LIKE '%$nama%' ORDER BY nama ASC LIMIT $strt,$limit")->result_array();
      } elseif ($table == 'pembelian') {
        if ((isset($_GET['jenis']) && $_GET['jenis'] == 'perperiode') && (isset($_GET['start']) && isset($_GET['end']))) {
          $start = $this->input->get('start');
          $end = $this->input->get('end');
          return $this->db->query("SELECT * FROM $table WHERE tanggal BETWEEN '$start' AND '$end' ORDER BY tanggal ASC LIMIT $strt,$limit")->result_array();
        } else {
          return $this->db->query("SELECT * FROM $table WHERE supplier LIKE '%$nama%' ORDER BY tanggal DESC LIMIT $strt,$limit")->result_array();
        }
      } elseif ($table == 'keranjang') {
        return $this->db->query("SELECT * FROM $table k, barang b WHERE k.nama LIKE '%$nama%' AND k.id_barang = b.id_barang ORDER BY k.nama ASC")->result_array();
      } elseif ($table == 'transaksi') {
        if ((isset($_GET['jenis']) && $_GET['jenis'] == 'perperiode') && (isset($_GET['start']) && isset($_GET['end']))) {
          $start = $this->input->get('start');
          $end = $this->input->get('end');
          return $this->db->query("SELECT * FROM $table WHERE tanggal BETWEEN '$start' AND '$end' ORDER BY id_transaksi ASC LIMIT $strt,$limit")->result_array();
        } else if ($this->input->get('nama') == 'hutang') {
          return $this->db->query("SELECT * FROM $table WHERE kembali < 0 ORDER BY id_transaksi DESC LIMIT $strt,$limit")->result_array();
        } elseif ($this->input->get('nama') == 'lunas') {
          return $this->db->query("SELECT * FROM $table WHERE kembali >= 0 ORDER BY id_transaksi DESC LIMIT $strt,$limit")->result_array();
        } else {
          return $this->db->query("SELECT * FROM $table WHERE invoice LIKE '%$nama%' ORDER BY id_transaksi DESC LIMIT $strt,$limit")->result_array();
        }
      } elseif ($table == 'logs') {
        return $this->db->query("SELECT * FROM $table ORDER BY id_log DESC LIMIT $strt,$limit")->result_array();
      }
    }

    public function getDataWhere($table,$data){
      return $this->db->get_where($table,$data)->result_array();
    }

    public function scan($barcode){
      return $this->db->get_where('barang',array('barcode' => $barcode));
    }

    public function getJumlahHalaman($table,$nama,$jumlahDataPerHalaman){
      if ($table == 'barang') {
        return ceil($this->db->query("SELECT * FROM $table WHERE nama LIKE '%$nama%' OR barcode LIKE '%$nama%' OR kategori LIKE '%$nama%' ORDER BY nama ASC")->num_rows() / $jumlahDataPerHalaman);
      } else if ($table == 'satuan' || $table == 'kategori' || $table == 'supplier') {
        return ceil($this->db->query("SELECT * FROM $table WHERE nama LIKE '%$nama%' ORDER BY nama ASC")->num_rows() / $jumlahDataPerHalaman);
      } elseif ($table == 'pembelian') {
        if ((isset($_GET['jenis']) && $_GET['jenis'] == 'perperiode') && (isset($_GET['start']) && isset($_GET['end']))) {
          $start = $this->input->get('start');
          $end = $this->input->get('end');
          return ceil($this->db->query("SELECT * FROM $table WHERE tanggal BETWEEN '$start' AND '$end' ORDER BY tanggal ASC")->num_rows() / $jumlahDataPerHalaman);
        } else {
          return ceil($this->db->query("SELECT * FROM $table WHERE supplier LIKE '%$nama%' ORDER BY tanggal DESC")->num_rows() / $jumlahDataPerHalaman);
        }
      } elseif ($table == 'keranjang') {
        return ceil($this->db->query("SELECT * FROM $table WHERE nama LIKE '%$nama%' ORDER BY nama ASC")->num_rows() / $jumlahDataPerHalaman);
      } elseif ($table == 'transaksi') {
        if ((isset($_GET['jenis']) && $_GET['jenis'] == 'perperiode') && (isset($_GET['start']) && isset($_GET['end']))) {
          $start = $this->input->get('start');
          $end = $this->input->get('end');
          return ceil($this->db->query("SELECT * FROM $table WHERE tanggal BETWEEN '$start' AND '$end' ORDER BY tanggal ASC")->num_rows() / $jumlahDataPerHalaman);
        } else if ($this->input->get('nama') == 'hutang') {
          return ceil($this->db->query("SELECT * FROM $table WHERE kembali < 0 ORDER BY id_transaksi DESC")->num_rows() / $jumlahDataPerHalaman);
        } elseif ($this->input->get('nama') == 'lunas') {
          return ceil($this->db->query("SELECT * FROM $table WHERE kembali >= 0 ORDER BY id_transaksi DESC")->num_rows() / $jumlahDataPerHalaman);
        } else {
          return ceil($this->db->query("SELECT * FROM $table WHERE invoice LIKE '%$nama%' ORDER BY id_transaksi DESC")->num_rows() / $jumlahDataPerHalaman);
        }
      } elseif ($table == 'logs') {
        return ceil($this->db->query("SELECT * FROM $table ORDER BY id_log DESC")->num_rows() / $jumlahDataPerHalaman);
      }
    }

    public function createData($table,$data){
      return $this->db->insert($table,$data);
    }
    
    public function updateData($table,$data,$where){
      return $this->db->update($table,$data,$where);
    }

    public function deleteData($table,$data){
      return $this->db->delete($table,$data);
    }

    function getMaxId($id,$as,$table){
      $result = $this->db->query("SELECT MAX($id) AS $as FROM $table");
      return $result->result_array()[0][$as];
    }

    function getInvoice(){
      $today = date('Y-m-d');

      $max = $this->db->query("SELECT MAX(id_transaksi) AS max_id FROM transaksi WHERE tanggal = '$today'")->result_array()[0];

      if (empty($max['max_id'])) {
        return sprintf('%07s',1);
      } else {
        $inv = $this->db->get_where('transaksi', array('id_transaksi' => $max['max_id']))->result_array()[0];
        $split = explode('/', $inv['invoice']);
        $getNo = end($split) + 1;
        return sprintf('%07s', $getNo);
      }
    }

    public function getDataBarang(){
      return $this->db->query("SELECT * FROM barang ORDER BY nama ASC")->result_array();
    }

    public function getDataTransaksi(){
      if ((isset($_GET['jenis']) && $_GET['jenis'] == 'perperiode') && (isset($_GET['start']) && isset($_GET['end']))) {
        $start = $this->input->get('start');
        $end = $this->input->get('end');
        return $this->db->query("SELECT * FROM transaksi WHERE tanggal BETWEEN '$start' AND '$end' ORDER BY id_transaksi ASC")->result_array();
      } else if ($this->input->get('nama') == 'hutang') {
        return $this->db->query("SELECT * FROM transaksi WHERE kembali < 0 ORDER BY id_transaksi DESC")->result_array();
      } elseif ($this->input->get('nama') == 'lunas') {
        return $this->db->query("SELECT * FROM transaksi WHERE kembali >= 0 ORDER BY id_transaksi DESC")->result_array();
      } else {
        $nama = $this->input->get('nama');
        return $this->db->query("SELECT * FROM transaksi WHERE invoice LIKE '%$nama%' ORDER BY id_transaksi DESC")->result_array();
      }
    }

    public function getTotalBarangOrStock($mmethod,$as){
      return $this->db->query("SELECT $mmethod AS $as FROM barang")->result_array()[0][$as];
    }

    public function getTop10Barang($m){
      return $this->db->query("SELECT SUM(dt.jumlah) AS total,dt.id_barang,dt.nama FROM detail_transaksi dt, transaksi t WHERE dt.invoice = t.invoice AND t.tanggal LIKE '%$m%' GROUP BY dt.id_barang ORDER BY total DESC LIMIT 0,10")->result_array();
    }

    public function getTransaction7Days(){
      return $this->db->query("SELECT COUNT(*) AS total,tanggal FROM transaksi GROUP BY tanggal ORDER BY tanggal DESC LIMIT 0,7")->result_array();
    }

    public function getTransactionByMonth($m){
      return $this->db->query("SELECT COUNT(*) AS total,tanggal FROM transaksi WHERE tanggal LIKE '%$m%' GROUP BY tanggal ORDER BY tanggal ASC")->result_array();
    }

    public function getTransactionByYear($thn){
      return $this->db->query("SELECT COUNT(*) AS total,tanggal,bulan FROM transaksi WHERE tanggal LIKE '%$thn%' GROUP BY bulan ORDER BY bulan ASC")->result_array();
    }

    public function deleteAllDataFromTable($table){
      $this->db->empty_table($table);
    }

    public function query($query){
      return $this->db->query($query)->result_array();
    }
  } 
?>