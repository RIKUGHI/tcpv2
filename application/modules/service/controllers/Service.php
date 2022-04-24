<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require('./application/libraries/excel/vendor/autoload.php');
use PhpOffice\PhpSpreadsheet\Helper\Sample;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;

class Service extends CI_Controller {

	/**
	 * Index Page for this controller.
	 *
	 * Maps to the following URL
	 * 		http://example.com/index.php/welcome
	 *	- or -
	 * 		http://example.com/index.php/welcome/index
	 *	- or -
	 * Since this controller is set as the default controller in
	 * config/routes.php, it's displayed at http://example.com/
	 *
	 * So any other public methods not prefixed with an underscore will
	 * map to /index.php/welcome/<method_name>
	 * @see https://codeigniter.com/user_guide/general/urls.html
	 */


	function __construct(){
		parent::__construct();
		$this->load->model('ServiceModel');
		date_default_timezone_set("Asia/Jakarta");
		// setcookie('mode',$_COOKIE['mode'],time() + (60 * 60 * 24 * 30));
	}
		

	public function index(){
		echo date('Y-m-d - H:i:s');
	}

	public function getmode(){
		echo json_encode(array(
			'mode' => $_COOKIE['mode']
		));
	}

	public function setmode(){
		setcookie('mode',$this->input->post('mode'),time() + (60 * 60 * 24 * 30));
		echo json_encode(array(
			'status' => 'changed'
		));
	}

	public function getsingledata(){
		if ($_SERVER['REQUEST_METHOD'] == 'GET') {
			switch ($this->input->get('data')) {
				case 'barang':
					$field = 'id_barang';
					break;
				case 'satuan':
					$field = 'id_satuan';
					break;
				case 'kategori':
					$field = 'id_kategori';
					break;
				case 'supplier':
					$field = 'id_supplier';
					break;
				case 'pembelian':
					$field = 'id_pembelian';
					break;
				case 'transaksi':
					$field = 'invoice';
					break;
				default:
					echo 'kosong';
					break;
			}

			if ($this->input->get('data') == 'pembelian') {
				$res = array();
				foreach ($this->ServiceModel->getDataWhere($this->input->get('data'),array($field => $this->input->get('id'))) as $key => $value) {
					array_push($res,array(
						'id_pembelian' => $value['id_pembelian'],
						'supplier' => $value['supplier'],
						'tanggal' => $value['tanggal'],
						'catatan' => $value['catatan'],
						'foto' => $this->getfoto($value['id_pembelian'])
					));
				}

				echo json_encode(array(
					'idRequest' => $this->input->get('id'),
					'result' => $res
				));
			} elseif ($this->input->get('data') == 'transaksi') {
				$resT = array();
				foreach ($this->ServiceModel->getDataWhere($this->input->get('data'),array($field => $this->input->get('id'))) as $key => $value) {
					array_push($resT,array(
						'id_transaksi' => $value['id_transaksi'],
						'invoice' => $value['invoice'],
						'tanggal' => $value['tanggal'],
						'waktu' => $value['waktu'],
						'total' => $value['total'],
						'bayar' => $value['bayar'],
						'kembali' => $value['kembali'],
						'detail_transaksi' => $this->getdetailtransaksi($value['invoice']),
						'histori_hutang' => $this->ServiceModel->getDataWhere('logs_hutang',array($field => $this->input->get('id')))
					));
				}

				echo json_encode(array(
					'idRequest' => $this->input->get('id'),
					'result' => $resT
				));
			} else {
				echo json_encode(array(
					'idRequest' => $this->input->get('id'),
					'result' => $this->ServiceModel->getDataWhere($this->input->get('data'),array($field => $this->input->get('id')))
				));
			}
			
		} else {
			echo json_encode(array(
				'status' => false,
				'message' => 'Bad request'
			));
		}
		
	}

