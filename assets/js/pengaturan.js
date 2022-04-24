const body = document.body
window.onload = async () => {
  const html = document.querySelector('html')
  const toggleModel = document.getElementById('dn')
  toggleModel.checked = await getModel() == 'light-mode' ? false : true
  toggleModel.onclick = async () => {
    formD = new FormData()
    if (html.getAttribute('class') == 'dark-mode') {
      formD.append('mode','light-mode')
      await postData(baseUrl('service/setmode'),formD)
      html.setAttribute('class','light-mode')
    } else {
      formD.append('mode','dark-mode')
      await postData(baseUrl('service/setmode'),formD)
      html.setAttribute('class','dark-mode')
    }
  }
}

const downloadBtn = document.querySelector('.documentation .css-settings .card .fa-download')
downloadBtn.onclick = () => {
  location.replace(baseUrl('service/backup'))
}













