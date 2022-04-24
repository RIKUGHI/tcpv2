const navigation = document.querySelector('.navigation')
const closed = document.querySelector('.closed')
const menu = document.querySelectorAll('.navigation .menu .list a')
const subMenu = document.querySelectorAll('.navigation .menu .list .sub-nav')

menu.forEach(e => {
  cUrl = location.href
  urlBarang = baseUrl('master/barang')
  urlSatuan = baseUrl('master/satuan')
  urlKatergori = baseUrl('master/kategori')
  urlSupplier = baseUrl('master/supplier')
  urlPenjualan = baseUrl('transaksi/penjualan')
  urlPembelian = baseUrl('transaksi/pembelian')

  if ((cUrl == urlBarang && e.href == urlBarang) || (cUrl == urlSatuan && e.href == urlSatuan) || (cUrl == urlKatergori && e.href == urlKatergori)
  || (cUrl == urlSupplier && e.href == urlSupplier)) {
    menu[2].classList.add('active')
    subMenu[0].classList.add('open')
    e.classList.add('active')
  }else if ((cUrl == urlPenjualan && e.href == urlPenjualan) || (cUrl == urlPembelian && e.href == urlPembelian)) {
    menu[7].classList.add('active')
    subMenu[1].classList.add('open')
    e.classList.add('active')
  }else if (e.href == location.href){
    e.classList.add('active')
  }
})

if (location.href.split('/')[5] == 'barang'+location.search) {
  menu[2].classList.add('active')
  subMenu[0].classList.add('open')
  menu[3].classList.add('active')
} else if (location.href.split('/')[5] == 'satuan'+location.search) {
  menu[2].classList.add('active')
  subMenu[0].classList.add('open')
  menu[4].classList.add('active')
} else if (location.href.split('/')[5] == 'kategori'+location.search) {
  menu[2].classList.add('active')
  subMenu[0].classList.add('open')
  menu[5].classList.add('active')
} else if (location.href.split('/')[5] == 'supplier'+location.search) {
  menu[2].classList.add('active')
  subMenu[0].classList.add('open')
  menu[6].classList.add('active')
} else if (location.href.split('/')[5] == 'penjualan'+location.search) {
  menu[7].classList.add('active')
  subMenu[1].classList.add('open')
  menu[8].classList.add('active')
} else if (location.href.split('/')[5] == 'pembelian'+location.search) {
  menu[7].classList.add('active')
  subMenu[1].classList.add('open')
  menu[9].classList.add('active')
}

// ----------------------------------- event handle start -----------------------------------
navigation.onmouseover = () => closed.classList.add('active')
navigation.onmouseout = () => closed.classList.remove('active')
menu[2].onclick = e => subMenuActive(e,'master')
menu[7].onclick = e => subMenuActive(e,'transaksi')
// ------------------------------------ event handle end ------------------------------------

// ----------------------------------- arrow functions start -----------------------------------
const subMenuActive = (e,m) => {
  e.preventDefault()

  if (m == 'master') {
    menu[2].classList.toggle('active')
    subMenu[0].classList.toggle('open')
    
    menu[7].classList.remove('active')
    subMenu[1].classList.remove('open')
  }else{
    menu[2].classList.remove('active')
    subMenu[0].classList.remove('open')

    menu[7].classList.toggle('active')
    subMenu[1].classList.toggle('open')
  }
}
// ------------------------------------- arrow functions end ------------------------------------































































