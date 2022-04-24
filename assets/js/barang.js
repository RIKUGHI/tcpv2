const body = document.body
let YAXIS = 0
const loadData = async url => {
  const containerData = document.querySelector('main .css-cons1s')
  const containerDataTitle = containerData.querySelector('.css-headxs h3')
  const containerPagination = document.querySelector('main .pagination-container')
  
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
const addBtn = document.getElementById('addDataBtn')

loadData(location.search == '' ? '?data=barang' : location.search)

// ----------------------------------- search data barang start -----------------------------------
const formSearch = document.querySelector('main .css-sj1k2s .css-wrap12 form')
formSearch.onsubmit = e => {
  e.preventDefault()
  if (formSearch.querySelector('input').value == '') {
    location.href = baseUrl('master/barang')
  } else {
    location.href = baseUrl('master/barang?data=barang&nama='+formSearch.querySelector('input').value)
  }
}
// ----------------------------------- search data barang end -----------------------------------

// ----------------------------------- export start -----------------------------------
const exportBtn = document.querySelector('main .css-sj1k2s .css-exprt1')
exportBtn.onclick = () => {
  location.replace(baseUrl('service/exportbarang'))
}
// ----------------------------------- export end -----------------------------------


// ----------------------------------- add data barang start -----------------------------------
addBtn.onclick = () => {
  const modalOptions = {
    type: 'main',
    title: 'Tambah Barang',
    formGroup: [
      {
        label: 'Nama Barang',
        warningMessage: 'Nama Barang Wajib Diisi'
      },{
        label: 'Barcode',
        warningMessage: 'Barcode Wajib Diisi'
      },{
        label: 'Harga Pokok',
        warningMessage: 'Harga Pokok Wajib Diisi'
      }
    ],
    dataGroup: [
      {
        formGroup: [
          {
            label: 'Satuan',
            warningMessage: 'Satuan Wajib Diisi',
            readOnly: true
          },{
            label: 'Kategori',
            warningMessage: 'Kategori Wajib Diisi',
            readOnly: true
          }
        ]
      },
      {
        formGroup: [
          {
            label: 'Harga Grosir',
            warningMessage: 'Harga Grosir Wajib Diisi',
            readOnly: false
          },{
            label: 'Harga Eceran',
            warningMessage: 'Harga Eceran Wajib Diisi',
            readOnly: false
          }
        ]
      }
    ],
    btns: [
      {
        name: 'Batal',
        type: 'reset'
      },
      {
        name: 'Simpan',
        type: 'submit'
      }
    ]
  }
  body.classList.add('modal-open')
  body.append(componentModal(modalOptions))

  const modalBoxContainer = document.querySelector('.modal-box-container')
  const modalProduct = modalBoxContainer.querySelector('.css-product')

  openModalBox(modalBoxContainer,modalProduct)

  const form = modalProduct.querySelector('form')
  const formGroup = form.querySelectorAll('.product-content .form-group')
  const closeModalHeader = modalProduct.querySelector('.product-header button')
  const closeModalFooter = modalProduct.querySelectorAll('.product-footer button')[0]
  const savedataBtn = modalProduct.querySelectorAll('.product-footer button')[1]

  // validation start
  inputBarcode = formGroup[1].querySelector('input')
  inputBarcode.onkeypress = e => e.key == 'Enter' ? null : allowOnlyNumeric(e)

  inputhargaP = formGroup[2].querySelector('input')
  validPrice(inputhargaP)

  inputhargaG = formGroup[5].querySelector('input')
  validPrice(inputhargaG)

  inputhargaE = formGroup[6].querySelector('input')
  validPrice(inputhargaE)
  // validation end

  // event handler start
  formGroup[3].querySelector('input').onclick = async () => {
    res = await getData(baseUrl('service/getdata?data=satuan'))

    const modalOptions = {
      type: 'sub',
      title: 'Satuan',
      list: res.products.map(l => l.nama)
    }

    runSubModalBox(formGroup[3],modalOptions)
  }

  formGroup[4].querySelector('input').onclick = async () => {
    res = await getData(baseUrl('service/getdata?data=kategori'))

    const modalOptions = {
      type: 'sub',
      title: 'Kategori',
      list: res.products.map(l => l.nama)
    }

    runSubModalBox(formGroup[4],modalOptions)
  }

  modalBoxContainer.onclick = e => e.target.classList.contains('modal-box-container') ? closeModalBox(modalBoxContainer,modalProduct) : null
  closeModalHeader.onclick = () => closeModalBox(modalBoxContainer,modalProduct)
  closeModalFooter.onclick = () => closeModalBox(modalBoxContainer,modalProduct)
  savedataBtn.onclick = () => {}

  form.onsubmit = async e => {
    e.preventDefault()
    if (formGroup[0].querySelector('input').value == '' || 
        formGroup[2].querySelector('input').value == '' || 
        formGroup[3].querySelector('input').value == '' || 
        formGroup[4].querySelector('input').value == '') {
      formGroup.forEach((l,i) => {
        if (i != 1 && i != 5 && i != 6 && l.querySelector('input').value == '') {
          l.classList.add('warning')
        }
      })
    } else {
      formD = new FormData()
      formD.append('data','barang')
      formD.append('nama',formGroup[0].querySelector('input').value.trim().toUpperCase())
      formD.append('barcode',formGroup[1].querySelector('input').value.trim())
      formD.append('hargap',validPriceToStr(formGroup[2].querySelector('input').value.trim()))
      formD.append('satuan',formGroup[3].querySelector('input').value.trim().toUpperCase())
      formD.append('kategori',formGroup[4].querySelector('input').value.trim().toUpperCase())
      formD.append('hargag',validPriceToStr(formGroup[5].querySelector('input').value.trim()))
      formD.append('hargae',validPriceToStr(formGroup[6].querySelector('input').value.trim()))

      savedataBtn.innerHTML = '<div class="loading"></div>'
      res = await postData(baseUrl('service/adddata'),formD)

      if (res.status) {
        YAXIS = 0
        setNotification(res.class,res.message,3000)
        closeModalBox(modalBoxContainer,modalProduct)
        loadData('?data=barang')
      } else {
        setNotification(res.class,res.message,3000)
        savedataBtn.innerHTML = 'Simpan'
      }
    }
  }
  // event handler end
}
// ----------------------------------- add data barang end -----------------------------------


// ------------------------------------- arrow functions start ------------------------------------
const componentModal = (opt) => {
  const parser = new DOMParser();
  const component = 
                                `  
                                  <div class="modal-box-container">
                                  ${(() => {
                                    if (opt.type == 'main' || opt.type == 'edit') {
                                      return `
                                              <div class="css-product">
                                                <div class="product-header">
                                                  <h2>${opt.title}</h2>
                                                  <button class="fas fa-times"></button>
                                                </div>
                                                <form>
                                                  <div class="product-content">
                                                  ${opt.formGroup.map(d => {
                                                    return  `
                                                              <div class="form-group">
                                                                <label>${d.label}</label>
                                                                <input type="text" autocomplete="off" ${d.value == undefined ? '' : `value="${d.value}"`}> 
                                                                <span>${d.warningMessage}</span>
                                                              </div>
                                                            `
                                                  }).join('')}
                                                  ${opt.dataGroup.map(d => {
                                                    return  `
                                                              <div class="data-group">
                                                              ${d.formGroup.map(l => {
                                                                return  `
                                                                          <div class="form-group">
                                                                            <label>${l.label}</label>
                                                                            <input type="text" autocomplete="off" ${l.readOnly ? 'readonly' : ''} ${l.value == undefined ? '' : `value="${l.value}"`}> 
                                                                            <span>${l.warningMessage}</span>
                                                                          </div>
                                                                        `
                                                              }).join('')}
                                                              </div>
                                                            `
                                                  }).join('')}
                                                  </div>
                                                  <div class="product-footer">
                                                  ${opt.btns.map(d => {
                                                    return  `
                                                              <button type="${d.type}">${d.name}</button>
                                                            `
                                                  }).join('')}
                                                  </div>
                                                </form>
                                              </div>
                                            `
                                    } else if (opt.type == 'sub'){
                                      return  `
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
                                                      Buat baru
                                                    </button>
                                                  </div>
                                                </div>
                                              `
                                    } else if (opt.type == 'detail') {
                                      return  `
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
                                                                  <p>${s.content}</p>
                                                                </div>
                                                              `
                                                    }).join('')}
                                                      
                                                    </div>
                                                    <div class="product-footer">
                                                    ${opt.btns.map(b => {
                                                      return  `<button>${b.name}</button>`
                                                    }).join('')}
                                                    </div>
                                                  </form>
                                                </div>
                                              `
                                    } else if (opt.type == 'delete'){
                                      return  `
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
                                              `
                                    }
                                  })()}
                                  </div>
                                `
  return parser.parseFromString(component, 'text/html').body.firstChild;
}

const componentTable = res => {
  const component =  `
                        <table border="0" class="tbl-c8">
                          <tbody>
                          ${res.products.map(r => {
                            return  `
                                      <tr>
                                        <td>${res.awalData++ + 1}</td>
                                        <td>${r.nama}</td>
                                        <td>${r.barcode}</td>
                                        <td>${formatRupiah(r.hargap)}</td>
                                        <td>${formatRupiah(r.hargag)}</td>
                                        <td>${formatRupiah(r.hargae)}</td>
                                        <td>
                                          <div class="action" data-id="${r.id_barang}" data-nama="${r.nama}">
                                            <button class="far fa-eye"></button>
                                            <button class="fas fa-pen"></button>
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
    p +=  `
            <a href="${baseUrl('master/barang')}" class="pagination-btn nb">
              <i class="fas fa-angle-double-left"></i>
            </a>
            <a href="${res.namaPencarian == 'Semua' ? baseUrl(`master/barang?data=${res.data}&page=${res.halamanAktif - 1}`) : baseUrl(`master/barang?data=${res.data}&nama=${res.namaPencarian}&page=${res.halamanAktif - 1}`)}" class="pagination-btn nb">
              <i class="fas fa-angle-left"></i>
            </a>
          `
  }

  if (res.jumlahHalaman > 5) {
    if (res.halamanAktif >= 3 && res.halamanAktif < res.jumlahHalaman - 2) {
      for (let i = res.halamanAktif - 2; i <= res.halamanAktif + 2; i++) {
        p += `<a href="${res.namaPencarian == 'Semua' ? baseUrl(`master/barang?data=${res.data}&page=${i}`) : baseUrl(`master/barang?data=${res.data}&nama=${res.namaPencarian}&page=${i}`)}" class="pagination-btn ${i == res.halamanAktif ? 'active' : ''}">${i}</a>`
      }
    }else if (res.halamanAktif >= res.jumlahHalaman - 2){
      for (let i = res.jumlahHalaman - 4; i <= res.jumlahHalaman; i++) {
        p += `<a href="${res.namaPencarian == 'Semua' ? baseUrl(`master/barang?data=${res.data}&page=${i}`) : baseUrl(`master/barang?data=${res.data}&nama=${res.namaPencarian}&page=${i}`)}" class="pagination-btn ${i == res.halamanAktif ? 'active' : ''}">${i}</a>`
      }
    }else{
      for (let i = 1; i <= 5; i++) {
        p += `<a href="${res.namaPencarian == 'Semua' ? baseUrl(`master/barang?data=${res.data}&page=${i}`) : baseUrl(`master/barang?data=${res.data}&nama=${res.namaPencarian}&page=${i}`)}" class="pagination-btn ${i == res.halamanAktif ? 'active' : ''}">${i}</a>`
      }
    }
  } else {
    for (let i = 1; i <= res.jumlahHalaman; i++) {
      p += `<a href="${res.namaPencarian == 'Semua' ? baseUrl(`master/barang?data=${res.data}&page=${i}`) : baseUrl(`master/barang?data=${res.data}&nama=${res.namaPencarian}&page=${i}`)}" class="pagination-btn ${i == res.halamanAktif ? 'active' : ''}">${i}</a>`
    }
  } 





  if (res.halamanAktif < res.jumlahHalaman) {
    p +=  `
            <a href="${res.namaPencarian == 'Semua' ? baseUrl(`master/barang?data=${res.data}&page=${res.halamanAktif + 1}`) : baseUrl(`master/barang?data=${res.data}&nama=${res.namaPencarian}&page=${res.halamanAktif + 1}`)}" class="pagination-btn nb">
              <i class="fas fa-angle-right"></i>
            </a>
            <a href="${res.namaPencarian == 'Semua' ? baseUrl(`master/barang?data=${res.data}&page=${res.jumlahHalaman}`) : baseUrl(`master/barang?data=${res.data}&nama=${res.namaPencarian}&page=${res.jumlahHalaman}`)}" class="pagination-btn nb">
              <i class="fas fa-angle-double-right"></i>
            </a>
          `
  }

  return p
}

const runActionEvent = () => {
  const containerAction = document.querySelectorAll('main .css-cons1s table tbody tr td .action')
  containerAction.forEach(c => {
    c.querySelector('.fa-eye').onclick = () => modalDetail(c.dataset.id)
    c.querySelector('.fa-pen').onclick = () => modalEdit(c.dataset.id)
    c.querySelector('.fa-trash-alt').onclick = () => modalDelete(c.dataset.nama,c.dataset.id)
  })
}

const runSubModalBox = (formGroup,opt) => {
  body.append(componentModal(opt))
  const modalBoxContainer = document.querySelectorAll('.modal-box-container')[1]
  const modalSmbc = modalBoxContainer.querySelector('.smbc')
  const inputAutoCom = modalSmbc.querySelector('.smb-content .srch input')
  const listSatuan = modalSmbc.querySelectorAll('.smb-content ul li')

  // search satuan
  autocomplete(inputAutoCom,opt.list,formGroup,modalBoxContainer,modalSmbc);

  openModalBox(modalBoxContainer,modalSmbc)

  // checklist satuan
  listSatuan.forEach(l => {
    l.onclick = () => {
      setTimeout(() => {
        formGroup.querySelector('input').value = l.querySelector('label').textContent.trim()
        l.querySelector('input').checked
        closeModalBox(modalBoxContainer,modalSmbc)
      }, 300);
    }
  })

  // create new satuan
  const smbFooter = modalSmbc.querySelector('.smb-footer')
  const closeModalHeader = modalSmbc.querySelector('.smb-header button')
  const createNewSatuan = modalSmbc.querySelectorAll('.smb-footer button')[0]

  modalBoxContainer.onclick = e => e.target.classList.contains('modal-box-container') ? closeModalBox(modalBoxContainer,modalSmbc) : null
  closeModalHeader.onclick = () => closeModalBox(modalBoxContainer,modalSmbc)
  createNewSatuan.onclick = () => {
    smbFooter.innerHTML =   `
                              <input type="text" placeholder="Masukan nama baru">
                              <button>Buat</button>
                            `
    const savedataBtn = smbFooter.querySelector('button')
    savedataBtn.onclick = () => {
      if (smbFooter.querySelector('input').value == '') {
        setNotification('error','Input tidak boleh kosong',2000)
        smbFooter.querySelector('input').focus()
      } else {
        formGroup.querySelector('input').value = smbFooter.querySelector('input').value.trim()
        closeModalBox(modalBoxContainer,modalSmbc)
      }
    }
  }
}

const   autocomplete = (inp,list,formGroup,modalBoxContainer,modalSmbc) => {
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
          formGroup.querySelector('input').value = l.querySelector('label').textContent.trim()
          l.querySelector('input').checked
          closeModalBox(modalBoxContainer,modalSmbc)
        }, 300);
      }
    })
  }
}

const modalDetail = async id => {
  res = await getData(baseUrl('service/getsingledata?data=barang&id='+id))
  const modalOptions = {
    type: 'detail',
    title: 'Detail Barang',
    simpleGroup: [
      {
        label: 'Nama Barang',
        content: res.result[0].nama
      },{
        label: 'Barcode',
        content: res.result[0].barcode
      },{
        label: 'Harga Pokok',
        content: formatRupiah(res.result[0].hargap)
      },{
        label: 'Harga Grosir',
        content: formatRupiah(res.result[0].hargag)
      },{
        label: 'Harga Eceran',
        content: formatRupiah(res.result[0].hargae)
      },{
        label: 'Satuan',
        content: res.result[0].satuan
      },{
        label: 'Kategori',
        content: res.result[0].kategori
      }
    ],
    btns: [
      {
        name: 'Tutup',
        type: 'reset'
      },
      {
        name: 'Ok',
        type: 'reset'
      }
    ]
  }

  body.classList.add('modal-open')
  body.append(componentModal(modalOptions))

  const modalBoxContainer = document.querySelector('.modal-box-container')
  const modalTcat = modalBoxContainer.querySelector('.tcat')

  openModalBox(modalBoxContainer,modalTcat)

  const form = modalTcat.querySelector('form')
  const closeModalHeader = modalTcat.querySelector('.product-header button')
  const closeModalFooter = modalTcat.querySelectorAll('.product-footer button')[0]
  const closeOkFooter = modalTcat.querySelectorAll('.product-footer button')[1]

  modalBoxContainer.onclick = e => e.target.classList.contains('modal-box-container') ? closeModalBox(modalBoxContainer,modalTcat) : null
  closeModalHeader.onclick = () => closeModalBox(modalBoxContainer,modalTcat)
  closeModalFooter.onclick = () => closeModalBox(modalBoxContainer,modalTcat)
  closeOkFooter.onclick = () => closeModalBox(modalBoxContainer,modalTcat)
  form.onsubmit = e => e.preventDefault()
}

const modalEdit = async id => {
  res = await getData(baseUrl('service/getsingledata?data=barang&id='+id))

  const modalOptions = {
    type: 'edit',
    title: 'Ubah Barang',
    formGroup: [
      {
        label: 'Nama Barang',
        warningMessage: 'Nama Barang Wajib Diisi',
        value: res.result[0].nama
      },{
        label: 'Barcode',
        warningMessage: 'Barcode Wajib Diisi',
        value: res.result[0].barcode
      },{
        label: 'Harga Pokok',
        warningMessage: 'Harga Pokok Wajib Diisi',
        value: formatRupiah(res.result[0].hargap)
      }
    ],
    dataGroup: [
      {
        formGroup: [
          {
            label: 'Satuan',
            warningMessage: 'Satuan Wajib Diisi',
            readOnly: true,
            value: res.result[0].satuan
          },{
            label: 'Kategori',
            warningMessage: 'Kategori Wajib Diisi',
            readOnly: true,
            value: res.result[0].kategori
          }
        ]
      },
      {
        formGroup: [
          {
            label: 'Harga Grosir',
            warningMessage: 'Harga Grosir Wajib Diisi',
            readOnly: false,
            value: formatRupiah(res.result[0].hargag)
          },{
            label: 'Harga Eceran',
            warningMessage: 'Harga Eceran Wajib Diisi',
            readOnly: false,
            value: formatRupiah(res.result[0].hargae)
          }
        ]
      }
    ],
    btns: [
      {
        name: 'Batal',
        type: 'reset'
      },
      {
        name: 'Simpan',
        type: 'submit'
      }
    ]
  }
  body.classList.add('modal-open')
  body.append(componentModal(modalOptions))

  const modalBoxContainer = document.querySelector('.modal-box-container')
  const modalProduct = modalBoxContainer.querySelector('.css-product')

  openModalBox(modalBoxContainer,modalProduct)

  const form = modalProduct.querySelector('form')
  const formGroup = form.querySelectorAll('.product-content .form-group')
  const closeModalHeader = modalProduct.querySelector('.product-header button')
  const closeModalFooter = modalProduct.querySelectorAll('.product-footer button')[0]
  const savedataBtn = modalProduct.querySelectorAll('.product-footer button')[1]

  // validation start
  inputBarcode = formGroup[1].querySelector('input')
  inputBarcode.onkeypress = e => e.key == 'Enter' ? null : allowOnlyNumeric(e)

  inputhargaP = formGroup[2].querySelector('input')
  validPrice(inputhargaP)

  inputhargaG = formGroup[5].querySelector('input')
  validPrice(inputhargaG)

  inputhargaE = formGroup[6].querySelector('input')
  validPrice(inputhargaE)
  // validation end

  // event handler start
  formGroup[3].querySelector('input').onclick = async () => {
    res = await getData(baseUrl('service/getdata?data=satuan'))

    const modalOptions = {
      type: 'sub',
      title: 'Satuan',
      list: res.products.map(l => l.nama)
    }
    runSubModalBox(formGroup[3],modalOptions)
  }

  formGroup[4].querySelector('input').onclick = async () => {
    res = await getData(baseUrl('service/getdata?data=kategori'))

    const modalOptions = {
      type: 'sub',
      title: 'Kategori',
      list: res.products.map(l => l.nama)
    }
    runSubModalBox(formGroup[4],modalOptions)
  }

  modalBoxContainer.onclick = e => e.target.classList.contains('modal-box-container') ? closeModalBox(modalBoxContainer,modalProduct) : null
  closeModalHeader.onclick = () => closeModalBox(modalBoxContainer,modalProduct)
  closeModalFooter.onclick = () => closeModalBox(modalBoxContainer,modalProduct)
  savedataBtn.onclick = () => {}

  form.onsubmit = async e => {
    e.preventDefault()
    if (formGroup[0].querySelector('input').value == '' || 
        formGroup[2].querySelector('input').value == '' || 
        formGroup[3].querySelector('input').value == '' || 
        formGroup[4].querySelector('input').value == '') {
      formGroup.forEach((l,i) => {
        if (i != 1 && i != 5 && i != 6 && l.querySelector('input').value == '') {
          l.classList.add('warning')
        }
      })
    } else if (parseInt(formGroup[3].querySelector('input').value) == 0) {
      setNotification('error','Stok minimal 1',2000)
    } else {
      formD = new FormData()
      formD.append('data','barang')
      formD.append('id',id)
      formD.append('nama',formGroup[0].querySelector('input').value.trim().toUpperCase())
      formD.append('barcode',formGroup[1].querySelector('input').value.trim())
      formD.append('hargap',validPriceToStr(formGroup[2].querySelector('input').value.trim()))
      formD.append('satuan',formGroup[3].querySelector('input').value.trim().toUpperCase())
      formD.append('kategori',formGroup[4].querySelector('input').value.trim().toUpperCase())
      formD.append('hargag',validPriceToStr(formGroup[5].querySelector('input').value.trim()))
      formD.append('hargae',validPriceToStr(formGroup[6].querySelector('input').value.trim()))

      savedataBtn.innerHTML = '<div class="loading"></div>'
      res = await postData(baseUrl('service/updatedata'),formD)

      if (res.status) {
        YAXIS = pageYOffset
        setNotification(res.class,res.message,3000)
        closeModalBox(modalBoxContainer,modalProduct)
        loadData(location.search == '' ? '?data=barang' : location.search)
      } else {
        setNotification(res.class,res.message,3000)
        savedataBtn.innerHTML = 'Simpan'
      }
    }
  }
  // event handler end
}

const modalDelete = async (n,id) => {
  const modalOptions = {
    type: 'delete',
    title: `Apakah Yakin Ingin Menghapus Barang <br> <strong>${n}</strong>`,
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
    formD.append('data','barang')
    formD.append('id',parseInt(id))

    yesBtn.innerHTML = '<div class="loading"></div>'
    res = await postData(baseUrl('service/deletedata'),formD)
    
    if (res.status) {
      YAXIS = pageYOffset
      setNotification(res.class,res.message,1500)
      closeModalBox(modalBoxContainer,modalTcat)
      loadData(location.search == '' ? '?data=barang' : location.search)
    } else {
      setNotification(res.class,res.message,1500)
      yesBtn.innerHTML = 'Iya'
    }
  }
}

// ------------------------------------- arrow functions end ------------------------------------





















