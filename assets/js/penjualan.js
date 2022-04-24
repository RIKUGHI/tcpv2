const body = document.body
let YAXIS = 0
let getAllFile = []
const loadData = async url => {
  const containerData = document.querySelector('main .css-cons1s')
  const containerDataTitle = containerData.querySelector('.css-headxs h3')
  const containerPagination = document.querySelector('main .pagination-container')
  
  containerData.querySelectorAll('table').length > 1 ? containerData.querySelectorAll('table')[1].remove() : null
  containerData.querySelector('.empty') != null ? containerData.querySelector('.empty').remove() : null
  containerData.append(componentPreLoad())
  res = await getData(baseUrl('service/getdata'+url))
  containerData.querySelector('.pre-load').remove()
  res.namaPencarian == 'Semua' ? containerDataTitle.textContent = 'Daftar Pembelian' : containerDataTitle.textContent = `Daftar Pencarian Untuk "${res.namaPencarian}"`

  if (res.jenis == 'Semua') {
    all()
  } else {
    perPeriod()
  }

  if (res.products.length == 0) {
    containerData.append(componentEmpty('Data Tidak Ditemukan'))
    containerPagination.innerHTML = ''
  } else {
    containerData.append(componentTable(res))
    window.scrollTo(0,YAXIS)
    runActionEvent()
    containerPagination.innerHTML = showPagination(res)
  }
}
const selectContainer = document.querySelector('main .select-container')
const valueSelected = selectContainer.querySelector('.select-selected input')
const selectArrow = selectContainer.querySelector('.select-selected i')
const optionsList = selectContainer.querySelector('.control-select-option ul')
const addBtn = document.getElementById('addDataBtn')

loadData(location.search == '' ? '?data=transaksi' : location.search)

// ----------------------------------- select option start -----------------------------------

selectContainer.onclick = e => {
  if (e.target.localName == 'li') {
    optionsList.querySelectorAll('li').forEach(e => e.classList.remove('active'))
      e.target.classList.add('active')
      valueSelected.value = e.target.textContent
      selectArrow.classList.toggle('open')
      optionsList.classList.toggle('open')

      switch (e.target.textContent) {
        case 'Semua':
          all()
          break;
        case 'Per Periode':
          perPeriod()
          break;
      }
  } else {
    selectArrow.classList.toggle('open')
    optionsList.classList.toggle('open')
  }
}

body.onclick = e => {
  if (e.target.classList.contains('select-selected') || e.target.classList.contains('fa-caret-down')) {
    
  } else {
    selectArrow.classList.remove('open')
    optionsList.classList.remove('open')
  }
}
// ----------------------------------- select option end -----------------------------------

// ----------------------------------- search data penjualan start -----------------------------------
const formSearch = document.querySelector('main .css-sj1k2s .css-wrap12 form')
formSearch.onsubmit = e => {
  e.preventDefault()

  if (formSearch.querySelectorAll('input').length == 1) {
    if (formSearch.querySelector('input').value == '') {
      location.href = baseUrl('transaksi/penjualan')
    } else {
      location.href = baseUrl('transaksi/penjualan?data=transaksi&nama='+formSearch.querySelector('input').value)
    }
  } else {
    start = formSearch.querySelectorAll('input')[0]
    end = formSearch.querySelectorAll('input')[1]

    if (start.value == '' || end.value == '') {
      setNotification('error','Inputan pencarian per periode, awal dan akhir tidak boleh kosong',2000)
    } else {
      location.href = baseUrl(`transaksi/penjualan?data=transaksi&jenis=perperiode&start=${start.value}&end=${end.value}`)
    }
  }
}

const btnExport = document.querySelector('main .export')
btnExport.onclick = () => {
  location.replace(baseUrl('service/exporttransaksi'+location.search))
}

const all = () => {
  formSearch.removeAttribute('class')
  formSearch.innerHTML =  `
                            <input type="text" placeholder="Cari Invoice/Status">
                            <button class="fas fa-search"></button>
                          `
}

