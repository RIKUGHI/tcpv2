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
  res.namaPencarian == 'Semua' ? containerDataTitle.textContent = 'Daftar Kategori' : containerDataTitle.textContent = `Daftar Pencarian Untuk "${res.namaPencarian}"`

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

loadData(location.search == '' ? '?data=kategori' : location.search)

// ----------------------------------- search data kategori start -----------------------------------
const formSearch = document.querySelector('main .css-sj1k2s .css-wrap12 form')
formSearch.onsubmit = e => {
  e.preventDefault()
  if (formSearch.querySelector('input').value == '') {
    location.href = baseUrl('master/kategori')
  } else {
    location.href = baseUrl('master/kategori?data=kategori&nama='+formSearch.querySelector('input').value)
  }
}
// ----------------------------------- search data kategori end -----------------------------------

// ----------------------------------- add data kategori start -----------------------------------
addBtn.onclick = () => {
  const modalOptions = {
    type: 'main',
    title: 'Tambah Kategori',
    formGroup: [
      {
        label: 'Nama Kategori',
        warningMessage: 'Nama Kategori Wajib Diisi'
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

  modalBoxContainer.onclick = e => e.target.classList.contains('modal-box-container') ? closeModalBox(modalBoxContainer,modalProduct) : null
  closeModalHeader.onclick = () => closeModalBox(modalBoxContainer,modalProduct)
  closeModalFooter.onclick = () => closeModalBox(modalBoxContainer,modalProduct)
  savedataBtn.onclick = () => {}

  form.onsubmit = async e => {
    e.preventDefault()
    if (formGroup[0].querySelector('input').value == '') {
      formGroup[0].classList.add('warning')
    } else {
      formD = new FormData()
      formD.append('data','kategori')
      formD.append('nama',formGroup[0].querySelector('input').value.trim().toUpperCase())

      savedataBtn.innerHTML = '<div class="loading"></div>'
      res = await postData(baseUrl('service/adddata'),formD)

      if (res.status) {
        YAXIS = 0
        setNotification(res.class,res.message,3000)
        closeModalBox(modalBoxContainer,modalProduct)
        loadData('?data=kategori')
      } else {
        setNotification(res.class,res.message,3000)
        savedataBtn.innerHTML = 'Simpan'
      }
    }
  }
  // event handler end
}
// ----------------------------------- add data kategori end -----------------------------------

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
                        <table border="0" class="tbl-3c">
                          <tbody>
                          ${res.products.map(r => {
                            return  `
                                      <tr>
                                        <td>${res.awalData++ + 1}</td>
                                        <td>${r.nama}</td>
                                        <td>
                                          <div class="action" data-id="${r.id_kategori}" data-nama="${r.nama}">
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

const runActionEvent = () => {
  const containerAction = document.querySelectorAll('main .css-cons1s table tbody tr td .action')
  containerAction.forEach(c => {
    c.querySelector('.fa-pen').onclick = () => modalEdit(c.dataset.id)
    c.querySelector('.fa-trash-alt').onclick = () => modalDelete(c.dataset.nama,c.dataset.id)
  })
}

const showPagination = res => {
  let p = ``

  if (res.halamanAktif > 1) {
    p +=  `
            <a href="${baseUrl('master/kategori')}" class="pagination-btn nb">
              <i class="fas fa-angle-double-left"></i>
            </a>
            <a href="${res.namaPencarian == 'Semua' ? baseUrl(`master/kategori?data=${res.data}&page=${res.halamanAktif - 1}`) : baseUrl(`master/kategori?data=${res.data}&nama=${res.namaPencarian}&page=${res.halamanAktif - 1}`)}" class="pagination-btn nb">
              <i class="fas fa-angle-left"></i>
            </a>
          `
  }

  if (res.jumlahHalaman > 5) {
    if (res.halamanAktif >= 3 && res.halamanAktif < res.jumlahHalaman - 2) {
      for (let i = res.halamanAktif - 2; i <= res.halamanAktif + 2; i++) {
        p += `<a href="${res.namaPencarian == 'Semua' ? baseUrl(`master/kategori?data=${res.data}&page=${i}`) : baseUrl(`master/kategori?data=${res.data}&nama=${res.namaPencarian}&page=${i}`)}" class="pagination-btn ${i == res.halamanAktif ? 'active' : ''}">${i}</a>`
      }
    }else if (res.halamanAktif >= res.jumlahHalaman - 2){
      for (let i = res.jumlahHalaman - 4; i <= res.jumlahHalaman; i++) {
        p += `<a href="${res.namaPencarian == 'Semua' ? baseUrl(`master/kategori?data=${res.data}&page=${i}`) : baseUrl(`master/kategori?data=${res.data}&nama=${res.namaPencarian}&page=${i}`)}" class="pagination-btn ${i == res.halamanAktif ? 'active' : ''}">${i}</a>`
      }
    }else{
      for (let i = 1; i <= 5; i++) {
        p += `<a href="${res.namaPencarian == 'Semua' ? baseUrl(`master/kategori?data=${res.data}&page=${i}`) : baseUrl(`master/kategori?data=${res.data}&nama=${res.namaPencarian}&page=${i}`)}" class="pagination-btn ${i == res.halamanAktif ? 'active' : ''}">${i}</a>`
      }
    }
  } else {
    for (let i = 1; i <= res.jumlahHalaman; i++) {
      p += `<a href="${res.namaPencarian == 'Semua' ? baseUrl(`master/kategori?data=${res.data}&page=${i}`) : baseUrl(`master/kategori?data=${res.data}&nama=${res.namaPencarian}&page=${i}`)}" class="pagination-btn ${i == res.halamanAktif ? 'active' : ''}">${i}</a>`
    }
  } 

  if (res.halamanAktif < res.jumlahHalaman) {
    p +=  `
            <a href="${res.namaPencarian == 'Semua' ? baseUrl(`master/kategori?data=${res.data}&page=${res.halamanAktif + 1}`) : baseUrl(`master/kategori?data=${res.data}&nama=${res.namaPencarian}&page=${res.halamanAktif + 1}`)}" class="pagination-btn nb">
              <i class="fas fa-angle-right"></i>
            </a>
            <a href="${res.namaPencarian == 'Semua' ? baseUrl(`master/kategori?data=${res.data}&page=${res.jumlahHalaman}`) : baseUrl(`master/kategori?data=${res.data}&nama=${res.namaPencarian}&page=${res.jumlahHalaman}`)}" class="pagination-btn nb">
              <i class="fas fa-angle-double-right"></i>
            </a>
          `
  }

  return p
}

const modalEdit = async id => {
  res = await getData(baseUrl('service/getsingledata?data=kategori&id='+id))
  console.log(res);
  const modalOptions = {
    type: 'edit',
    title: 'Ubah Barang',
    formGroup: [
      {
        label: 'Nama Barang',
        warningMessage: 'Nama Barang Wajib Diisi',
        value: res.result[0].nama
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


  modalBoxContainer.onclick = e => e.target.classList.contains('modal-box-container') ? closeModalBox(modalBoxContainer,modalProduct) : null
  closeModalHeader.onclick = () => closeModalBox(modalBoxContainer,modalProduct)
  closeModalFooter.onclick = () => closeModalBox(modalBoxContainer,modalProduct)
  savedataBtn.onclick = () => {}

  form.onsubmit = async e => {
    e.preventDefault()
    if (formGroup[0].querySelector('input').value == '') {
      formGroup[0].classList.add('warning')
    } else {
      formD = new FormData()
      formD.append('data','kategori')
      formD.append('id',id)
      formD.append('nama',formGroup[0].querySelector('input').value.trim().toUpperCase())

      savedataBtn.innerHTML = '<div class="loading"></div>'
      res = await postData(baseUrl('service/updatedata'),formD)

      if (res.status) {
        YAXIS = pageYOffset
        setNotification(res.class,res.message,3000)
        closeModalBox(modalBoxContainer,modalProduct)
        loadData(location.search == '' ? '?data=kategori' : location.search)
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
    title: `Apakah Yakin Ingin Menghapus Kategori <br> <strong>${n}</strong>`,
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
    formD.append('data','kategori')
    formD.append('id',parseInt(id))

    yesBtn.innerHTML = '<div class="loading"></div>'
    res = await postData(baseUrl('service/deletedata'),formD)
    
    if (res.status) {
      YAXIS = pageYOffset
      setNotification(res.class,res.message,1500)
      closeModalBox(modalBoxContainer,modalTcat)
      loadData(location.search == '' ? '?data=kategori' : location.search)
    } else {
      setNotification(res.class,res.message,1500)
      yesBtn.innerHTML = 'Iya'
    }
  }
}

// ------------------------------------- arrow functions end ------------------------------------





















































