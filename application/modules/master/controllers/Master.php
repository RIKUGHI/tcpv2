<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Master extends CI_Controller {

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
	}
		

	public function index(){
		echo 'index master';
	}

	public function barang(){
		$data['title'] = 'Master | Barang';

		$this->load->view('templates/header',$data);
		$this->load->view('templates/navbar');
		$this->load->view('BarangView');
		$this->load->view('templates/footer');
	}

	public function satuan(){
		$data['title'] = 'Master | Satuan';

		$this->load->view('templates/header',$data);
		$this->load->view('templates/navbar');
		$this->load->view('SatuanView');
		$this->load->view('templates/footer');
	}

	public function kategori(){
		$data['title'] = 'Master | Kategori';

		$this->load->view('templates/header',$data);
		$this->load->view('templates/navbar');
		$this->load->view('KategoriView');
		$this->load->view('templates/footer');
	}

	public function supplier(){
		$data['title'] = 'Master | Supplier';

		$this->load->view('templates/header',$data);
		$this->load->view('templates/navbar');
		$this->load->view('SupplierView');
		$this->load->view('templates/footer');
	}

}
