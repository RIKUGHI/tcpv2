let baseUrl = (url = '') => {
  return 'http://localhost/tcpv2/'+url
}

const allowOnlyNumeric = e => {
  ch = String.fromCharCode(e.which)
  if (!(/[0-9]/.test(ch))) {
    e.preventDefault()
  }
}

const liveFormatRupiah = (angka, prefix) => {
  number_string = angka.replace(/[^,\d]/g, '').toString()
  sisa 	= number_string.length % 3
  rupiah 	= number_string.substr(0, sisa)
  ribuan 	= number_string.substr(sisa).match(/\d{3}/gi)
    
  if (ribuan) {
    separator = sisa ? '.' : ''
    rupiah += separator + ribuan.join('.')
  }
  
  return prefix == undefined ? rupiah : (rupiah ? 'Rp. ' + rupiah : '')
}

const validPrice = ihp => {
  ihp.onkeypress = e => e.key == 'Enter' ? null : allowOnlyNumeric(e)
  ihp.oninput = () => ihp.value = liveFormatRupiah(ihp.value, 'Rp.')
}

const validPriceToStr = v => {
  r = v.split('.')
  r.shift()
  return parseInt(r.join(''))
}

formatRupiah = bilangan => {
  number_string = bilangan.toString(),
	sisa 	= number_string.length % 3,
	rupiah 	= number_string.substr(0, sisa),
	ribuan 	= number_string.substr(sisa).match(/\d{3}/g);
		
  if (ribuan) {
    separator = sisa ? '.' : '';
    rupiah += separator + ribuan.join('.');
  }

  return 'Rp. '+rupiah
}

const setNotification = (s,m,t) => {
  let defaultTime = 0

  if (document.querySelector('.notification') == null) {
    body.append(new DOMParser().parseFromString(`<div class="notification">${m}</div>`,'text/html').body.firstChild)
    setTimeout(() => {
      document.querySelector('.notification').classList.add(s)
      setTimeout(() => {
        document.querySelector('.notification').classList.remove('success')
        document.querySelector('.notification').classList.remove('error')
        setTimeout(() => {
          document.querySelector('.notification').remove()
        }, 300);
      }, defaultTime = defaultTime + t);
    }, 50);
  } else {
    document.querySelector('.notification').classList.remove('success')
    document.querySelector('.notification').classList.remove('error')
    document.querySelector('.notification').classList.add(s)
  }
}


const postData = (url,data) => {
  return fetch(url, {
    method: 'POST',
    body: data
  }).then(res => {
    if (res.ok) {
      return res.json()
    } else {
      setNotification('error','Gagal mengambil data',3000)
    }
  }).then(data => data).catch(err => console.error(err))
}

const getData = (url) => {
  return fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res => {
    if (res.ok) {
      return res.json()
    } else {
      setNotification('error','Gagal mengambil data',3000)
    }
  })
  .then(data => data).catch(err => console.error('Gagal mengambil data'))
}

// ---------------------------------------------------------- component ----------------------------------------------------------


const openModalBox = (c,p) => {
  setTimeout(() => {
    c.classList.add('open')
    setTimeout(() => {
      p.classList.add('open')
    }, 200);
  }, 0);
}

const closeModalBox = (c,p) => {
  setTimeout(() => {
    p.classList.remove('open')
    setTimeout(() => {
      c.classList.remove('open')     
      body.classList.remove('modal-open')  
      setTimeout(() => {
        c.remove()
      }, 300); 
    }, 200);
  }, 0);
}

