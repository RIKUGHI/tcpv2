const body = document.body
let YAXIS = 0
let timerLiveSearch;
const formSearch = document.querySelectorAll('.cashier-container .prdct .css-cons1sc .css-headxs .srch-box form')

const loadData = async url => {
  const containerData = document.querySelector('.cashier-container .prdct .css-cons1sc')
  const containerDataTitle = containerData.querySelector('.css-headxs h3')
  const containerPagination = document.querySelector('.cashier-container .pagination-container')
  
  containerData.querySelectorAll('table').length > 1 ? containerData.querySelectorAll('table')[1].remove() : null
  containerData.querySelector('.empty') != null ? containerData.querySelector('.empty').remove() : null
  containerData.append(componentPreLoad())
  res = await getData(baseUrl('service/getdata'+url))
  containerData.querySelector('.pre-load').remove()
  res.namaPencarian == 'Semua' ? containerDataTitle.textContent = 'Daftar Barang' : containerDataTitle.textContent = `Daftar Pencarian Untuk "${res.namaPencarian}"`

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
loadData(location.search == '' ? '?data=barang' : location.search)

const loadCart = async () => {
  const containerData = document.querySelector('.cashier-container .cshr .css-cons1sc')
  const containerResult = document.querySelector('.cashier-container .cshr .css-rs')

  formSearch[1].querySelector('input').value = ''
  containerData.querySelectorAll('table').length > 1 ? containerData.querySelectorAll('table')[1].parentElement.remove() : null
  containerData.querySelector('.empty') != null ? containerData.querySelector('.empty').remove() : null
  containerData.append(componentPreLoad())
  res = await getData(baseUrl('service/getdata?data=keranjang'))
  containerData.querySelector('.pre-load').remove()

  if (res.products.length == 0) {
    containerData.append(componentEmpty('Keranjang Kosong'))
    containerResult.innerHTML = ''
  } else {
    containerData.append(componentTableCashier(res))
    window.scrollTo(0,YAXIS)
    containerResult.innerHTML = componentResult()
    runActionCartEvent()
  }
}

loadCart()

// ----------------------------------- search data barang start -----------------------------------


formSearch[0].onsubmit = e => {
  e.preventDefault()
  formSearch[0].querySelector('input').value == '' ? location.replace(baseUrl('kasir')) : null
}
formSearch[0].oninput = () => {
  clearTimeout(timerLiveSearch)
  timerLiveSearch = setTimeout(() => {
    loadData(`?data=barang&nama=${formSearch[0].querySelector('input').value.trim()}`)
  }, 400);
}

formSearch[1].onsubmit = async e => {
  e.preventDefault()
  formD = new FormData()
  formD.append('data','keranjang')
  formD.append('scan',formSearch[1].querySelector('input').value)

  res = await postData(baseUrl('service/adddata'),formD)

  if (res.status) {
    YAXIS = pageYOffset

    if (res.data.total == 1) {
      setNotification(res.class,res.message,2000)
      loadCart()
      formSearch[1].querySelector('input').value = ''
    } else {
      const modalOptions = {
        title: res.message,
        data: res.data.results
      }

      body.classList.add('modal-open')
      body.append(componentModalProductChoice(modalOptions))
    
      const modalBoxContainer = document.querySelector('.modal-box-container')
      const modalTcat = modalBoxContainer.querySelector('.tcat')
    
      openModalBox(modalBoxContainer,modalTcat)

      const form = modalTcat.querySelector('form')
      const closeModalHeader = modalTcat.querySelector('.product-header button')
      const pilihBtn = form.querySelectorAll('.product-content .list-p button')

      modalBoxContainer.onclick = e => {
        if (e.target.classList.contains('modal-box-container')) {
          closeModalBox(modalBoxContainer,modalTcat)
          formSearch[1].querySelector('input').value = ''
        }
      }
      closeModalHeader.onclick = () => {
        formSearch[1].querySelector('input').value = ''
        closeModalBox(modalBoxContainer,modalTcat)
      }

      pilihBtn.forEach(p => {
        p.onclick = () => {
          closeModalBox(modalBoxContainer,modalTcat)
          setTimeout(() => {
            modalCart(p.dataset.id)
          }, 500);
        }
      })

      form.onsubmit = e => e.preventDefault()
    }
  } else {
    setNotification(res.class,res.message,2000)
    formSearch[1].querySelector('input').value = ''
  }
}
formSearch[1].querySelector('input').onkeypress = e => e.key == 'Enter' ? null : allowOnlyNumeric(e)
// ----------------------------------- search data barang end -----------------------------------

// ------------------------------------- arrow functions start ------------------------------------
const componentTable = res => {
  const component =  `
                        <table border="0" class="tbl-c5">
                          <tbody>
                          ${res.products.map(r => {
                            return  `
                                      <tr ${r.stok == 0 ? 'class="empty"' : ''}>
                                        <td>${res.awalData++ + 1}</td>
                                        <td>${r.nama}</td>
                                        <td>${r.barcode}</td>
                                        <td>${r.satuan}</td>
                                        <td>
                                          <button class="fas fa-cart-plus" data-id="${r.id_barang}"></button>
                                        </td>
                                      </tr>
                                    `
                          }).join('')}
                          </tbody>
                        </table>
                      `
  return new DOMParser().parseFromString(component, 'text/html').body.firstChild;
}

const runActionEvent = () => {
  const containerAction = document.querySelectorAll('.cashier-container .prdct .css-cons1sc table tbody tr td .fa-cart-plus')
  containerAction.forEach(c => {
    c.onclick = () => modalCart(c.dataset.id)
  })
}

const showPagination = res => {
  let p = ``

  if (res.halamanAktif > 1) {
    p +=  `
            <a href="${res.namaPencarian == 'Semua' ? baseUrl(`kasir?data=${res.data}&page=1`) : baseUrl(`kasir?data=${res.data}&nama=${res.namaPencarian}&page=1`)}" class="pagination-btn nb">
              <i class="fas fa-angle-double-left"></i>
            </a>
            <a href="${res.namaPencarian == 'Semua' ? baseUrl(`kasir?data=${res.data}&page=${res.halamanAktif - 1}`) : baseUrl(`kasir?data=${res.data}&nama=${res.namaPencarian}&page=${res.halamanAktif - 1}`)}" class="pagination-btn nb">
              <i class="fas fa-angle-left"></i>
            </a>
          `
  }

  if (res.jumlahHalaman > 5) {
    if (res.halamanAktif >= 3 && res.halamanAktif < res.jumlahHalaman - 2) {
      for (let i = res.halamanAktif - 2; i <= res.halamanAktif + 2; i++) {
        p += `<a href="${res.namaPencarian == 'Semua' ? baseUrl(`kasir?data=${res.data}&page=${i}`) : baseUrl(`kasir?data=${res.data}&nama=${res.namaPencarian}&page=${i}`)}" class="pagination-btn ${i == res.halamanAktif ? 'active' : ''}">${i}</a>`
      }
    }else if (res.halamanAktif >= res.jumlahHalaman - 2){
      for (let i = res.jumlahHalaman - 4; i <= res.jumlahHalaman; i++) {
        p += `<a href="${res.namaPencarian == 'Semua' ? baseUrl(`kasir?data=${res.data}&page=${i}`) : baseUrl(`kasir?data=${res.data}&nama=${res.namaPencarian}&page=${i}`)}" class="pagination-btn ${i == res.halamanAktif ? 'active' : ''}">${i}</a>`
      }
    }else{
      for (let i = 1; i <= 5; i++) {
        p += `<a href="${res.namaPencarian == 'Semua' ? baseUrl(`kasir?data=${res.data}&page=${i}`) : baseUrl(`kasir?data=${res.data}&nama=${res.namaPencarian}&page=${i}`)}" class="pagination-btn ${i == res.halamanAktif ? 'active' : ''}">${i}</a>`
      }
    }
  } else {
    for (let i = 1; i <= res.jumlahHalaman; i++) {
      p += `<a href="${res.namaPencarian == 'Semua' ? baseUrl(`kasir?data=${res.data}&page=${i}`) : baseUrl(`kasir?data=${res.data}&nama=${res.namaPencarian}&page=${i}`)}" class="pagination-btn ${i == res.halamanAktif ? 'active' : ''}">${i}</a>`
    }
  } 





  if (res.halamanAktif < res.jumlahHalaman) {
    p +=  `
            <a href="${res.namaPencarian == 'Semua' ? baseUrl(`kasir?data=${res.data}&page=${res.halamanAktif + 1}`) : baseUrl(`kasir?data=${res.data}&nama=${res.namaPencarian}&page=${res.halamanAktif + 1}`)}" class="pagination-btn nb">
              <i class="fas fa-angle-right"></i>
            </a>
            <a href="${res.namaPencarian == 'Semua' ? baseUrl(`kasir?data=${res.data}&page=${res.jumlahHalaman}`) : baseUrl(`kasir?data=${res.data}&nama=${res.namaPencarian}&page=${res.jumlahHalaman}`)}" class="pagination-btn nb">
              <i class="fas fa-angle-double-right"></i>
            </a>
          `
  }

  return p
}

const componentModalProductChoice = opt => {
  const component = `
                      <div class="modal-box-container">
                        <div class="tcat mto">
                          <div class="product-header">
                            <h2>${opt.title}</h2>
                            <button class="fas fa-times"></button>
                          </div>
                          <form>
                            <div class="product-content">
                            ${opt.data.map(d => {
                              return  `
                                        <div class="list-p">
                                          <div class="simple-group">
                                            <label>Nama Barang</label>
                                            <p>${d.nama}</p>
                                          </div>
                                          <div class="simple-group">
                                            <label>Barcode</label>
                                            <p>${d.barcode}</p>
                                          </div>
                                          <div class="simple-group">
                                            <label>Satuan</label>
                                            <p>${d.satuan}</p> 
                                          </div>
                                          <button data-id="${d.id_barang}">Pilih</button>
                                        </div>
                                      `
                            }).join('')}
                            </div>
                          </form>
                        </div>
                      </div>
                    `
  return new DOMParser().parseFromString(component, 'text/html').body.firstChild;
}

const componentTableCashier = res => {
  const component =   `
                        <div class="css-contentxs">
                          <table border="0" class="tbl-c5">
                            <tbody>
                            ${res.products.map(p => {
                              return  `
                                        <tr>
                                          <td data-id="${p.id_barang}" data-nama="${p.nama}" data-satuan="${p.satuan}" data-barcode="${p.barcode}">${p.nama+' ('+p.satuan+')'}</td>
                                          <td>
                                            <div class="chg-act">
                                              <input type="text" value="${formatRupiah(p.harga)}" readonly>
                                            </div>
                                          </td>
                                          <td>
                                            <div class="qty">
                                              <button class="fas fa-minus ${parseInt(p.qty) == 1 ? 'disable' : ''}"></button>
                                              <input type="text" value="${p.qty}">
                                              <button class="fas fa-plus ${parseInt(p.qty) == parseInt(p.stok) ? 'disable' : ''}"></button>
                                            </div>
                                          </td>
                                          <td>${formatRupiah(parseInt(p.harga) * parseInt(p.qty))}</td>
                                          <td>
                                            <button data-id="${p.id_barang}" class="fas fa-trash-alt"></button>
                                          </td>
                                        </tr>
                                      `
                            }).join('')}
                            </tbody>
                          </table>
                        </div>
                      `
  return new DOMParser().parseFromString(component, 'text/html').body.firstChild;
}

const componentResult = () => {
  return  `
            <div class="simple-card">
              <div class="simple-data">
                <span>Invoice</span>
                <span>-</span>
              </div>
            </div>
            <div class="simple-card">
              <form>
                <div class="simple-data">
                  <span>Total</span>
                  <span class="total">Rp. 0</span>
                </div>
                <div class="simple-data">
                  <span>Bayar</span>
                  <input type="text" placeholder="Uang Bayar">
                </div>
                <div class="simple-data">
                  <span>Kembali</span>
                  <span class="total hutang">Rp. 0</span>
                </div>
                <div class="simple-data">
                  <button>Simpan Transaksi</button>
                </div>
              </form>
            </div>
          `
}

const runActionCartEvent = async () => {
  const tableContent = document.querySelectorAll('.cashier-container .cshr .css-cons1sc .css-contentxs table tbody tr td:nth-child(4)')
  const containerNama = document.querySelectorAll('.cashier-container .cshr .css-cons1sc .css-contentxs table tbody tr td:first-child')
  const containerHarga = document.querySelectorAll('.cashier-container .cshr .css-cons1sc .css-contentxs table tbody tr td .chg-act input')
  const containerQty = document.querySelectorAll('.cashier-container .cshr .css-cons1sc .css-contentxs table tbody tr td .qty')
  const containerSubTotal = document.querySelectorAll('.cashier-container .cshr .css-cons1sc .css-contentxs table tbody tr td:nth-child(4)')
  let total = 0
  const containerResult = document.querySelector('.cashier-container .cshr .css-rs')
  const containerInvoice = containerResult.querySelector('.simple-card:first-child .simple-data:first-child span:last-child')
  const form = containerResult.querySelector('.simple-card:last-child form')
  const containerTotal = containerResult.querySelector('.simple-card:last-child form .simple-data:first-child span:last-child')
  const containerBayar = containerResult.querySelector('.simple-card:last-child form .simple-data:nth-child(2) input')
  const containerKembali = containerResult.querySelector('.simple-card:last-child form .simple-data:nth-child(3) span:last-child')
  const saveTransactionBtn = containerResult.querySelector('.simple-card:last-child form .simple-data:last-child button')

  containerHarga.forEach((h,i) => {
    h.ondblclick = e => {
      if (h.classList.contains('active')) {
        h.classList.remove('active')
        h.readOnly  = true
      } else {
        h.classList.add('active')
        h.readOnly  = false
        forceEditByInputHarga(h,containerQty[i].querySelector('input'),containerSubTotal[i])
        h.onkeypress = e => {
          if (e.key == 'Enter') {
            h.classList.remove('active')
            h.readOnly  = true
          }
        }
      }
    }
  })

  containerQty.forEach((c,i) => {
    const minusBtn = c.querySelector('.fa-minus')
    const inputQty = c.querySelector('input')
    const plusBtn = c.querySelector('.fa-plus')
    const forceOption = {
      force: true,
      harga: containerHarga[i],
      subTotal: containerSubTotal[i]
    }
    eventQty(minusBtn,inputQty,plusBtn,forceOption)
  })

  const deleteCartItem = document.querySelectorAll('.cashier-container .cshr .css-cons1sc .css-contentxs table tbody tr td .fa-trash-alt')
  deleteCartItem.forEach(d => {
    d.onclick = async () => {
      formD = new FormData()
      formD.append('data','keranjang')
      formD.append('id',parseInt(d.dataset.id))

      res = await postData(baseUrl('service/deletedata'),formD)
      
      if (res.status) {
        YAXIS = pageYOffset
        setNotification(res.class,res.message,1500)
        loadCart()
      } else {
        setNotification(res.class,res.message,1500)
      }
    }
  })

  containerInvoice.textContent = await getInvoice()

  // count all of sub total start
  tableContent.forEach(t => {
    total += validPriceToStr(t.textContent)
  })
  containerTotal.textContent = formatRupiah(total)
  // count all of sub total end

  // bayar start
  validPrice(containerBayar)
  containerBayar.onkeyup = () => {
    if (validPriceToStr(containerBayar.value) == 0) {
      containerBayar.value = formatRupiah(0)
      containerKembali.textContent = showLiveKembalian(0,total,'Rp. ')
    } else {
      if (containerBayar.value == '') {
        containerBayar.value = ''
        containerKembali.textContent = showLiveKembalian(0,total,'Rp. ')
        containerKembali.classList.add('hutang')
      } else {
        containerBayar.value = formatRupiah(validPriceToStr(containerBayar.value))
        containerKembali.classList.remove('hutang')
        containerKembali.classList.remove('lunas')

        if (Number.isNaN(validPriceToStr(containerBayar.value))) {
          containerKembali.textContent = showLiveKembalian(0,total,'Rp. ')
        } else {
          containerKembali.textContent = showLiveKembalian(validPriceToStr(containerBayar.value),total,'Rp. ')
        }
  
        if (validPriceToStr(containerBayar.value) - total < 0) {
          containerKembali.classList.add('hutang')
        } else {
          containerKembali.classList.add('lunas')
        }
      }
    }
  }
  // bayar end

  // kembali start
  containerKembali.textContent = showLiveKembalian(0,total,'Rp. ')
  // kembali end

  form.onsubmit = async e => {
    e.preventDefault()
    statusHarga = false
    containerSubTotal.forEach(cS => {
      validPriceToStr(cS.textContent) == 0 ? statusHarga = true : ''
    })

    if (statusHarga) {
      setNotification('error','Pastikan harga tidak <strong>Rp. 0</strong>',2000)
    } else if (containerBayar.value == '' || Number.isNaN(validPriceToStr(containerBayar.value)) || validPriceToStr(containerBayar.value) == 0) {
      setNotification('error','Pastikan uang bayar tidak <strong>kosong/Rp. 0</strong>',2000)      
      containerBayar.focus()
    } else {
      formD = new FormData()
      formD.append('data','transaksi')
      formD.append('total',validPriceToStr(containerTotal.textContent))
      formD.append('bayar',validPriceToStr(containerBayar.value))
      formD.append('kembali',validPriceToStr(containerKembali.textContent))
      
      containerNama.forEach(cN => {
        formD.append('id[]',cN.dataset.id)
        formD.append('nama[]',cN.dataset.nama.trim().toUpperCase())
        formD.append('barcode[]',cN.dataset.barcode)
        formD.append('satuan[]',cN.dataset.satuan)
      })
      containerHarga.forEach(cH => {
        formD.append('harga[]',validPriceToStr(cH.value))
      })
      containerQty.forEach(cQ => {
        formD.append('jumlah[]',parseInt(cQ.querySelector('input').value))
      })
      containerSubTotal.forEach(cS => {
        formD.append('subtotal[]',validPriceToStr(cS.textContent))
      })
      saveTransactionBtn.textContent = 'Prosess...'
      res = await postData(baseUrl('service/adddata'),formD)

      if (res.status) {
        YAXIS = pageYOffset
        const modalOptions = {
          invoice: containerInvoice.textContent,
          tanggal: simpleDateView(await getDate()),
          total: containerTotal.textContent,
          bayar: containerBayar.value,
          kembali: containerKembali.textContent,
          class: validPriceToStr(containerKembali.textContent) < 0 ? 'hutang' : 'lunas',
          status: validPriceToStr(containerKembali.textContent) < 0 ? 'Hutang' : 'Lunas'
        }

        body.classList.add('modal-open')
        body.append(componentModalSuccessTransaction(modalOptions))
      
        const modalBoxContainer = document.querySelector('.modal-box-container')
        const modalTcat = modalBoxContainer.querySelector('.tcat')
      
        openModalBox(modalBoxContainer,modalTcat)

        const form = modalTcat.querySelector('form')
        const closeModalFooter = modalTcat.querySelectorAll('.product-footer button')[0]
        const printBtn = modalTcat.querySelectorAll('.product-footer button')[1]
      
        modalBoxContainer.onclick = e => {
          if (e.target.classList.contains('modal-box-container')) {
            closeModalBox(modalBoxContainer,modalTcat)
            loadCart()
          }
        }
        closeModalFooter.onclick = () => {
          closeModalBox(modalBoxContainer,modalTcat)
          loadCart()
        }
        printBtn.onclick = () => window.open(baseUrl(`service/print?data=transaksi&id=${containerInvoice.textContent}`,'_blank'))
        form.onsubmit = e => e.preventDefault()
      } else {
        setNotification(res.class,res.message,3000)
        saveTransactionBtn.innerHTML = 'Simpan Transaksi'
      }
    }
  }
}

const componentModal = (opt) => {
  const parser = new DOMParser();
  const component = 
                                ` 
                                  <div class="modal-box-container">
                                    <div class="tcat">
                                      <div class="product-header">
                                        <h2>${opt.title}</h2>
                                        <button class="fas fa-times"></button>
                                      </div>
                                      <form>
                                        <div class="product-content">
                                          ${opt.simpleGroup.map(s => {
                                            return  `
                                                      <div class="simple-group">
                                                        <label>${s.label}</label>
                                                        <p>${s.value}</p> 
                                                      </div>
                                                    `
                                          }).join('')}
                                          <div class="simple-group">
                                            <label>Harga</label>
                                            <div class="wrp">
                                              <div class="wrphh">
                                              ${opt.prices.map((p,i) => {
                                                return  `
                                                          <div class="wrpp">
                                                            <div class="wrph">
                                                              <label for="opt-satuan-${i}">${p.label}</label>
                                                              <input type="radio" name="harga" id="opt-satuan-${i}" data-harga="${p.value}">
                                                              <button class="fas fa-check"></button>
                                                            </div>
                                                            <div class="wrpc">
                                                              <label for="opt-satuan-${i}">${p.value}</label>
                                                            </div>
                                                          </div>        
                                                        `
                                              }).join('')}
                                              </div>
                                              <span>Harga wajib dipilih dan tidak boleh Rp. 0</span>
                                            </div> 
                                          </div>
                                          <div class="simple-group">
                                            <label>Jumlah</label>
                                            <div class="wrp">
                                              <div class="qty">
                                                <button class="fas fa-minus disable"></button>
                                                <input type="text" value="1" maxlength="3">
                                                <button class="fas fa-plus"></button>
                                              </div>
                                              <span>Jumlah pembelian minimal 1 barang</span>
                                            </div>
                                          </div>
                                        </div>
                                        <div class="product-footer">
                                        ${opt.btns.map(b => {
                                          return  `
                                                    <button type="${b.type}">${b.name}</button>  
                                                  `
                                        }).join('')}
                                        </div>
                                      </form>
                                    </div>
                                  </div>
                                `
  return parser.parseFromString(component, 'text/html').body.firstChild;
}

const componentModalPembeli = opt => {
  const parser = new DOMParser();
  const component = 
                                `  
                                  <div class="modal-box-container">
                                    <div class="smbc">
                                      <div class="smb-header">
                                        <h2>${opt.title}</h2>
                                        <button class="fas fa-times"></button>
                                      </div>
                                      <div class="smb-content">
                                        <div class="srch">
                                          <i class="fas fa-search"></i>
                                          <input type="text" placeholder="Cari ${opt.title}">
                                        </div>
                                        <ul id="list-container">
                                        ${opt.list.map((d,i) => {
                                          return  `
                                                    <li>
                                                      <label for="opt-satuan-${i}">${d}</label>
                                                      <input type="radio" name="opt-satuan" id="opt-satuan-${i}">
                                                      <button class="fas fa-check"></button>
                                                    </li>
                                                  `
                                        }).join('')}
                                          
                                        </ul>
                                      </div>
                                      <div class="smb-footer">
                                        <button class="crtns">
                                          <i class="fas fa-plus"></i>
                                          Buat pembeli baru
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                `
  return parser.parseFromString(component, 'text/html').body.firstChild;
}

const componentModalSuccessTransaction = opt => {
  const component = 
                                `  
                                  <div class="modal-box-container">
                                    <div class="tcat ts">
                                      <div class="product-header">
                                        <div class="ics active">
                                          <i class="fas fa-check"></i>
                                        </div>
                                        <h3>Transaksi Berhasil</h3>
                                      </div>
                                      <form>
                                        <div class="product-content">
                                          <div class="simple-group">
                                            <label>Invoice</label>
                                            <p>${opt.invoice}</p>
                                          </div>
                                          <div class="simple-group">
                                            <label>Tanggal</label>
                                            <p>${opt.tanggal}</p>
                                          </div>
                                          <div class="simple-group">
                                            <label>Total</label>
                                            <p>${opt.total}</p> 
                                          </div>
                                          <div class="simple-group">
                                            <label>Bayar</label>
                                            <p>${opt.bayar}</p> 
                                          </div>
                                          <div class="simple-group">
                                            <label>Kembali</label>
                                            <p>${opt.kembali}</p> 
                                          </div>
                                          <div class="simple-group">
                                            <label>Status</label>
                                            <p class="${opt.class}">${opt.status}</p> 
                                          </div>
                                        </div>
                                        <div class="product-footer">
                                          <button>Tutup</button>
                                          <button>Cetak Struk</button>
                                        </div>
                                      </form>
                                    </div>
                                  </div>
                                `
  return new DOMParser().parseFromString(component, 'text/html').body.firstChild;
}

const modalCart = async id => {  
  res = await getData(baseUrl('service/getsingledata?data=barang&id='+id))
  const modalOptions = {
    type: 'main',
    title: 'Tambah ke keranjang',
    simpleGroup: [
      {
        label: 'Nama Barang',
        value: res.result[0].nama
      },{
        label: 'Barcode',
        value: res.result[0].barcode
      },{
        label: 'Satuan',
        value: res.result[0].satuan
      },{
        label: 'Kategori',
        value: res.result[0].kategori
      },{
        label: 'Harga Pokok',
        value: formatRupiah(res.result[0].hargap)
      }
    ],
    prices: [
      {
        label: 'Harga Grosir',
        value: formatRupiah(res.result[0].hargag)
      },
      {
        label: 'Harga Eceran',
        value: formatRupiah(res.result[0].hargae)
      }
    ],
    btns: [
      {
        name: 'Tutup',
        type: 'reset'
      },
      {
        name: 'Tambah',
        type: 'submit'
      }
    ]
  }

  body.classList.add('modal-open')
  body.append(componentModal(modalOptions))

  const modalBoxContainer = document.querySelector('.modal-box-container')
  const modalTcat = modalBoxContainer.querySelector('.tcat')

  openModalBox(modalBoxContainer,modalTcat)

  const form = modalTcat.querySelector('form')
  const simpleGroup = form.querySelectorAll('.simple-group')
  const simpleGroupHarga = simpleGroup[5].querySelector('.wrp')
  const listBtnHarga = simpleGroupHarga.querySelectorAll('.wrphh .wrpp .wrph button')
  const listHarga = simpleGroupHarga.querySelectorAll('.wrphh .wrpp .wrph input[type="radio"]') 
  const simpleGroupJumlah = simpleGroup[6].querySelector('.wrp .qty')
  const minusBtn = simpleGroupJumlah.querySelector('.fa-minus')
  const inputQty = simpleGroupJumlah.querySelector('input')
  const plusBtn = simpleGroupJumlah.querySelector('.fa-plus')
  
  listBtnHarga.forEach((b,i) => {
    b.onclick = () => {
      listHarga[i].click()
    }
  })

  // input jumlah start
  const forceOption = {
    force: false
  }
  eventQty(minusBtn,inputQty,plusBtn,forceOption)
  // input jumlah end
  
  const closeModalHeader = modalTcat.querySelector('.product-header button')
  const closeModalFooter = modalTcat.querySelectorAll('.product-footer button')[0]
  const addToCart = modalTcat.querySelectorAll('.product-footer button')[1]

  modalBoxContainer.onclick = e => e.target.classList.contains('modal-box-container') ? closeModalBox(modalBoxContainer,modalTcat) : null
  closeModalHeader.onclick = () => closeModalBox(modalBoxContainer,modalTcat)
  closeModalFooter.onclick = () => closeModalBox(modalBoxContainer,modalTcat)
  addToCart.onclick = async () => {
    let harga = 0

    listHarga.forEach(h => {
      if (h.checked) {
        harga = validPriceToStr(h.dataset.harga)
      }
    })

    if (harga == 0 && parseInt(inputQty.value) == 0) {
      simpleGroupHarga.classList.add('warning')
      simpleGroupJumlah.parentElement.classList.add('warning')
    } else if (harga == 0) {
      simpleGroupHarga.classList.add('warning')
    } else if (parseInt(inputQty.value) == 0) {
      simpleGroupJumlah.parentElement.classList.add('warning')
    } else if (parseInt(res.result[0].stok) == 0) {
      setNotification('error','Stok tidak mencukupi',3000)
    } else {
      formD = new FormData()
      formD.append('data','keranjang')
      formD.append('id',id)
      formD.append('nama',modalOptions.simpleGroup[0].value.trim())
      formD.append('barcode',modalOptions.simpleGroup[1].value)
      formD.append('satuan',modalOptions.simpleGroup[2].value)
      formD.append('qty',parseInt(inputQty.value))
      formD.append('harga',harga)

      addToCart.innerHTML = '<div class="loading"></div>'
      res = await postData(baseUrl('service/adddata'),formD)

      if (res.status) {
        YAXIS = pageYOffset
        setNotification(res.class,res.message,2000)
        closeModalBox(modalBoxContainer,modalTcat)
        loadCart()
      } else {
        setNotification(res.class,res.message,2000)
        addToCart.innerHTML = 'Simpan'
      }
    }

  }
  form.onsubmit = e => e.preventDefault()
}

const eventQty = (minusBtn,inputQty,plusBtn,frc) => {
  minusBtn.onclick = () => {
    inputQty.value = parseInt(inputQty.value) - 1
    if (parseInt(inputQty.value) <= 1) {
      inputQty.value = 1
      minusBtn.classList.add('disable')
      forceSubTotal(frc,inputQty)
    } else {
      plusBtn.classList.remove('disable')
      forceSubTotal(frc,inputQty)
    }
  }

  inputQty.onkeypress = e => allowOnlyNumeric(e)
  inputQty.oninput = () => {
    if (Number.isNaN(parseInt(inputQty.value))) {
      inputQty.value = 0
      minusBtn.classList.add('disable')
      plusBtn.classList.remove('disable')
      forceSubTotal(frc,inputQty)
    } else {
      inputQty.value = parseInt(inputQty.value)

      if (parseInt(inputQty.value) <= 1) {
        inputQty.value = 1
        minusBtn.classList.add('disable')
        plusBtn.classList.remove('disable')
      } else {
        minusBtn.classList.remove('disable')
        plusBtn.classList.remove('disable')
      }
      forceSubTotal(frc,inputQty)
    }
  }

  plusBtn.onclick = () => {
    inputQty.value = parseInt(inputQty.value) + 1
    minusBtn.classList.remove('disable')
    forceSubTotal(frc,inputQty)
  }
}

const forceEditByInputHarga = (inpH,inpQ,subTo) => {
  validPrice(inpH)
  inpH.onkeyup = () => {
    if (inpH.value == '') {
      inpH.value = formatRupiah(0)
    } else {
      inpH.value = formatRupiah(validPriceToStr(inpH.value))
    }
    subTo.textContent = formatRupiah(validPriceToStr(inpH.value) * parseInt(inpQ.value))
    forceTotal()
  }
}

const forceSubTotal = (frc,inputQty) => {
  if (frc.force) {
    frc.subTotal.textContent = formatRupiah(validPriceToStr(frc.harga.value) * parseInt(inputQty.value))
    forceTotal()
  }
}

const forceTotal = () => {
  let total = 0
  const containerResult = document.querySelector('.cashier-container .cshr .css-rs')
  const tableContent = document.querySelectorAll('.cashier-container .cshr .css-cons1sc .css-contentxs table tbody tr td:nth-child(4)')
  const containerTotal = containerResult.querySelector('.simple-card:last-child form .simple-data:first-child span:last-child')
  const containerBayar = containerResult.querySelector('.simple-card:last-child form .simple-data:nth-child(2) input')
  const containerKembali = containerResult.querySelector('.simple-card:last-child form .simple-data:nth-child(3) span:last-child')

  tableContent.forEach(t => {
    total += validPriceToStr(t.textContent)
  })
  containerTotal.textContent = formatRupiah(total)

  // bayar start
  containerBayar.value = ''

  validPrice(containerBayar)
  containerBayar.onkeyup = () => {
    if (validPriceToStr(containerBayar.value) == 0) {
      containerBayar.value = formatRupiah(0)
      containerKembali.textContent = showLiveKembalian(0,total,'Rp. ')
    } else {
      if (containerBayar.value == '') {
        containerBayar.value = ''
        containerKembali.textContent = showLiveKembalian(0,total,'Rp. ')
        containerKembali.classList.add('hutang')
      } else {
        containerBayar.value = formatRupiah(validPriceToStr(containerBayar.value))
        containerKembali.classList.remove('hutang')
        containerKembali.classList.remove('lunas')

        if (Number.isNaN(validPriceToStr(containerBayar.value))) {
          containerKembali.textContent = showLiveKembalian(0,total,'Rp. ')
        } else {
          containerKembali.textContent = showLiveKembalian(validPriceToStr(containerBayar.value),total,'Rp. ')
        }
  
        if (validPriceToStr(containerBayar.value) - total < 0) {
          containerKembali.classList.add('hutang')
        } else {
          containerKembali.classList.add('lunas')
        }
      }
    }
  }
  // bayar end

  // kembali start
  if (containerBayar.value == '') {
    containerKembali.classList.remove('lunas')
    containerKembali.classList.add('hutang')
  } 
  containerKembali.textContent = showLiveKembalian(0,total,'Rp. ')
  // kembali end
}

const getInvoice = async () => {
  res = await getData(baseUrl('service/getinvoice'))
  return res.invoice
}

const getDate = async () => {
  res = await getData(baseUrl('service/getdate'))
  return res.date
}

const autocomplete = (inp,list,cP,modalBoxContainer,modalSmbc) => {
  const listContainer = document.getElementById('list-container')
  let x = ''
  inp.oninput = () => {
    val = inp.value;
    if (val == '') {
      listContainer.innerHTML = list.map((l,i) => {
        return  `
                  <li>
                    <label for="opt-satuan-${i}"><strong>${l.substr(0,val.length)}</strong>${l.substr(val.length)}</label>
                    <input type="radio" name="opt-satuan" id="opt-satuan-${i}">
                    <button class="fas fa-check"></button>
                  </li>
                `
      }).join('')
    } else {
      listContainer.innerHTML = list.map((l,i) => {
        if (l.substr(0,val.length).toUpperCase() == val.toUpperCase()) {
          return  `
                    <li>
                      <label for="opt-satuan-${i}"><strong>${l.substr(0,val.length)}</strong>${l.substr(val.length)}</label>
                      <input type="radio" name="opt-satuan" id="opt-satuan-${i}">
                      <button class="fas fa-check"></button>
                    </li>
                  `
        }
      }).join('')
    }
    
    const listSatuan = listContainer.querySelectorAll('.smb-content ul li')
    listSatuan.forEach(l => {
      l.onclick = () => {
        setTimeout(() => {
          cP.textContent = l.querySelector('label').textContent.trim()
          l.querySelector('input').checked
          closeModalBox(modalBoxContainer,modalSmbc)
        }, 300);
      }
    })
  }
}


// ------------------------------------- arrow functions end ------------------------------------






