const perPeriod = () => {
  formSearch.classList.add('css-transaction')
  formSearch.innerHTML =  `
                            <input type="date" placeholder="Tanggal Awal">
                            <input type="date" placeholder="Tanggal Akhir">
                            <button>Tampilkan</button>
                          `
}
// ----------------------------------- search data penjualan end ------------------------------

// ----------------------------------- arrow function start ------------------------------
const componentTable = res => {
  const component = `
                      <table border="0" class="tbl-c9">
                        <tbody>
                        ${res.products.map(d => {
                          return  `
                                    <tr>
                                      <td>${res.awalData++ + 1}</td>
                                      <td>${d.invoice}</td>
                                      <td>${simpleDateView(d.tanggal)}</td>
                                      <td>${formatRupiah(d.total)}</td>
                                      <td>${formatRupiah(d.bayar)}</td>
                                      <td>${showLiveKembalian(parseInt(d.bayar),parseInt(d.total),'Rp. ')}</td>
                                      <td>
                                        <span class="${parseInt(d.kembali) < 0 ? 'hutang' : 'lunas'}" ${parseInt(d.kembali) < 0 ? `data-inv="${d.invoice}"` : ''}>${parseInt(d.kembali) < 0 ? 'Hutang' : 'Lunas'}</span>
                                      </td>
                                      <td>
                                        <div class="action" data-id=${d.id_transaksi} data-inv="${d.invoice}">
                                          <button class="fas fa-print"></button>
                                          <button class="far fa-eye"></button>
                                          <button class="fas fa-trash-alt"></button>
                                        </div>
                                      </td>
                                    </tr>
                                  `
                        }).join('')}
                        </tbody>
                      </table>
                    `
  return new DOMParser().parseFromString(component, 'text/html').body.firstChild;
}

const showPagination = res => {
  let p = ``

  if (res.halamanAktif > 1) {
    if (res.jenis == 'perperiode') {
      start = res.namaPencarian.split(' ')[0]
      end = res.namaPencarian.split(' ')[2]
      prevUrl = baseUrl(`transaksi/penjualan?data=${res.data}&jenis=${res.jenis}&start=${start}&end=${end}&page=${res.halamanAktif - 1}`)
      firstUrl = baseUrl(`transaksi/penjualan?data=${res.data}&jenis=${res.jenis}&start=${start}&end=${end}&page=1`)
    } else {
      prevUrl = res.namaPencarian == 'Semua' ? baseUrl(`transaksi/penjualan?data=${res.data}&page=${res.halamanAktif - 1}`) : baseUrl(`transaksi/penjualan?data=${res.data}&nama=${res.namaPencarian}&page=${res.halamanAktif - 1}`)
      firstUrl = res.namaPencarian == 'Semua' ? baseUrl(`transaksi/penjualan`) : baseUrl(`transaksi/penjualan?data=${res.data}&nama=${res.namaPencarian}&page=1`)
    }
    p +=  `
            <a href="${firstUrl}" class="pagination-btn nb">
              <i class="fas fa-angle-double-left"></i>
            </a>
            <a href="${prevUrl}" class="pagination-btn nb">
              <i class="fas fa-angle-left"></i>
            </a>
          `
  }

  if (res.jumlahHalaman > 5) {
    if (res.halamanAktif >= 3 && res.halamanAktif < res.jumlahHalaman - 2) {
      for (let i = res.halamanAktif - 2; i <= res.halamanAktif + 2; i++) {
        urlPagination(i)
        p += `<a href="${url}" class="pagination-btn ${i == res.halamanAktif ? 'active' : ''}">${i}</a>`
      }
    }else if (res.halamanAktif >= res.jumlahHalaman - 2){
      for (let i = res.jumlahHalaman - 4; i <= res.jumlahHalaman; i++) {
        urlPagination(i)
        p += `<a href="${url}" class="pagination-btn ${i == res.halamanAktif ? 'active' : ''}">${i}</a>`
      }
    }else{
      for (let i = 1; i <= 5; i++) {
        urlPagination(i)
        p += `<a href="${url}" class="pagination-btn ${i == res.halamanAktif ? 'active' : ''}">${i}</a>`
      }
    }
  } else {
    for (let i = 1; i <= res.jumlahHalaman; i++) {
      urlPagination(i)
      p += `<a href="${url}" class="pagination-btn ${i == res.halamanAktif ? 'active' : ''}">${i}</a>`
    }
  } 

  if (res.halamanAktif < res.jumlahHalaman) {
    if (res.jenis == 'perperiode') {
      start = res.namaPencarian.split(' ')[0]
      end = res.namaPencarian.split(' ')[2]
      nextUrl = baseUrl(`transaksi/penjualan?data=${res.data}&jenis=${res.jenis}&start=${start}&end=${end}&page=${res.halamanAktif + 1}`)
      maxUrl = baseUrl(`transaksi/penjualan?data=${res.data}&jenis=${res.jenis}&start=${start}&end=${end}&page=${res.jumlahHalaman}`)
    } else {
      nextUrl = res.namaPencarian == 'Semua' ? baseUrl(`transaksi/penjualan?data=${res.data}&page=${res.halamanAktif + 1}`) : baseUrl(`transaksi/penjualan?data=${res.data}&nama=${res.namaPencarian}&page=${res.halamanAktif + 1}`)
      maxUrl = res.namaPencarian == 'Semua' ? baseUrl(`transaksi/penjualan?data=${res.data}&page=${res.jumlahHalaman}`) : baseUrl(`transaksi/penjualan?data=${res.data}&nama=${res.namaPencarian}&page=${res.jumlahHalaman}`)
    }
    p +=  `
            <a href="${nextUrl}" class="pagination-btn nb">
              <i class="fas fa-angle-right"></i>
            </a>
            <a href="${maxUrl}" class="pagination-btn nb">
              <i class="fas fa-angle-double-right"></i>
            </a>
          `
  }

  return p
}