const componentPreLoad = () => {
  const component =  `
                        <div class="pre-load">
                          <svg version="1.1" id="L7" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve">
                            <path fill="#fafafa" d="M31.6,3.5C5.9,13.6-6.6,42.7,3.5,68.4c10.1,25.7,39.2,38.3,64.9,28.1l-3.1-7.9c-21.3,8.4-45.4-2-53.8-23.3
                              c-8.4-21.3,2-45.4,23.3-53.8L31.6,3.5z">
                                  <animateTransform 
                                    attributeName="transform" 
                                    attributeType="XML" 
                                    type="rotate"
                                    dur="2s" 
                                    from="0 50 50"
                                    to="360 50 50" 
                                    repeatCount="indefinite" />
                            </path>
                            <path fill="#fafafa" d="M42.3,39.6c5.7-4.3,13.9-3.1,18.1,2.7c4.3,5.7,3.1,13.9-2.7,18.1l4.1,5.5c8.8-6.5,10.6-19,4.1-27.7
                              c-6.5-8.8-19-10.6-27.7-4.1L42.3,39.6z">
                                  <animateTransform 
                                    attributeName="transform" 
                                    attributeType="XML" 
                                    type="rotate"
                                    dur="1s" 
                                    from="0 50 50"
                                    to="-360 50 50" 
                                    repeatCount="indefinite" />
                            </path>
                            <path fill="#fafafa" d="M82,35.7C74.1,18,53.4,10.1,35.7,18S10.1,46.6,18,64.3l7.6-3.4c-6-13.5,0-29.3,13.5-35.3s29.3,0,35.3,13.5
                              L82,35.7z">
                                  <animateTransform 
                                    attributeName="transform" 
                                    attributeType="XML" 
                                    type="rotate"
                                    dur="2s" 
                                    from="0 50 50"
                                    to="360 50 50" 
                                    repeatCount="indefinite" />
                            </path>
                          </svg>
                        </div>
                      `
  return new DOMParser().parseFromString(component, 'text/html').body.firstChild;
}

const componentEmpty = m => {
  const component =   `
                        <div class="empty">
                          <img src="${baseUrl('assets/images/logo/empty.svg')}">
                          <h2>${m}</h2>
                        </div>
                      `
  return new DOMParser().parseFromString(component, 'text/html').body.firstChild;
}

const simpleDateView = date => {
  tgl = date.split('-')
  switch (tgl[1]) {
    case '01':
      bln = 'Jan'
      break;
    case '02':
      bln = 'Feb'
      break;
    case '03':
      bln = 'Mar'
      break;
    case '04':
      bln = 'Apr'
      break;
    case '05':
      bln = 'Mei'
      break;
    case '06':
      bln = 'Jun'
      break;
    case '07':
      bln = 'Jul'
      break;
    case '08':
      bln = 'Aug'
      break;
    case '09':
      bln = 'Sep'
      break;
    case '10':
      bln = 'Okt'
      break;
    case '11':
      bln = 'Nov'
      break;
    case '12':
      bln = 'Des'
      break;
  }

  days = tgl[2][0] == 0 ? tgl[2][1] : tgl[2]
  return days+' '+bln+' '+tgl[0]
}

function showLiveKembalian(bayar, total, prefix) {
  let kembalian = bayar - total,
    number_string = kembalian.toString(),
    sisa = [...number_string];
  sisa.shift();

  if (kembalian < 0) {
    let hargaString = kembalian.toString(),
      sisaL = sisa.length % 3;
    rupiah = hargaString.substr(1, sisaL),
      ribuan = hargaString.substr(sisaL + 1).match(/\d{3}/g);

    if (ribuan) {
      separator = sisaL ? '.' : '';
      rupiah += separator + ribuan.join('.');
    }
    return prefix += '-' + rupiah;
  } else {
    let hargaString = kembalian.toString(),
      sisaL = [...number_string].length % 3,
      rupiah = hargaString.substr(0, sisaL),
      ribuan = hargaString.substr(sisaL).match(/\d{3}/g);

    if (ribuan) {
      separator = sisaL ? '.' : '';
      rupiah += separator + ribuan.join('.');
    }
    return prefix + rupiah;
  }
}

// ---------------------------------------------------------- light-mode/dark-mode ----------------------------------------------------------
const getModel = async () => {
  res = await getData(baseUrl('service/getmode'))

  const html = document.querySelector('html')
  html.setAttribute('class',res.mode)

  return res.mode
}

getModel()