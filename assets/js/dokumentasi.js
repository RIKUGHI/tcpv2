const body = document.body
const pertanyaan = document.getElementById('pertanyaan')
const about = document.getElementById('tentang')
const listCard = document.querySelectorAll('.documentation .css-doc .css-rslt .card')
const logoApl = document.querySelector('.tcpv2-logo')

pertanyaan.onclick = () => {
  for (let i = 0; i <= 8; i++) {
    listCard[i].classList.remove('none')
  }

  for (let i = 9; i <= 10; i++) {
    listCard[i].classList.add('none')
  }

  logoApl.classList.add('none')
}

about.onclick = () => {
  for (let i = 0; i <= 8; i++) {
    listCard[i].classList.add('none')
  }

  for (let i = 9; i <= 10; i++) {
    listCard[i].classList.remove('none')
  }

  logoApl.classList.remove('none')
}

listCard.forEach(l => {
  l.onclick = () => {
    // listCard.forEach(lc => {
    //   lc.querySelector('.content').classList.remove('open')
    // })
    l.querySelector('.content').classList.toggle('open')
  }
})