const urlPagination = i => {
  if (res.jenis == 'perperiode') {
    start = res.namaPencarian.split(' ')[0]
    end = res.namaPencarian.split(' ')[2]
    url = baseUrl(`transaksi/penjualan?data=${res.data}&jenis=${res.jenis}&start=${start}&end=${end}&page=${i}`)
  } else {
    url = res.namaPencarian == 'Semua' ? baseUrl(`transaksi/penjualan?data=${res.data}&page=${i}`) : baseUrl(`transaksi/penjualan?data=${res.data}&nama=${res.namaPencarian}&page=${i}`)
  }
}

const componentModal = (opt) => {
  const component = 
                                `  
                                  ${(() => {
                                    if (opt.type == 'detail') {
                                      return  ` 
                                                <div class="modal-box-container">
                                                  <div class="css-product pjl">
                                                    <div class="product-header">
                                                      <h2>${opt.title}</h2>
                                                      <button class="fas fa-times"></button>
                                                    </div>
                                                    <form>
                                                      <div class="product-content">
                                                      ${opt.simpleGroup.map(d => {
                                                        return  `
                                                                  <div class="simple-group">
                                                                    <label>${d.label}</label>
                                                                    <p ${d.class != undefined ? `class="${d.class}"` : ''}>${d.value}</p>
                                                                  </div>
                                                                `
                                                      }).join('')}
                                                        <div class="simple-group list-of-shpg">
                                                          <label>Daftar Belanja</label>
                                                          <table border="0">
                                                            <thead>
                                                              <tr>
                                                                <th>Nama Barang</th>
                                                                <th>Harga</th>
                                                                <th>Jumlah</th>
                                                                <th>Sub Total</th>
                                                              </tr>
                                                            </thead>
                                                            <tbody>
                                                            ${opt.detailTranscation.map(d => {
                                                              return  `
                                                                        <tr>
                                                                          <td>${d.nama +` (${d.satuan})`}</td>
                                                                          <td>${formatRupiah(d.harga)}</td>
                                                                          <td>${d.jumlah}</td>
                                                                          <td>${formatRupiah(d.subtotal)}</td>
                                                                        </tr>
                                                                      `
                                                            }).join('')}
                                                            </tbody>
                                                            <tfoot>
                                                            ${opt.resultTransaction.map(d => {
                                                              return  `
                                                                        <tr>
                                                                          <td colspan="3">${d.label}</td>
                                                                          <td>${d.value}</td>
                                                                        </tr>
                                                                      `
                                                            }).join('')}
                                                            </tfoot>
                                                          </table>
                                                        </div>
                                                        ${(() => {
                                                          if (opt.historyHutang.length != 0) {
                                                            return  `
                                                                      <div class="simple-group">
                                                                        <label>Histori Pembayaran Hutang</label>
                                                                        <div class="wrp">
                                                                        ${opt.historyHutang.map(d => {
                                                                          return  `
                                                                                    <div class="lgs-htg">
                                                                                      <p>${simpleDateView(d.tanggal)} - ${d.waktu} WIB</p>
                                                                                      <p>Telah membayar hutang sebesar <b>${formatRupiah(d.bayar)}</b> dari hutang <b>${showLiveKembalian(0,convertMinusToPlus(d.hutang),'Rp. ')}</b>, ${parseInt(d.sisa) < 0 ? `Tersisa <b>${showLiveKembalian(0,convertMinusToPlus(d.sisa),'Rp. ')}</b>` : '<b>Lunas</b>'} </p>
                                                                                    </div>
                                                                                  `
                                                                        }).join('')}
                                                                        </div>
                                                                      </div>
                                                                    `
                                                          } else {
                                                            return  ``
                                                          }
                                                        })()}
                                                      </div>
                                                      <div class="product-footer">
                                                      ${opt.btns.map(b => {
                                                        return  `
                                                                  <button type="${b.type}" ${b.class != undefined ? `class="${b.class}"` : ''}>${b.label}</button>
                                                                `
                                                      }).join('')}
                                                      </div>
                                                    </form>
                                                  </div>
                                                </div>
                                              `
                                    } else if (opt.type == 'hutang') {
                                      return  `
                                                <div class="modal-box-container">
                                                  <div class="css-product pjl">
                                                    <div class="product-header">
                                                      <h2>Bayar Hutang</h2>
                                                      <button class="fas fa-times"></button>
                                                    </div>
                                                    <form>
                                                      <div class="product-content">
                                                      ${opt.simpleGroup.map(d => {
                                                        if (d.label == 'Bayar Hutang') {
                                                          return  `
                                                                    <div class="simple-group">
                                                                      <label>${d.label}</label>
                                                                      <div class="wrp">
                                                                        <div class="qty">
                                                                          <input type="text" placeholder="Uang Bayar">
                                                                        </div>
                                                                        <span>Bayar tidak boleh kosong/Rp. 0</span>
                                                                      </div>
                                                                    </div>
                                                                  `
                                                        } else if (d.label == 'Histori Pembayaran Hutang') {
                                                          return  `
                                                                    <div class="simple-group">
                                                                      <label>Histori Pembayaran Hutang</label>
                                                                      <div class="wrp">
                                                                          ${(() => {
                                                                            if (d.value.length == 0) {
                                                                              return  `
                                                                                        <div class="lgs-htg">
                                                                                          <p>-----</p>
                                                                                          <p>Tidak ada histori pembayaran hutang</p>
                                                                                        </div>
                                                                                      `
                                                                            } else {
                                                                              return d.value.map(d => {
                                                                                return  `
                                                                                          <div class="lgs-htg">
                                                                                            <p>${simpleDateView(d.tanggal)} - ${d.waktu} WIB</p>
                                                                                            <p>Telah membayar hutang sebesar <b>${formatRupiah(d.bayar)}</b> dari hutang <b>${showLiveKembalian(0,convertMinusToPlus(d.hutang),'Rp. ')}</b>, Tersisa <b>${showLiveKembalian(0,convertMinusToPlus(d.sisa),'Rp. ')}</b></p>
                                                                                          </div>
                                                                                          `
                                                                              }).join('')
                                                                            }
                                                                          })()}
                                                                      </div>
                                                                    </div>
                                                                  `
                                                        } else {
                                                          return  `
                                                                    <div class="simple-group">
                                                                      <label>${d.label}</label>
                                                                      <p ${d.class != undefined ? `class="${d.class}"` : ''}>${d.value}</p>
                                                                    </div>
                                                                  `
                                                        }
                                                        
                                                      }).join('')}
                                                      </div>
                                                      <div class="product-footer">
                                                      ${opt.btns.map(b => {
                                                        return  `
                                                                  <button type="${b.type}">${b.label}</button>
                                                                `
                                                      }).join('')}
                                                      </div>
                                                    </form>
                                                  </div>
                                                </div>
                                              `
                                    } else if (opt.type == 'delete') {
                                      return  `
                                                <div class="modal-box-container">
                                                  <div class="tcat ts">
                                                    <div class="product-header">
                                                      <div class="ics active-del">
                                                        <i class="fas fa-question"></i>
                                                      </div>
                                                      <h3>${opt.title}</h3>
                                                    </div>
                                                    <form>
                                                      <div class="product-footer">
                                                      ${opt.btns.map(b => {
                                                        return  `<button class="${b.type == 'reset' ? 'normal' : 'hapus'}"  type="${b.type}">${b.name}</button>`
                                                      }).join('')}
                                                      </div>
                                                    </form>
                                                  </div>
                                                </div>
                                              `
                                    }
                                  })()}
                                `
  return new DOMParser().parseFromString(component, 'text/html').body.firstChild;
}

