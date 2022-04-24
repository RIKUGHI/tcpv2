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

loadData(location.search == '' ? '?data=pembelian' : location.search)

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

// ----------------------------------- search data pembelian start -----------------------------------
const formSearch = document.querySelector('main .css-sj1k2s .css-wrap12 form')
formSearch.onsubmit = e => {
  e.preventDefault()

  if (formSearch.querySelectorAll('input').length == 1) {
    if (formSearch.querySelector('input').value == '') {
      location.href = baseUrl('transaksi/pembelian')
    } else {
      location.href = baseUrl('transaksi/pembelian?data=pembelian&nama='+formSearch.querySelector('input').value)
    }
  } else {
    start = formSearch.querySelectorAll('input')[0]
    end = formSearch.querySelectorAll('input')[1]

    if (start.value == '' || end.value == '') {
      setNotification('error','Inputan pencarian per periode, awal dan akhir tidak boleh kosong',3000)
    } else {
      location.href = baseUrl(`transaksi/pembelian?data=pembelian&jenis=perperiode&start=${start.value}&end=${end.value}`)
    }
  }

}

const all = () => {
  formSearch.removeAttribute('class')
  formSearch.innerHTML =  `
                            <input type="text" placeholder="Cari Nama Supplier">
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
// ----------------------------------- search data pembelian end -----------------------------------

// ----------------------------------- add data pembelian start -----------------------------------
addBtn.onclick = () => {
  const modalOptions = {
    type: 'main',
    title: 'Tambah Pembelian',
    formGroup: [
      {
        label: 'Catatan',
        warningMessage: 'Catatan Wajib Diisi'
      }
    ],
    dataGroup: [
      {
        formGroup: [
          {
            label: 'Supplier',
            warningMessage: 'Supplier Wajib Diisi',
            readOnly: true
          },{
            label: 'Tanggal',
            warningMessage: 'Tanggal Wajib Diisi',
            readOnly: true
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
  let files
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
  const uploadArea = formGroup[0].querySelector('.upload-area')
  const photoFiles = uploadArea.querySelector('input[type="file"]')
  const previewPhotoContainer = formGroup[1].querySelector('.preview')

  // event handler start
  uploadArea.onclick = () => {
    photoFiles.click()
  }
  
  photoFiles.onchange = () => {
    showFile(photoFiles,previewPhotoContainer)
  }

  formGroup[2].querySelector('input').onclick = async () => {
    res = await getData(baseUrl('service/getdata?data=supplier'))

    const modalOptions = {
      type: 'sub',
      title: 'Supplier',
      list: res.products.map(l => l.nama)
    }

    runSubModalBox(formGroup[2],modalOptions)
  }


  modalBoxContainer.onclick = e => {
    if (e.target.classList.contains('modal-box-container')) {
      closeModalBox(modalBoxContainer,modalProduct)
      getAllFile = []
    }
  }
  closeModalHeader.onclick = () => closeModalBox(modalBoxContainer,modalProduct), getAllFile = []
  closeModalFooter.onclick = () => closeModalBox(modalBoxContainer,modalProduct), getAllFile = []
  savedataBtn.onclick = () => {}

  form.onsubmit = async e => {
    e.preventDefault()

    if (getAllFile.length == 0 || formGroup[2].querySelector('input').value == '' || formGroup[3].querySelector('input').value == '') {
      getAllFile.length == 0 ? setNotification('error','Minimal 1 foto',1000) : ''
      formGroup.forEach((l,i) => {
        if (i != 1 && i != 4 && l.querySelector('input').value == '') {
          l.classList.add('warning')
        }
      })
    } else {
      formD = new FormData()
      formD.append('data','pembelian')
      formD.append('supplier',formGroup[2].querySelector('input').value.trim().toUpperCase())
      formD.append('tanggal',formGroup[3].querySelector('input').value.trim())
      formD.append('catatan',formGroup[4].querySelector('textarea').value.trim().toUpperCase())
      for (const file of getAllFile) {
        formD.append('berkas_gambar[]', file)
      }

      savedataBtn.innerHTML = '<div class="loading"></div>'
      res = await postData(baseUrl('service/adddata'),formD)

      if (res.status) {
        YAXIS = 0
        setNotification(res.class,res.message,4000)
        closeModalBox(modalBoxContainer,modalProduct)
        loadData('?data=pembelian')
        getAllFile = []
      } else {
        setNotification(res.class,res.message,4000)
        savedataBtn.innerHTML = 'Simpan'
      }
    }
  }
  // event handler end
}
// ----------------------------------- add data pembelian end -----------------------------------


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
                                                    <div class="form-group">
                                                      <div class="upload-area">
                                                        <input type="file" multiple hidden> 
                                                        <i class="fas fa-cloud-upload-alt"></i>
                                                        <p>Browse File to Upload</p>
                                                        <p>Foto Minimal 1</p>
                                                      </div>
                                                    </div>
                                                    <div class="form-group">
                                                      <div class="preview"></div>
                                                    </div>
                                                    ${(() => {
                                                      if (opt.type == 'edit') {
                                                        if (opt.preview.value.length == 0) {
                                                          return  `
                                                                    <div class="form-group">
                                                                      <div class="preview">
                                                                      </div>
                                                                    </div>
                                                                  `
                                                        } else {
                                                          return  `
                                                                  <div class="form-group">
                                                                    <div class="preview">
                                                                  ${opt.preview.value.map(p => {
                                                                    return  `
                                                                                <div class="img">
                                                                                  <img src="${baseUrl('assets/images/pembelian/'+p.nama)}">
                                                                                  <div class="fas fa-trash-alt new" data-id="${p.id_foto}" data-nama="${p.nama}"></div>
                                                                                </div>
                                                                                `
                                                                              }).join('')}
                                                                    </div>
                                                                  </div>
                                                                `
                                                        }
                                                      } else {
                                                        return ''
                                                      }
                                                    })()}
                                                  ${opt.dataGroup.map(d => {
                                                    return  `
                                                              <div class="data-group">
                                                              ${d.formGroup.map(l => {
                                                                return  `
                                                                          <div class="form-group ${l.label == 'Tanggal' ? 'date' : ''}">
                                                                            <label>${l.label}</label>
                                                                            <input type="${l.label == 'Tanggal' ? 'date' : 'text'}" autocomplete="off" ${l.label == 'Tanggal' ? '' : 'readonly'} ${l.value == undefined ? '' : `value="${l.value}"`}>
                                                                            <span>${l.warningMessage}</span>
                                                                          </div>
                                                                        `
                                                              }).join('')}
                                                              </div>
                                                            `
                                                  }).join('')}
                                                  ${opt.formGroup.map(d => {
                                                    return  `
                                                              <div class="form-group">
                                                                <label>${d.label}</label>
                                                                <textarea>${d.value == undefined ? '' : d.value}</textarea>
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
                                                      Buat supplier baru
                                                    </button>
                                                  </div>
                                                </div>
                                              `
                                    } else if (opt.type == 'detail') {
                                      return  `
                                                <div class="css-product pjl">
                                                  <div class="product-header">
                                                    <h2>${opt.title}</h2>
                                                    <button class="fas fa-times"></button>
                                                  </div>
                                                  <form>
                                                    <div class="product-content">
                                                    ${opt.simpleGroup.map(s => {
                                                      if (s.label == 'Catatan') {
                                                        return  `
                                                                  <div class="simple-group">
                                                                    <label>${s.label}</label>
                                                                    <textarea readonly>${s.content}</textarea>
                                                                  </div>
                                                                `
                                                      } else {
                                                        return  `
                                                                <div class="simple-group">
                                                                  <label>${s.label}</label>
                                                                  <p>${s.content}</p>
                                                                </div>
                                                              `
                                                      }
                                                    }).join('')}
                                                    </div>
                                                  </form>
                                                </div>
                                                <div class="css-prev">
                                                ${(() => {
                                                  if (opt.images.length == 0) {
                                                    return  `<img src="${baseUrl('assets/images/logo/no-image.png')}">`
                                                  } else {
                                                    return  opt.images.map(img => {
                                                              return  `<img src="${baseUrl('assets/images/pembelian/'+img.nama)}">`
                                                            }).join('')
                                                  }
                                                })()}
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
                        <table border="0" class="tbl-c6">
                          <tbody>
                          ${res.products.map(r => {
                            foto = r.foto.result.length == 0 ? baseUrl('assets/images/logo/no-image.png') : baseUrl('assets/images/pembelian/'+r.foto.result[0].nama)
                            return  `
                                      <tr ${r.stok == 0 ? 'class="empty"' : ''}>
                                        <td>${res.awalData++ + 1}</td>
                                        <td>
                                          <img src="${foto}">
                                        </td>
                                        <td>${r.supplier}</td>
                                        <td>${r.tanggal}</td>
                                        <td>
                                          <textarea readonly>${r.catatan}</textarea>
                                        </td>
                                        <td>
                                          <div class="action" data-id="${r.id_pembelian}" data-nama="${r.supplier}">
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
    if (res.jenis == 'perperiode') {
      start = res.namaPencarian.split(' ')[0]
      end = res.namaPencarian.split(' ')[2]
      prevUrl = baseUrl(`transaksi/pembelian?data=${res.data}&jenis=${res.jenis}&start=${start}&end=${end}&page=${res.halamanAktif - 1}`)
      firstUrl = baseUrl(`transaksi/pembelian?data=${res.data}&jenis=${res.jenis}&start=${start}&end=${end}&page=1`)
    } else {
      prevUrl = res.namaPencarian == 'Semua' ? baseUrl(`transaksi/pembelian?data=${res.data}&page=${res.halamanAktif - 1}`) : baseUrl(`transaksi/pembelian?data=${res.data}&nama=${res.namaPencarian}&page=${res.halamanAktif - 1}`)
      firstUrl = res.namaPencarian == 'Semua' ? baseUrl(`transaksi/pembelian`) : baseUrl(`transaksi/pembelian?data=${res.data}&nama=${res.namaPencarian}&page=1`)
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
      nextUrl = baseUrl(`transaksi/pembelian?data=${res.data}&jenis=${res.jenis}&start=${start}&end=${end}&page=${res.halamanAktif + 1}`)
      maxUrl = baseUrl(`transaksi/pembelian?data=${res.data}&jenis=${res.jenis}&start=${start}&end=${end}&page=${res.jumlahHalaman}`)
    } else {
      nextUrl = res.namaPencarian == 'Semua' ? baseUrl(`transaksi/pembelian?data=${res.data}&page=${res.halamanAktif + 1}`) : baseUrl(`transaksi/pembelian?data=${res.data}&nama=${res.namaPencarian}&page=${res.halamanAktif + 1}`)
      maxUrl = res.namaPencarian == 'Semua' ? baseUrl(`transaksi/pembelian?data=${res.data}&page=${res.jumlahHalaman}`) : baseUrl(`transaksi/pembelian?data=${res.data}&nama=${res.namaPencarian}&page=${res.jumlahHalaman}`)
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
    url = baseUrl(`transaksi/pembelian?data=${res.data}&jenis=${res.jenis}&start=${start}&end=${end}&page=${i}`)
  } else {
    url = res.namaPencarian == 'Semua' ? baseUrl(`transaksi/pembelian?data=${res.data}&page=${i}`) : baseUrl(`transaksi/pembelian?data=${res.data}&nama=${res.namaPencarian}&page=${i}`)
  }
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

const autocomplete = (inp,list,formGroup,modalBoxContainer,modalSmbc) => {
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
  res = await getData(baseUrl('service/getsingledata?data=pembelian&id='+id))

  const modalOptions = {
    type: 'detail',
    title: 'Detail Barang',
    simpleGroup: [
      {
        label: 'Supplier',
        content: res.result[0].supplier
      },
      {
        label: 'Tanggal',
        content: res.result[0].tanggal
      },
      {
        label: 'Catatan',
        content: res.result[0].catatan
      }
    ],
    images: res.result[0].foto.result
  }

  body.classList.add('modal-open')
  body.append(componentModal(modalOptions))

  const modalBoxContainer = document.querySelector('.modal-box-container')
  const modalProduct = modalBoxContainer.querySelector('.css-product')

  openModalBox(modalBoxContainer,modalProduct)

  const form = modalProduct.querySelector('form')
  const closeModalHeader = modalProduct.querySelector('.product-header button')
  const closeModalFooter = modalProduct.querySelectorAll('.product-footer button')[0]
  const closeOkFooter = modalProduct.querySelectorAll('.product-footer button')[1]

  modalBoxContainer.onclick = e => e.target.classList.contains('modal-box-container') ? closeModalBox(modalBoxContainer,modalProduct) : null
  closeModalHeader.onclick = () => closeModalBox(modalBoxContainer,modalProduct)
  form.onsubmit = e => e.preventDefault()
}

const modalEdit = async id => {
  res = await getData(baseUrl('service/getsingledata?data=pembelian&id='+id))
  const modalOptions = {
    type: 'edit',
    title: 'Ubah Pembelian',
    preview: {
      label: 'Preview',
      value: res.result[0].foto.result
    },
    formGroup: [
      {
        label: 'Catatan',
        warningMessage: 'Catatan Wajib Diisi',
        value: res.result[0].catatan
      }
    ],
    dataGroup: [
      {
        formGroup: [
          {
            label: 'Supplier',
            warningMessage: 'Supplier Wajib Diisi',
            readOnly: true,
            value: res.result[0].supplier
          },{
            label: 'Tanggal',
            warningMessage: 'Tanggal Wajib Diisi',
            readOnly: true,
            value: res.result[0].tanggal
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
  const uploadArea = formGroup[0].querySelector('.upload-area')
  const photoFiles = uploadArea.querySelector('input[type="file"]')
  const previewPhotoContainer = formGroup[1].querySelector('.preview')
  const previewOldPhoto = formGroup[2].querySelectorAll('.preview .img')

  // event handler start
  uploadArea.onclick = () => {
    photoFiles.click()
  }
  
  photoFiles.onchange = () => {
    showFile(photoFiles,previewPhotoContainer)
  }

  previewOldPhoto.forEach(old => {
    if (old.querySelector('.fa-trash-alt') != null) {
      old.querySelector('.fa-trash-alt').onclick = async e => {
        formD = new FormData()
        formD.append('data','foto_pembelian')
        formD.append('id',parseInt(e.target.dataset.id))
        formD.append('nama',e.target.dataset.nama)
    
        res = await postData(baseUrl('service/deletedata'),formD)
        
        if (res.status) {
          setNotification(res.class,res.message,1500)
          old.remove()
          loadData(location.search == '' ? '?data=pembelian' : location.search)
        } else {
          setNotification(res.class,res.message,1500)
        }
      }
    }
  })

  formGroup[3].querySelector('input').onclick = async () => {
    res = await getData(baseUrl('service/getdata?data=supplier'))

    const modalOptions = {
      type: 'sub',
      title: 'Supplier',
      list: res.products.map(l => l.nama)
    }

    runSubModalBox(formGroup[3],modalOptions)
  }

  modalBoxContainer.onclick = e => e.target.classList.contains('modal-box-container') ? closeModalBox(modalBoxContainer,modalProduct) : null
  closeModalHeader.onclick = () => closeModalBox(modalBoxContainer,modalProduct)
  closeModalFooter.onclick = () => closeModalBox(modalBoxContainer,modalProduct)
  savedataBtn.onclick = () => {}

  form.onsubmit = async e => {
    e.preventDefault()
    availabelFoto = formGroup[1].querySelector('.preview .img') == formGroup[2].querySelector('.preview .img')
    
    if (formGroup[3].querySelector('input').value == '' || formGroup[4].querySelector('input').value == '' || availabelFoto) {
      availabelFoto ? setNotification('error','Minimal 1 foto',1000) : ''
      formGroup.forEach((l,i) => {
        if (i != 1 && i != 2 && i != 5 && l.querySelector('input') != null ? l.querySelector('input').value == '' : '') {
          l.classList.add('warning')
        }
      })
    } else {
      formD = new FormData()
      formD.append('data','pembelian')
      formD.append('id',id)
      formD.append('supplier',formGroup[3].querySelector('input').value.trim().toUpperCase())
      formD.append('tanggal',formGroup[4].querySelector('input').value.trim())
      formD.append('catatan',formGroup[5].querySelector('textarea').value.trim().toUpperCase())
      for (const file of getAllFile) {
        formD.append('berkas_gambar[]', file)
      }

      savedataBtn.innerHTML = '<div class="loading"></div>'
      res = await postData(baseUrl('service/updatedata'),formD)

      if (res.status) {
        YAXIS = pageYOffset
        setNotification(res.class,res.message,3000)
        closeModalBox(modalBoxContainer,modalProduct)
        loadData(location.search == '' ? '?data=pembelian' : location.search)
        getAllFile = []
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
    title: `Apakah Yakin Ingin Menghapus Pembelian Dari <br> <strong>${n}</strong>`,
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
    formD.append('data','pembelian')
    formD.append('id',parseInt(id))

    yesBtn.innerHTML = '<div class="loading"></div>'
    res = await postData(baseUrl('service/deletedata'),formD)
    
    if (res.status) {
      YAXIS = pageYOffset
      setNotification(res.class,res.message,1500)
      closeModalBox(modalBoxContainer,modalTcat)
      loadData(location.search == '' ? '?data=pembelian' : location.search)
    } else {
      setNotification(res.class,res.message,1500)
      yesBtn.innerHTML = 'Iya'
    }
  }
}

const showFile = (photoFiles,previewPhotoContainer) => {
  files = photoFiles.files
  validExtensions = ['image/jpeg','image/jpg','image/png']
  if (files.length > 20 - 1 || getAllFile.length > 20 - 1) {
    setNotification('error','Hanya 20 gambar yang bisa diupload',1500)
  } else {
    for (let i = 0; i < files.length; i++) {
      if (validExtensions.includes(files.item(i).type)) {
        if (files.item(i).size > 5000000) {
          setNotification('error','Ukuran gambar maks 5 megabytes',1500)
        } else {
          fileReader = new FileReader()
          fileReader.onload = e => {
            getAllFile.push(files.item(i))
            comp =  `
                      <div class="img">
                        <img src="${e.target.result}">
                        <div class="fas fa-trash-alt"></div>
                      </div>
                    `
            previewPhotoContainer.append(new DOMParser().parseFromString(comp,'text/html').body.firstChild) 

            const removeFile = () => {
              imgList = previewPhotoContainer.querySelectorAll('.img')
              imgList.forEach((e,i) => {
                e.querySelector('.fa-trash-alt').onclick = () => {
                  getAllFile.splice(i,1)
                  e.remove()
                  removeFile()
                }
              })
            }

            removeFile()
          }
          fileReader.readAsDataURL(files.item(i))
        }
      } else {
        setTimeout(() => {
          setNotification('error','Pastikan file adalah gambar',1500)
        }, 100);
      }
    }
  }
}

// ------------------------------------- arrow functions end ------------------------------------





