	public function getdata(){
		if ($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET['data']) && $this->input->get('data') != '') {
			$jumlahDataPerHalaman = 50;

			if (isset($_GET['nama']) && !isset($_GET['page'])) {
				$nama = $this->input->get('nama');
				$awalData = 0;
				$halamanAktif = 1;
			} else if (isset($_GET['nama']) && isset($_GET['page'])) {
				$nama = $this->input->get('nama');
				$halamanAktif = $_GET['page'] <= 0 ? 1: $_GET['page'];
				$awalData = ($jumlahDataPerHalaman * $halamanAktif) - $jumlahDataPerHalaman;
			} else {
				$nama = '';
				$halamanAktif = isset($_GET['page']) ? $_GET['page'] <= 0 ? 1 : $_GET['page'] : 1;
				$awalData = ($jumlahDataPerHalaman * $halamanAktif) - $jumlahDataPerHalaman;
			}

			if ($this->input->get('data') == 'pembelian') {
				$res = array();
				foreach ($this->ServiceModel->getData($this->input->get('data'),$nama,$awalData,$jumlahDataPerHalaman) as $key => $value) {
					array_push($res,array(
						'id_pembelian' => $value['id_pembelian'],
						'supplier' => $value['supplier'],
						'tanggal' => $value['tanggal'],
						'catatan' => $value['catatan'],
						'foto' => $this->getfoto($value['id_pembelian'])
					));
				}

				echo json_encode(array(
					'data' => $this->input->get('data'),
					'namaPencarian' => $nama == '' ? $this->input->get('jenis') == 'perperiode' && isset($_GET['start']) && isset($_GET['end']) ? $_GET['start'].' s.d. '.$_GET['end'] : 'Semua' : $nama,
					'jenis' => $this->input->get('jenis') == 'perperiode' && isset($_GET['start']) && isset($_GET['end']) ? 'perperiode' : 'Semua',
					'awalData' => $awalData,
					'halamanAktif' => (int) $halamanAktif,
					'jumlahHalaman' => $this->ServiceModel->getJumlahHalaman($this->input->get('data'),$nama,$jumlahDataPerHalaman),
					'products' => $res
				));
			} elseif ($this->input->get('data') == 'transaksi') {
				echo json_encode(array(
					'data' => $this->input->get('data'),
					'namaPencarian' => $nama == '' ? $this->input->get('jenis') == 'perperiode' && isset($_GET['start']) && isset($_GET['end']) ? $_GET['start'].' s.d. '.$_GET['end'] : 'Semua' : $nama,
					'jenis' => $this->input->get('jenis') == 'perperiode' && isset($_GET['start']) && isset($_GET['end']) ? 'perperiode' : 'Semua',
					'awalData' => $awalData,
					'halamanAktif' => (int) $halamanAktif,
					'jumlahHalaman' => $this->ServiceModel->getJumlahHalaman($this->input->get('data'),$nama,$jumlahDataPerHalaman),
					'products' => $this->ServiceModel->getData($this->input->get('data'),$nama,$awalData,$jumlahDataPerHalaman)
				));
			} else {
				echo json_encode(array(
					'data' => $this->input->get('data'),
					'namaPencarian' => $nama == '' ? 'Semua' : $nama,
					'awalData' => $awalData,
					'halamanAktif' => (int) $halamanAktif,
					'jumlahHalaman' => $this->ServiceModel->getJumlahHalaman($this->input->get('data'),$nama,$jumlahDataPerHalaman),
					'products' => $this->ServiceModel->getData($this->input->get('data'),$nama,$awalData,$jumlahDataPerHalaman)
				));
			}
			
		} else {
			echo json_encode(array(
				'status' => false,
				'message' => 'Bad request'
			));
		}
	} 

	public function getdatadashboard(){
		$year = date('Y');
		$month = date('Y-m');

		echo json_encode(array(
			'totalBarang' => (int) $this->ServiceModel->getTotalBarangOrStock('COUNT(*)','tb'),
			'top10Barang' => array(
				'bulan' => $month,
				'results' => $this->ServiceModel->getTop10Barang($month),
			),
			'transaksi7hari' => $this->ServiceModel->getTransaction7Days(),
			'transaksiBulan' => array(
				'bulan' => $month,
				'results' => $this->ServiceModel->getTransactionByMonth($month)
			),
			'transaksiTahun' => array(
				'tahun' => $year,
				'results' => $this->ServiceModel->getTransactionByYear($year)
			)
		));
	}

	public function adddata(){
		if ($_SERVER['REQUEST_METHOD'] == 'POST') {
			if ($this->input->post('data') == 'barang') {
				$table = $this->input->post('data');
				$data['nama'] = $this->input->post('nama');
				$data['barcode'] = $this->input->post('barcode');
				$data['hargap'] = $this->input->post('hargap');
				$data['satuan'] = $this->input->post('satuan');
				$data['kategori'] = $this->input->post('kategori');
				$data['hargag'] = $this->input->post('hargag');
				$data['hargae'] = $this->input->post('hargae');

				$checkAvailableData = $this->ServiceModel->getDataWhere($table,array(
					'nama' => $this->input->post('nama'),
					'barcode' => $this->input->post('barcode'),
					'satuan' => $this->input->post('satuan'))
				);

				// buat satuan baru jika kosong
				if (empty($this->ServiceModel->getDataWhere('satuan',array('nama' => $data['satuan'])))) {
					$this->ServiceModel->createData('satuan',array('nama' => $data['satuan']));
				}

				// buat kategori baru jika kosong
				if (empty($this->ServiceModel->getDataWhere('kategori',array('nama' => $data['kategori'])))) {
					$this->ServiceModel->createData('kategori',array('nama' => $data['kategori']));
				}
		
				// buat data barang
				if (empty($checkAvailableData)) {
					if ($this->ServiceModel->createData($table,$data)) {
						echo $this->simplemessage(true,'success','Barang berhasil ditambahkan');
					} else {
						echo $this->simplemessage(false,'error','Barang gagal ditambahkan');
					}
				} else {
					echo json_encode(array(
						'status' => false,
						'class' => 'error',
						'message' => 'Barang dengan nama <strong>'.$this->input->post('nama').'</strong>, 
													barcode <strong>'.$this->input->post('barcode').'</strong>, dan 
													satuan <strong>'.$this->input->post('satuan').'</strong> sudah tersedia'
					));
				}
			} elseif ($this->input->post('data') == 'satuan') {
				$table = $this->input->post('data');
				$data['nama'] = $this->input->post('nama');
				
				$checkAvailableSatuan = $this->ServiceModel->getDataWhere($table,array('nama' => $this->input->post('nama')));

				// buat data satuan
				if (empty($checkAvailableSatuan)) {
					if ($this->ServiceModel->createData($table,$data)) {
						echo $this->simplemessage(true,'success','Satuan berhasil ditambahkan');
					} else {
						echo $this->simplemessage(false,'error','Satuan gagal ditambahkan');
					}
				} else {
					echo json_encode(array(
						'status' => false,
						'class' => 'error',
						'message' => 'Satuan dengan nama <strong>'.$this->input->post('nama').'</strong> sudah tersedia'
					));
				}
			} elseif ($this->input->post('data') == 'kategori') {
				$table = $this->input->post('data');
				$data['nama'] = $this->input->post('nama');
				
				$checkAvailableSatuan = $this->ServiceModel->getDataWhere($table,array('nama' => $this->input->post('nama')));

				// buat data kategori
				if (empty($checkAvailableSatuan)) {
					if ($this->ServiceModel->createData($table,$data)) {
						echo $this->simplemessage(true,'success','Kategori berhasil ditambahkan');
					} else {
						echo $this->simplemessage(false,'error','Kategori gagal ditambahkan');
					}
				} else {
					echo json_encode(array(
						'status' => false,
						'class' => 'error',
						'message' => 'Kategori dengan nama <strong>'.$this->input->post('nama').'</strong> sudah tersedia'
					));
				}
			} elseif ($this->input->post('data') == 'supplier') {
				$table = $this->input->post('data');
				$data['nama'] = $this->input->post('nama');
				$data['kota'] = $this->input->post('kota');
				$data['alamat'] = $this->input->post('alamat');
				$data['notelp'] = $this->input->post('notelp');
				$data['nohp'] = $this->input->post('nohp');
				
				$checkAvailableSatuan = $this->ServiceModel->getDataWhere($table,array('nama' => $this->input->post('nama')));

				// buat data supplier
				if (empty($checkAvailableSatuan)) {
					if ($this->ServiceModel->createData($table,$data)) {
						echo $this->simplemessage(true,'success','Supplier berhasil ditambahkan');
					} else {
						echo $this->simplemessage(false,'error','Supplier gagal ditambahkan');
					}
				} else {
					echo json_encode(array(
						'status' => false,
						'class' => 'error',
						'message' => 'Supplier dengan nama <strong>'.$this->input->post('nama').'</strong> sudah tersedia'
					));
				}
			} elseif ($this->input->post('data') == 'pembelian') {
				$table = $this->input->post('data');
				$data['supplier'] = $this->input->post('supplier');
				$data['tanggal'] = $this->input->post('tanggal');
				$data['catatan'] = $this->input->post('catatan');

				// buat satuan baru jika kosong
				if (empty($this->ServiceModel->getDataWhere('supplier',array('nama' => $data['supplier'])))) {
					$this->ServiceModel->createData('supplier',array('nama' => $data['supplier']));
				}

				if ($this->ServiceModel->createData($table,$data)) {
					$msgCreateData = 'Data pembelian berhasil <strong>ditambahkan</strong>';
					$status = true;
					$class = 'success';
				} else {
					$msgCreateData = 'Data pembelian gagal <strong>ditambahkan</strong>';
					$status = false;
					$class = 'error';
				}

				$n = 1;
				$all = 1;
				foreach ($_FILES['berkas_gambar']['tmp_name'] as $key => $value) {
					$oriFileName = $_FILES['berkas_gambar']['name'][$key];
					$split = explode('.', $oriFileName);
					$finalId = $this->ServiceModel->getMaxId('id_pembelian','max_id_pembelian',$table).'_'.($this->ServiceModel->getMaxId('id_foto','max_id_foto','foto_pembelian') + 1);
					
					$dataFoto['id_pembelian'] = $this->ServiceModel->getMaxId('id_pembelian','max_id_pembelian',$table);
					$dataFoto['nama'] = $finalId.'.'.end($split);

					if ($this->ServiceModel->createData('foto_pembelian',$dataFoto)) {
						$msgCreateDataFoto = 'Foto pembelian berhasil <strong>ditambahkan</strong>';
					} else {
						$msgCreateDataFoto = 'Foto pembelian gagal <strong>ditambahkan</strong>';
					}

					$tagetPath = './assets/images/pembelian/'.$dataFoto['nama'];
					if (move_uploaded_file($value, $tagetPath)) {
						$msgMoveFile = $n++.' dari '.$all.' Foto berhasil <strong>diupload</strong>';
					} else {
						$msgMoveFile = $n++.' dari '.$all.' Foto gagal <strong>diupload</strong>';
					}
					$all++;
				}
				echo $this->simplemessage($status,$class,$msgCreateData.' <br> '.$msgCreateDataFoto.' <br> '.$msgMoveFile);
			} elseif ($this->input->post('data') == 'keranjang') {
				if (isset($_POST['scan']) && $this->input->post('scan') != null) {
					$barcode = $this->input->post('scan');
					$dBarang = $this->ServiceModel->scan($barcode);
					
					if ($dBarang->num_rows() == 0) {
						echo $this->messageforcart(false,'error',1,'','Barang belum tersedia');
						exit;
					} else {
						if ($dBarang->num_rows() == 1) {
							$data['id_barang'] = $dBarang->result_array()[0]['id_barang'];
							$data['nama'] = $dBarang->result_array()[0]['nama'];
							$data['barcode'] = $dBarang->result_array()[0]['barcode'];
							$data['satuan'] = $dBarang->result_array()[0]['satuan'];
							$data['qty'] = 1;
							$data['harga'] = $dBarang->result_array()[0]['hargae'];
						} else {
							echo $this->messageforcart(true,'success',$dBarang->num_rows(),$this->ServiceModel->getDataWhere('barang',array('barcode' => $this->input->post('scan'))),$dBarang->num_rows().' Barang tersedia, pilih salah satu');
							exit;
						}
					}
				} else {
					$data['id_barang'] = $this->input->post('id');
					$data['nama'] = $this->input->post('nama');
					$data['barcode'] = $this->input->post('barcode');
					$data['satuan'] = $this->input->post('satuan');
					$data['qty'] = $this->input->post('qty');
					$data['harga'] = $this->input->post('harga');
				}
				$table = $this->input->post('data');
				

				$dataKeranjang = $this->ServiceModel->getDataWhere($table,array('id_barang' => $data['id_barang']));

				if (empty($dataKeranjang)) {
					if ($this->ServiceModel->createData($table,$data)) {
						echo $this->messageforcart(true,'success',1,'','Barang berhasil ditambahkan ke keranjang');
					} else {
						echo $this->messageforcart(false,'error',1,'','Barang gagal ditambahkan ke keranjang');
					}
				} else {
					$data['qty'] = $data['qty'] + $dataKeranjang[0]['qty'];

					if ($this->ServiceModel->updateData($table,$data,array('id_barang' => $data['id_barang']))) {
						echo $this->messageforcart(true,'success',1,'','Barang berhasil diupdate ke keranjang');
					} else {
						echo $this->messageforcart(false,'error',1,'','Barang gagal diupdate ke keranjang');
					}
				}
			} else if ($this->input->post('data') == 'transaksi') {
				$table = $this->input->post('data');
				$data['invoice'] = 'INV/'.date('Ymd').'/TCPV2/'.$this->ServiceModel->getInvoice();
				$data['tanggal'] = date('Y-m-d');
				$data['bulan'] = date('m');
				$data['waktu'] = date('H:i:s');
				$data['total'] = $this->input->post('total');
				$data['bayar'] = $this->input->post('bayar');
				$data['kembali'] = $this->input->post('kembali');

				// buat transaksi
				if ($this->ServiceModel->createData($table,$data)) {
					$status = true;
					$class = 'success';
					$msg = 'berhasil';
				} else {
					$status = false;
					$class = 'error';
					$msg = 'gagal';
				}

				// buat detail transaksi
				$n = 0;
				foreach ($this->input->post('nama') as $key => $value) {
					$detail['invoice'] = $data['invoice'];
					$detail['id_barang'] = $this->input->post('id')[$key];
					$detail['nama'] = $value;
					$detail['barcode'] = $this->input->post('barcode')[$key];
					$detail['satuan'] = $this->input->post('satuan')[$key];
					$detail['harga'] = $this->input->post('harga')[$key];
					$detail['jumlah'] = $this->input->post('jumlah')[$key];
					$detail['subtotal'] = $this->input->post('subtotal')[$key];

					$this->ServiceModel->createData('detail_transaksi',$detail) ? $n++ : null;
				}
				$this->ServiceModel->deleteAllDataFromTable('keranjang');
				echo $this->simplemessage($status,$class,'Transaksi dengan '.$n.' barang '.$msg);
			} else if ($this->input->post('data') == 'logs_hutang') {
				$table = $this->input->post('data');
				$data['invoice'] = $this->input->post('invoice');
				$data['tanggal'] = date('Y-m-d');
				$data['waktu'] = date('H:i:s');
				$data['bayar'] = $this->input->post('bayar');
				$data['hutang'] = $this->input->post('hutang');
				$data['sisa'] = $this->input->post('sisa');

				$transaksi = $this->ServiceModel->getDataWhere('transaksi',array('invoice' => $data['invoice']));
				$updateData['bayar'] = $transaksi[0]['bayar'] + $data['bayar'];
				$updateData['kembali'] = $data['sisa'];


				if ($this->ServiceModel->createData($table,$data)) {
					$s = true;
					$c = 'success';
					$msgCreate = 'Hutang berhasil dibayar';

					if ($this->ServiceModel->updateData('transaksi',$updateData,array('invoice' => $data['invoice']))) {
						$msgUpdate = 'Transaksi berhasil diupdate';
					} else {
						$msgUpdate = 'Transaksi gagal diupdate';
					}
				} else {
					$s = false;
					$c = 'error';
					$msgCreate = 'Hutang gagal dibayar';
				}
				echo $this->simplemessage($s,$c,$msgCreate.',<br>'.$msgUpdate);
			}
		} else {
			echo json_encode(array(
				'status' => false,
				'message' => 'Bad request'
			));
		}
	}

	public function updatedata(){
		if ($_SERVER['REQUEST_METHOD'] == 'POST') {
			if ($this->input->post('data') == 'barang') {
				$table = $this->input->post('data');
				$id = $this->input->post('id');
				$data['nama'] = $this->input->post('nama');
				$data['barcode'] = $this->input->post('barcode');
				$data['hargap'] = $this->input->post('hargap');
				$data['satuan'] = $this->input->post('satuan');
				$data['kategori'] = $this->input->post('kategori');
				$data['hargag'] = $this->input->post('hargag');
				$data['hargae'] = $this->input->post('hargae');

				// buat satuan baru jika kosong
				if (empty($this->ServiceModel->getDataWhere('satuan',array('nama' => $data['satuan'])))) {
					$this->ServiceModel->createData('satuan',array('nama' => $data['satuan']));
				}

				// buat kategori baru jika kosong
				if (empty($this->ServiceModel->getDataWhere('kategori',array('nama' => $data['kategori'])))) {
					$this->ServiceModel->createData('kategori',array('nama' => $data['kategori']));
				}

				$checkData = $this->ServiceModel->getDataWhere($table,array('id_barang' => $id))[0];
				$nama = $data['nama'] == $checkData['nama'];
				$barcode = $data['barcode'] == $checkData['barcode'];
				$satuan = $data['satuan'] == $checkData['satuan'];
				if ($nama && $barcode && $satuan) {
					if ($this->ServiceModel->updateData($table,$data,array('id_barang' => $id))) {
						echo $this->simplemessage(true,'success','Barang berhasil diubah');
					} else {
						echo $this->simplemessage(false,'error','Barang gagal diubah');
					}
				}else{
					$checkAvailableData = $this->ServiceModel->getDataWhere($table,array(
						'nama' => $this->input->post('nama'),
						'barcode' => $this->input->post('barcode'),
						'satuan' => $this->input->post('satuan'))
					);

					if (empty($checkAvailableData)) {
						if ($this->ServiceModel->updateData($table,$data,array('id_barang' => $id))) {
							echo $this->simplemessage(true,'success','Barang berhasil diubah');
						} else {
							echo $this->simplemessage(false,'error','Barang gagal diubah');
						}
					} else {
						echo json_encode(array(
							'status' => false,
							'class' => 'error',
							'message' => 'Barang dengan nama <strong>'.$this->input->post('nama').'</strong>, 
														barcode <strong>'.$this->input->post('barcode').'</strong>, dan 
														satuan <strong>'.$this->input->post('satuan').'</strong> sudah tersedia'
						));
					}
				}
			} elseif ($this->input->post('data') == 'satuan') {
				$table = $this->input->post('data');
				$id = $this->input->post('id');
				$data['nama'] = $this->input->post('nama');

				$checkAvailableSatuan = $this->ServiceModel->getDataWhere($table,array('nama' => $this->input->post('nama')));

				if (empty($checkAvailableSatuan)) {
					if ($this->ServiceModel->updateData($table,$data,array('id_satuan' => $id))) {
						echo $this->simplemessage(true,'success','Satuan berhasil diubah');
					} else {
						echo $this->simplemessage(false,'error','Satuan gagal diubah');
					}
				} else {
					echo json_encode(array(
						'status' => false,
						'class' => 'error',
						'message' => 'Satuan dengan nama <strong>'.$this->input->post('nama').'</strong> sudah tersedia'
					));
				}
			} elseif ($this->input->post('data') == 'kategori') {
				$table = $this->input->post('data');
				$id = $this->input->post('id');
				$data['nama'] = $this->input->post('nama');

				$checkAvailableSatuan = $this->ServiceModel->getDataWhere($table,array('nama' => $this->input->post('nama')));

				if (empty($checkAvailableSatuan)) {
					if ($this->ServiceModel->updateData($table,$data,array('id_kategori' => $id))) {
						echo $this->simplemessage(true,'success','Kategori berhasil diubah');
					} else {
						echo $this->simplemessage(false,'error','Kategori gagal diubah');
					}
				} else {
					echo json_encode(array(
						'status' => false,
						'class' => 'error',
						'message' => 'Kategori dengan nama <strong>'.$this->input->post('nama').'</strong> sudah tersedia'
					));
				}
			} elseif ($this->input->post('data') == 'supplier') {
				$table = $this->input->post('data');
				$id = $this->input->post('id');
				$data['nama'] = $this->input->post('nama');
				$data['kota'] = $this->input->post('kota');
				$data['alamat'] = $this->input->post('alamat');
				$data['notelp'] = $this->input->post('notelp');
				$data['nohp'] = $this->input->post('nohp');

				$checkData = $this->ServiceModel->getDataWhere($table,array('id_supplier' => $id))[0];
				$nama = $data['nama'] == $checkData['nama'];

				if ($nama) {
					if ($this->ServiceModel->updateData($table,$data,array('id_supplier' => $id))) {
						echo $this->simplemessage(true,'success','Supplier berhasil diubah');
					} else {
						echo $this->simplemessage(false,'error','Supplier gagal diubah');
					}
				}else{
					$checkAvailableData = $this->ServiceModel->getDataWhere($table,array('nama' => $this->input->post('nama')));

					if (empty($checkAvailableData)) {
						if ($this->ServiceModel->updateData($table,$data,array('id_supplier' => $id))) {
							echo $this->simplemessage(true,'success','Supplier berhasil diubah');
						} else {
							echo $this->simplemessage(false,'error','Supplier gagal diubah');
						}
					} else {
						echo json_encode(array(
							'status' => false,
							'class' => 'error',
							'message' => 'Supplier dengan nama <strong>'.$this->input->post('nama').'</strong> sudah tersedia'
						));
					}
				}
			} elseif ($this->input->post('data') == 'pembelian') {
				$table = $this->input->post('data');
				$id = $this->input->post('id');
				$data['supplier'] = $this->input->post('supplier');
				$data['tanggal'] = $this->input->post('tanggal');
				$data['catatan'] = $this->input->post('catatan');

				// buat satuan baru jika kosong
				if (empty($this->ServiceModel->getDataWhere('supplier',array('nama' => $data['supplier'])))) {
					$this->ServiceModel->createData('supplier',array('nama' => $data['supplier']));
				}

				if ($this->ServiceModel->updateData($table,$data,array('id_pembelian' => $id))) {
					$msgUpdateData = 'Data pembelian berhasil <strong>diupdate</strong>';
					$status = true;
					$class = 'success';
				} else {
					$msgUpdateData = 'Data pembelian gagal <strong>diupdate</strong>';
					$status = false;
					$class = 'error';
				}

				$n = 1;
				$all = 1;
				if (isset($_FILES['berkas_gambar'])) {
					foreach ($_FILES['berkas_gambar']['tmp_name'] as $key => $value) {
						$oriFileName = $_FILES['berkas_gambar']['name'][$key];
						$split = explode('.', $oriFileName);
						$finalId = $id.'_'.($this->ServiceModel->getMaxId('id_foto','max_id_foto','foto_pembelian') + 1);
						
						$dataFoto['id_pembelian'] = $id;
						$dataFoto['nama'] = $finalId.'.'.end($split);
	
						if ($this->ServiceModel->createData('foto_pembelian',$dataFoto)) {
							$msgCreateDataFoto = 'Foto pembelian berhasil <strong>ditambahkan</strong>';
						} else {
							$msgCreateDataFoto = 'Foto pembelian gagal <strong>ditambahkan</strong>';
						}
	
						$tagetPath = './assets/images/pembelian/'.$dataFoto['nama'];
						if (move_uploaded_file($value, $tagetPath)) {
							$msgMoveFile = $n++.' dari '.$all.' Foto baru berhasil <strong>diupload</strong>';
						} else {
							$msgMoveFile = $n++.' dari '.$all.' Foto baru gagal <strong>diupload</strong>';
						}
						$all++;
					}
				}
				echo $this->simplemessage($status,$class,$msgUpdateData);
			}

		} else {
			echo json_encode(array(
				'status' => false,
				'message' => 'Bad request'
			));
		}
	}

	public function deletedata(){
		if ($_SERVER['REQUEST_METHOD'] == 'POST') {
			switch ($this->input->post('data')) {
				case 'barang':
					$field = 'id_barang';
					$data = 'Barang';
					break;
				case 'satuan':
					$field = 'id_satuan';
					$data = 'Satuan';
					break;
				case 'kategori':
					$field = 'id_kategori';
					$data = 'Kategori';
					break;
				case 'supplier':
					$field = 'id_supplier';
					$data = 'Supplier';
					break;
				case 'pembelian':
					$field = 'id_pembelian';
					$data = 'Pembelian';
					break;
				case 'foto_pembelian':
					$field = 'id_foto';
					$data = 'Foto';
					$path = "assets/images/pembelian/".$this->input->post('nama');
					unlink($path);
					break;
				case 'keranjang':
					$field = 'id_barang';
					$data = 'Barang';
					break;
				case 'transaksi':
					$field = 'invoice';
					$data = 'Transaksi';
					break;
				case 'logs':
					$field = 'id_log';
					$data = 'Histori';
					break;
			}

			if ($this->input->post('data') == 'pembelian') {
				if ($this->ServiceModel->deleteData($this->input->post('data'),array($field => $this->input->post('id')))) {
					$msgData = 'Data pembelian berhasil <strong>dihapus</strong>';
					$status = true;
					$class = 'success';
				} else {
					$msgData = 'Data pembelian gagal <strong>dihapus</strong>';
					$status = false;
					$class = 'error';
				}

				$n = 1;
				$all = 1;
				foreach ($this->getfoto($this->input->post('id'))['result'] as $key => $value) {
					$nameFile = $value['nama'];
					$path = "assets/images/pembelian/".$nameFile;

					if (file_exists($path)) {
						if(unlink($path)){
							$msgFile = $n++.' dari '.$all.' File foto berhasil <strong>dihapus</strong>';
						} else {
							$msgFile = $n++.' dari '.$all.' File foto gagal <strong>dihapus</strong>';
						}
					} else {
						$msgFile = $n++.' dari '.$all.' File foto <strong>tidak</strong> tersedia';
					}
					$all++;
				}

				if ($this->ServiceModel->deleteData('foto_pembelian',array($field => $this->input->post('id')))) {
					$msgDataFoto = 'Data foto berhasil <strong>dihapus</strong>';
				} else {
					$msgDataFoto = 'Data foto gagal <strong>dihapus</strong>';
				}
				echo $this->simplemessage($status,$class,$msgData);
			}	else if ($this->input->post('data') == 'transaksi') {
				if ($this->ServiceModel->deleteData($this->input->post('data'),array($field => $this->input->post('invoice')))) {
					$this->ServiceModel->deleteData('detail_transaksi',array($field => $this->input->post('invoice')));
					$this->ServiceModel->deleteData('logs_hutang',array($field => $this->input->post('invoice')));
					echo json_encode(array(
						'status' => true,
						'class' => 'success',
						'message' => $data.' berhasil dihapus'
					));
				} else {
					echo json_encode(array(
						'status' => false,
						'class' => 'error',
						'message' => $data.' gagal dihapus'
					));
				}
			} else {
				if ($this->ServiceModel->deleteData($this->input->post('data'),array($field => $this->input->post('id')))) {
					echo json_encode(array(
						'status' => true,
						'class' => 'success',
						'message' => $data.' berhasil dihapus'
					));
				} else {
					echo json_encode(array(
						'status' => false,
						'class' => 'error',
						'message' => $data.' gagal dihapus'
					));
				}
			}
			

			
		} else {
			echo json_encode(array(
				'status' => false,
				'message' => 'Bad request'
			));
		}
	}

	public function deletealldatafromtable(){
		if ($_SERVER['REQUEST_METHOD'] == 'POST') {
			$this->ServiceModel->deleteAllDataFromTable($this->input->post('data'));
			echo $this->simplemessage(true,'success','Berhasil menghapus semua histori');
		} else {
			echo json_encode(array(
				'status' => false,
				'message' => 'Bad request'
			));
		}
	}

	private function simplemessage($s,$c,$m){
		return json_encode(array(
			'status' => $s,
			'class' => $c,
			'message' => $m
		));
	}

	private function messageforcart($s,$c,$t,$d,$m){
		return json_encode(array(
			'status' => $s,
			'class' => $c,
			'data' => array(
				'total' => $t,
				'results' => $d
			),
			'message' => $m
		));
	}

	private function getfoto($id){
		return array(
			'idRequest' => $id,
			'result' => $this->ServiceModel->getDataWhere('foto_pembelian',array('id_pembelian' => $id))
		);
	}

	private function getdetailtransaksi($inv){
		return array(
			'invoiceRequest' => $inv,
			'result' => $this->ServiceModel->getDataWhere('detail_transaksi',array('invoice' => $inv))
		);
	}

	public function getinvoice(){
		echo json_encode(array(
			'invoice' => 'INV/'.date('Ymd').'/TCPV2/'.$this->ServiceModel->getInvoice()
		));
	}

	public function getdate(){
		echo json_encode(array(
			'date' => date('Y-m-d')
		));
	}

	public function exportbarang(){
		$spreadsheet = new Spreadsheet();
		$spreadsheet->
		getProperties()->
		setCreator('Tcpv2 System')->
		setLastModifiedBy('Tcpv2 System')->
		setTitle('Office 2007 XLSX Document')->
		setSubject('Office 2007 XLSX Document')->
		setDescription('Laporan Barang')->
		setKeywords('office 2007 openxml php')->
		setCategory('Result File');

		$sheet = $spreadsheet->getActiveSheet();
		$sheet->setCellValue('A1', 'No')->getStyle('A1')->getFont()->setBold(true);
		$sheet->getCell('A1', 'No')->getStyle('A1')->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
		$sheet->setCellValue('B1', 'Nama')->getStyle('B1')->getFont()->setBold(true);
		$sheet->getCell('B1', 'Nama')->getStyle('B1')->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
		$sheet->setCellValue('C1', 'Barcode')->getStyle('C1')->getFont()->setBold(true);
		$sheet->getCell('C1', 'Barcode')->getStyle('C1')->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
		$sheet->setCellValue('D1', 'Harga Pokok')->getStyle('D1')->getFont()->setBold(true);
		$sheet->getCell('D1', 'Harga Pokok')->getStyle('D1')->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
		$sheet->setCellValue('E1', 'Harga Grosir')->getStyle('E1')->getFont()->setBold(true);
		$sheet->getCell('E1', 'Harga Grosir')->getStyle('E1')->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
		$sheet->setCellValue('F1', 'Harga Eceran')->getStyle('F1')->getFont()->setBold(true);
		$sheet->getCell('F1', 'Harga Eceran')->getStyle('F1')->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
		$sheet->setCellValue('G1', 'Satuan')->getStyle('G1')->getFont()->setBold(true);
		$sheet->getCell('G1', 'Satuan')->getStyle('G1')->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
		$sheet->setCellValue('H1', 'Kategori')->getStyle('H1')->getFont()->setBold(true);
		$sheet->getCell('H1', 'Kategori')->getStyle('H1')->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);

		$no = 2;
		$nourut = 1;
		foreach ($this->ServiceModel->getDataBarang() as $key => $value) {
			$sheet->setCellValue('A'.$no, $nourut++)->getStyle('A'.$no)->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
			$sheet->setCellValue('B'.$no, $value['nama']);
			$sheet->setCellValue('C'.$no, $value['barcode']);
			$sheet->setCellValue('D'.$no, 'Rp. '.number_format($value['hargap'],0,',','.'));
			$sheet->setCellValue('E'.$no, 'Rp. '.number_format($value['hargag'],0,',','.'));
			$sheet->setCellValue('F'.$no, 'Rp. '.number_format($value['hargae'],0,',','.'));
			$sheet->setCellValue('G'.$no, $value['satuan']);
			$sheet->setCellValue('H'.$no, $value['kategori']);
			$no++;
		}

		header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
		header('Content-Disposition: attachment;filename="Laporan Barang.xlsx');
		header('Cache-Control: max-age=0');

		$write = IOFactory::createWriter($spreadsheet,'Xlsx');
		$write->save('php://output');
		exit;
	}

	public function exporttransaksi(){
		$spreadsheet = new Spreadsheet();
		$spreadsheet->
		getProperties()->
		setCreator('Tcpv2 System')->
		setLastModifiedBy('Tcpv2 System')->
		setTitle('Office 2007 XLSX Document')->
		setSubject('Office 2007 XLSX Document')->
		setDescription('Laporan Barang')->
		setKeywords('office 2007 openxml php')->
		setCategory('Result File');

		$sheet = $spreadsheet->getActiveSheet();
		$sheet->setCellValue('A1', 'No')->getStyle('A1')->getFont()->setBold(true);
		$sheet->getCell('A1', 'No')->getStyle('A1')->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
		$sheet->setCellValue('B1', 'Invoice')->getStyle('B1')->getFont()->setBold(true);
		$sheet->getCell('B1', 'Invoice')->getStyle('B1')->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
		$sheet->setCellValue('C1', 'Tanggal')->getStyle('C1')->getFont()->setBold(true);
		$sheet->getCell('C1', 'Tanggal')->getStyle('C1')->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
		$sheet->setCellValue('D1', 'Total')->getStyle('D1')->getFont()->setBold(true);
		$sheet->getCell('D1', 'Total')->getStyle('D1')->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
		$sheet->setCellValue('E1', 'Bayar')->getStyle('E1')->getFont()->setBold(true);
		$sheet->getCell('E1', 'Bayar')->getStyle('E1')->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
		$sheet->setCellValue('F1', 'Kembali')->getStyle('F1')->getFont()->setBold(true);
		$sheet->getCell('F1', 'Kembali')->getStyle('F1')->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
		$sheet->setCellValue('G1', 'Status')->getStyle('G1')->getFont()->setBold(true);
		$sheet->getCell('G1', 'Status')->getStyle('G1')->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
		
		$no = 2;
		$nourut = 1;
		$total = 0;
		$bayar = 0;
		$kembali = 0;
		foreach ($this->ServiceModel->getDataTransaksi() as $key => $value) {
			$total += $value['total'];
			$bayar += $value['bayar'];
			$kembali += $value['kembali'];

			$sheet->setCellValue('A'.$no, $nourut++)->getStyle('A'.$no)->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
			$sheet->setCellValue('B'.$no, $value['invoice']);
			$sheet->setCellValue('C'.$no, $value['tanggal']);
			$sheet->setCellValue('D'.$no, 'Rp. '.number_format($value['total'],0,',','.'));
			$sheet->setCellValue('E'.$no, 'Rp. '.number_format($value['bayar'],0,',','.'));
			$sheet->setCellValue('F'.$no, 'Rp. '.number_format($value['kembali'],0,',','.'));
			$sheet->setCellValue('G'.$no, (int) $value['kembali'] < 0 ? 'Hutang' : 'Lunas');
			$no++;
		}

		$sheet->setCellValue('C'.$no, 'Total')->getStyle('D'.$no)->getFont()->setBold(true);
		$sheet->setCellValue('D'.$no, 'Rp. '.number_format($total,0,',','.'))->getStyle('E'.$no)->getFont()->setBold(true);
		$sheet->setCellValue('E'.$no, 'Rp. '.number_format($bayar,0,',','.'))->getStyle('F'.$no)->getFont()->setBold(true);
		$sheet->setCellValue('F'.$no, 'Rp. '.number_format($kembali,0,',','.'))->getStyle('G'.$no)->getFont()->setBold(true);

		if ((isset($_GET['jenis']) && $_GET['jenis'] == 'perperiode') && (isset($_GET['start']) && isset($_GET['end']))) {
			$start = $this->input->get('start');
			$end = $this->input->get('end');
			$nameFile = $start.' s.d. '.$end;
		} else if ($this->input->get('nama') == 'hutang') {
			$nameFile = 'Hutang';
		} elseif ($this->input->get('nama') == 'lunas') {
			$nameFile = 'Lunas';
		} else {
			$nameFile = $this->input->get('nama') == '' ? 'Semua' : $this->input->get('nama');
		}

		header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
		header('Content-Disposition: attachment;filename="Laporan Transaksi '.$nameFile.'.xlsx');
		header('Cache-Control: max-age=0');

		$write = IOFactory::createWriter($spreadsheet,'Xlsx');
		$write->save('php://output');
		exit;
	}

	public function print(){
		$this->load->view('PrintView');
	}

	public function backup(){
		$this->load->dbutil();
		$prefs = array(
					'tables'        => array('barang','detail_transaksi','foto_pembelian','kategori','keranjang','logs','logs_hutang','pembelian','satuan','supplier','transaksi'),   // Array of tables to backup.
					'ignore'        => array(),                     // List of tables to omit from the backup
					'format'        => 'txt',                       // gzip, zip, txt
					'filename'      => 'backupTcpv2.sql',              // File name - NEEDED ONLY WITH ZIP FILES
					'add_drop'      => TRUE,                        // Whether to add DROP TABLE statements to backup file
					'add_insert'    => TRUE,                        // Whether to add INSERT data to backup file
					'newline'       => "\n"                         // Newline character used in backup file
		);

		$backup = $this->dbutil->backup($prefs);
		$this->load->helper('download');
		force_download('backupTcpv2_'.date('Y_m_d_H_i_s').'.sql', $backup);

	}
}