const runActionEvent = () => {
  const rowHutang = document.querySelectorAll('main .css-cons1s table tbody tr')
  const bayarHutang = document.querySelectorAll('main .css-cons1s table tbody tr td:nth-child(7) span')
  
  rowHutang.forEach((r,i) => {
    if (bayarHutang[i].classList.contains('hutang')) {
      r.onmouseover = () => bayarHutang[i].textContent = 'Bayar'
      r.onmouseout = () => bayarHutang[i].textContent = 'Hutang'
    }
  })

  bayarHutang.forEach(b => {
    if (b.classList.contains('hutang')) {
      b.onclick = () => modalHutang(b.dataset.inv)
    }
  })

  const containerAction = document.querySelectorAll('main .css-cons1s table tbody tr td .action')
  containerAction.forEach(c => {
    c.querySelector('.fa-print').onclick = () => window.open(baseUrl(`service/print?data=transaksi&id=${c.dataset.inv}`,'_blank'))
    c.querySelector('.fa-eye').onclick = () => modalDetail(c.dataset.inv)
    c.querySelector('.fa-trash-alt').onclick = () => modalDelete(c.dataset.inv)
  })
}

const modalHutang = async inv => {
  res = await getData(baseUrl('service/getsingledata?data=transaksi&id='+inv))

  const modalOptions = {
    type: 'hutang',
    title: 'Bayar Hutang',
    simpleGroup: [
      {
        label: 'Invoice',
        value: res.result[0].invoice
      },
      {
        label: 'Tanggal',
        value: simpleDateView(res.result[0].tanggal)
      },
      {
        label: 'Waktu',
        value: res.result[0].waktu
      },
      {
        label: 'Total',
        value: formatRupiah(res.result[0].total)
      },
      {
        label: 'Bayar Sebelumnya',
        value: formatRupiah(res.result[0].bayar)
      },
      {
        label: 'Bayar Hutang',
        value: ''
      },
      {
        label: 'Kembali',
        value: showLiveKembalian(parseInt(res.result[0].bayar),parseInt(res.result[0].total),'Rp. ')
      },
      {
        label: 'Status',
        class: parseInt(res.result[0].kembali) < 0 ? 'hutang' : 'lunas',
        value: parseInt(res.result[0].kembali) < 0 ? 'Hutang' : 'Lunas' 
      },
      {
        label: 'Histori Pembayaran Hutang',
        value: res.result[0].histori_hutang
      }
    ],
    btns: [
      {
        label: 'Batal',
        type: 'reset',
      },
      {
        label: 'Bayar',
        type: 'submit',
      }
    ]
  }

  body.classList.add('modal-open')
  body.append(componentModal(modalOptions))

  const modalBoxContainer = document.querySelector('.modal-box-container')
  const modalProduct = modalBoxContainer.querySelector('.css-product')

  openModalBox(modalBoxContainer,modalProduct)

  const form = modalProduct.querySelector('form')
  const formQty = form.querySelector('.simple-group .wrp .qty')
  const inputQty = formQty.querySelector('input')
  const containerKembali = form.querySelector('.simple-group:nth-child(7) p')
  const containerStatus = form.querySelector('.simple-group:nth-child(8) p')
  const closeModalHeader = modalProduct.querySelector('.product-header button')
  const closeModalFooter = modalProduct.querySelectorAll('.product-footer button')[0]
  const bayarBtn = modalProduct.querySelectorAll('.product-footer button')[1]

  validPrice(inputQty)  
  inputQty.onkeyup = () => {
    if (validPriceToStr(inputQty.value) == 0) {
      inputQty.value = formatRupiah(0)
      containerKembali.textContent = showLiveKembalian(0,convertMinusToPlus(res.result[0].kembali),'Rp. ')
    } else {
      if (inputQty.value == '') {
        inputQty.value = ''
        containerKembali.textContent = showLiveKembalian(0,convertMinusToPlus(res.result[0].kembali),'Rp. ')
        containerStatus.classList.add('hutang')
      } else {
        inputQty.value = formatRupiah(validPriceToStr(inputQty.value))
        containerStatus.classList.remove('hutang')
        containerStatus.classList.remove('lunas')

        if (Number.isNaN(validPriceToStr(inputQty.value))) {
          containerKembali.textContent = showLiveKembalian(0,convertMinusToPlus(res.result[0].kembali),'Rp. ')
        } else {
          containerKembali.textContent = showLiveKembalian(validPriceToStr(inputQty.value),convertMinusToPlus(res.result[0].kembali),'Rp. ')
        }
  
        if (validPriceToStr(inputQty.value) - convertMinusToPlus(res.result[0].kembali) < 0) {
          containerStatus.classList.add('hutang')
          containerStatus.textContent = 'Hutang'
        } else {
          containerStatus.classList.add('lunas')
          containerStatus.textContent = 'Lunas'
        }
      }
    }
  }

  modalBoxContainer.onclick = e => e.target.classList.contains('modal-box-container') ? closeModalBox(modalBoxContainer,modalProduct) : null
  closeModalHeader.onclick = () => closeModalBox(modalBoxContainer,modalProduct)
  closeModalFooter.onclick = () => closeModalBox(modalBoxContainer,modalProduct)
  bayarBtn.onclick = () => {}

  form.onsubmit = async e => {
    e.preventDefault()
    
    if (inputQty.value == '' || Number.isNaN(validPriceToStr(inputQty.value)) || validPriceToStr(inputQty.value) == 0) {
      formQty.parentElement.classList.add('warning')
    } else {
      formD = new FormData()
      formD.append('data','logs_hutang')
      formD.append('invoice',res.result[0].invoice)
      formD.append('bayar',validPriceToStr(inputQty.value))
      formD.append('hutang',parseInt(res.result[0].kembali))
      formD.append('sisa',validPriceToStr(containerKembali.textContent))

      bayarBtn.innerHTML = '<div class="loading"></div>'
      res = await postData(baseUrl('service/adddata'),formD)

      if (res.status) {
        YAXIS = pageYOffset
        setNotification(res.class,res.message,3000)
        closeModalBox(modalBoxContainer,modalProduct)
        loadData(location.search == '' ? '?data=transaksi' : location.search)
      } else {
        setNotification(res.class,res.message,3000)
        bayarBtn.innerHTML = 'Bayar'
      }
    }
  }
}

