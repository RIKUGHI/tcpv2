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

loadData(location.search == '' ? '?data=logs' : location.search)

const btnDeleteAll = document.querySelector('main .css-sj1k2s .delete')
btnDeleteAll.onclick = async () => {
  formD = new FormData()
  formD.append('data','logs')

  res = await postData(baseUrl('service/deletealldatafromtable'),formD)

  if (res.status) {
    YAXIS = pageYOffset
    setNotification(res.class,res.message,3000)
    loadData(location.search == '' ? '?data=logs' : location.search)
  } else {
    setNotification(res.class,res.message,3000)
  }
}

const componentTable = res => {
  const component =  `
                        <table border="0" class="tbl-4c">
                          <tbody>
                          ${res.products.map(d => {
                            tgl = d.date.split(' ')
                            return  `
                                      <tr>
                                        <td>${res.awalData++ + 1}</td>
                                        <td>${d.message+' (Waktu : '+tgl[1]+')'}</td>
                                        <td>${simpleDateView(tgl[0])}</td>
                                        <td>
                                          <div class="action" data-id="${d.id_log}">
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
  const rows = document.querySelectorAll('main .css-cons1s table tbody tr')
  const containerAction = document.querySelectorAll('main .css-cons1s table tbody tr td .action')

  containerAction.forEach((c,i) => {
    c.querySelector('.fa-trash-alt').onclick = async () => {
      formD = new FormData()
      formD.append('data','logs')
      formD.append('id',parseInt(c.dataset.id))

      res = await postData(baseUrl('service/deletedata'),formD)
    
      if (res.status) {
        YAXIS = pageYOffset
        setNotification(res.class,res.message,1000)
        rows[i].remove()
        // loadData(location.search == '' ? '?data=logs' : location.search)
      } else {
        setNotification(res.class,res.message,1000)
      }
    }
  })
}

const showPagination = res => {
  let p = ``

  if (res.halamanAktif > 1) {
    p +=  `
            <a href="${baseUrl('logs')}" class="pagination-btn nb">
              <i class="fas fa-angle-double-left"></i>
            </a>
            <a href="${res.namaPencarian == 'Semua' ? baseUrl(`logs?data=${res.data}&page=${res.halamanAktif - 1}`) : baseUrl(`logs?data=${res.data}&nama=${res.namaPencarian}&page=${res.halamanAktif - 1}`)}" class="pagination-btn nb">
              <i class="fas fa-angle-left"></i>
            </a>
          `
  }

  if (res.jumlahHalaman > 5) {
    if (res.halamanAktif >= 3 && res.halamanAktif < res.jumlahHalaman - 2) {
      for (let i = res.halamanAktif - 2; i <= res.halamanAktif + 2; i++) {
        p += `<a href="${res.namaPencarian == 'Semua' ? baseUrl(`logs?data=${res.data}&page=${i}`) : baseUrl(`logs?data=${res.data}&nama=${res.namaPencarian}&page=${i}`)}" class="pagination-btn ${i == res.halamanAktif ? 'active' : ''}">${i}</a>`
      }
    }else if (res.halamanAktif >= res.jumlahHalaman - 2){
      for (let i = res.jumlahHalaman - 4; i <= res.jumlahHalaman; i++) {
        p += `<a href="${res.namaPencarian == 'Semua' ? baseUrl(`logs?data=${res.data}&page=${i}`) : baseUrl(`logs?data=${res.data}&nama=${res.namaPencarian}&page=${i}`)}" class="pagination-btn ${i == res.halamanAktif ? 'active' : ''}">${i}</a>`
      }
    }else{
      for (let i = 1; i <= 5; i++) {
        p += `<a href="${res.namaPencarian == 'Semua' ? baseUrl(`logs?data=${res.data}&page=${i}`) : baseUrl(`logs?data=${res.data}&nama=${res.namaPencarian}&page=${i}`)}" class="pagination-btn ${i == res.halamanAktif ? 'active' : ''}">${i}</a>`
      }
    }
  } else {
    for (let i = 1; i <= res.jumlahHalaman; i++) {
      p += `<a href="${res.namaPencarian == 'Semua' ? baseUrl(`logs?data=${res.data}&page=${i}`) : baseUrl(`logs?data=${res.data}&nama=${res.namaPencarian}&page=${i}`)}" class="pagination-btn ${i == res.halamanAktif ? 'active' : ''}">${i}</a>`
    }
  } 

  if (res.halamanAktif < res.jumlahHalaman) {
    p +=  `
            <a href="${res.namaPencarian == 'Semua' ? baseUrl(`logs?data=${res.data}&page=${res.halamanAktif + 1}`) : baseUrl(`logs?data=${res.data}&nama=${res.namaPencarian}&page=${res.halamanAktif + 1}`)}" class="pagination-btn nb">
              <i class="fas fa-angle-right"></i>
            </a>
            <a href="${res.namaPencarian == 'Semua' ? baseUrl(`logs?data=${res.data}&page=${res.jumlahHalaman}`) : baseUrl(`logs?data=${res.data}&nama=${res.namaPencarian}&page=${res.jumlahHalaman}`)}" class="pagination-btn nb">
              <i class="fas fa-angle-double-right"></i>
            </a>
          `
  }

  return p
}







