const modalDetail = async inv => {
  res = await getData(baseUrl('service/getsingledata?data=transaksi&id='+inv))

  const modalOptions = {
    type: 'detail',
    title: 'Detail Transaksi',
    simpleGroup: [
      {
        label: 'Invoice',
        value: res.result[0].invoice
      },
      {
        label: 'Tanggal',
        value: simpleDateView(res.result[0].tanggal)
      },
      {
        label: 'Waktu',
        value: res.result[0].waktu
      },
      {
        label: 'Status',
        class: parseInt(res.result[0].kembali) < 0 ? 'hutang' : 'lunas',
        value: parseInt(res.result[0].kembali) < 0 ? 'Hutang' : 'Lunas' 
      }
    ],
    detailTranscation: res.result[0].detail_transaksi.result,
    resultTransaction: [
      {
        label: 'Total',
        value: formatRupiah(res.result[0].total)
      },
      {
        label: 'Bayar',
        value: formatRupiah(res.result[0].bayar)
      },
      {
        label: 'Kembali',
        value: showLiveKembalian(parseInt(res.result[0].bayar),parseInt(res.result[0].total),'Rp. ')
      }
    ],
    historyHutang: res.result[0].histori_hutang,
    btns: [
      {
        label: 'Batal',
        type: 'reset',
      },
      {
        label: 'Cetak',
        class: 'cetak',
        type: 'submit',
      }
    ]
  }

  body.classList.add('modal-open')
  body.append(componentModal(modalOptions))

  const modalBoxContainer = document.querySelector('.modal-box-container')
  const modalProduct = modalBoxContainer.querySelector('.css-product')

  openModalBox(modalBoxContainer,modalProduct)

  const form = modalProduct.querySelector('form')
  const closeModalHeader = modalProduct.querySelector('.product-header button')
  const closeModalFooter = modalProduct.querySelectorAll('.product-footer button')[0]
  const cetakFooter = modalProduct.querySelectorAll('.product-footer button')[1]

  modalBoxContainer.onclick = e => e.target.classList.contains('modal-box-container') ? closeModalBox(modalBoxContainer,modalProduct) : null
  closeModalHeader.onclick = () => closeModalBox(modalBoxContainer,modalProduct)
  closeModalFooter.onclick = () => closeModalBox(modalBoxContainer,modalProduct)
  cetakFooter.onclick = () => window.open(baseUrl(`service/print?data=transaksi&id=${inv}`,'_blank'))
  form.onsubmit = e => e.preventDefault()
}

const modalDelete = async inv => {
  const modalOptions = {
    type: 'delete',
    title: `Apakah Yakin Ingin Menghapus Transaksi Dari <br> <strong>${inv}</strong>`,
    btns: [{name: 'Tutup',type: 'reset'},{name: 'Iya',type: 'submit'}]
  }

  body.classList.add('modal-open')
  body.append(componentModal(modalOptions))

  const modalBoxContainer = document.querySelector('.modal-box-container')
  const modalTcat = modalBoxContainer.querySelector('.tcat')

  openModalBox(modalBoxContainer,modalTcat)

  const form = modalTcat.querySelector('form')
  const closeModalFooter = modalTcat.querySelectorAll('.product-footer button')[0]
  const yesBtn = modalTcat.querySelectorAll('.product-footer button')[1]

  modalBoxContainer.onclick = e => e.target.classList.contains('modal-box-container') ? closeModalBox(modalBoxContainer,modalTcat) : null
  closeModalFooter.onclick = () => closeModalBox(modalBoxContainer,modalTcat)
  form.onsubmit = async e => {
    e.preventDefault()      
    formD = new FormData()
    formD.append('data','transaksi')
    formD.append('invoice',inv)

    yesBtn.innerHTML = '<div class="loading"></div>'
    res = await postData(baseUrl('service/deletedata'),formD)
    
    if (res.status) {
      YAXIS = pageYOffset
      setNotification(res.class,res.message,1500)
      closeModalBox(modalBoxContainer,modalTcat)
      loadData(location.search == '' ? '?data=transaksi' : location.search)
    } else {
      setNotification(res.class,res.message,1500)
      yesBtn.innerHTML = 'Iya'
    }
  }
}

const convertMinusToPlus = h => {
  kembali = [...h]
  kembali.shift()
  return parseInt(kembali.join(''))
}
// ----------------------------------- arrow function end ------------------------------








