const total = document.querySelector('.documentation .css-dashboard .css-hdcnt .hdcnt-card .content h2')
const containerTop10Barang = document.getElementById('top-10-barang')
const containerTransaction7Days = document.getElementById('transaksi-7-hari')
const containerTransactionMonth = document.getElementById('transaksi-bulan')
const containerTransactionYear = document.getElementById('transaksi-tahun')

const loadDashboard = async () => {
  res = await getData(baseUrl('service/getdatadashboard'))

  total.textContent = noRp(formatRupiah(res.totalBarang))
  top10Barang(res.top10Barang)
  transaction7Days(res.transaksi7hari)
  transactionByMonth(res.transaksiBulan)
  transactionByYear(res.transaksiTahun)
}

loadDashboard()

const top10Barang = d => {
  containerTop10Barang.querySelector('h3').textContent = '10 Barang Terlaris Bulan '+getMonth(d.bulan)

  borderColors = ['rgb(72, 190, 62)','rgb(146, 48, 231)','rgb(249, 132, 4)','rgb(62, 100, 255)','rgb(12, 211, 168)']
  colors = ['rgba(72, 190, 62, 0.5)','rgba(146, 48, 231, 0.5)','rgba(249, 132, 4, 0.5)','rgba(62, 100, 255, 0.5)','rgba(12, 211, 168, 0.5)']
  
  const bar = containerTop10Barang.querySelector('canvas').getContext('2d')

  var barChartData = {
    labels: ['Top 1', 'Top 2', 'Top 3', 'Top 4', 'Top 5', 'Top 6', 'Top 7', 'Top 8', 'Top 9', 'Top 10'],
    datasets: d.results.map((n,i) => {
      x = []
      for (let l = 0; l < d.results.length; l++) {
        l == i ? x.push(n.total) : x.push(0)
      }
      return {
        label: n.nama,
        backgroundColor: colors[i > 4 ? i - 5 : i],
        borderColor: borderColors[i > 4 ? i - 5 : i],
        borderWidth: 2,
        data: x
      }
    })
  };

  // var barChartData = {
  //   labels: ['Top 1', 'Top 2', 'Top 3', 'Top 4', 'Top 5', 'Top 6', 'Top 7', 'Top 8', 'Top 9', 'Top 10'],
  //   datasets: [
  //     {
  //       label: 'Dataset 1',
  //       backgroundColor: colors[0],
  //       borderColor: borderColors[0],
  //       borderWidth: 1,
  //       data: [10]
  //     },
  //     {
  //       label: 'Dataset 1',
  //       backgroundColor: colors[1],
  //       borderColor: borderColors[1],
  //       borderWidth: 1,
  //       data: [0,9]
  //     },
  //     {
  //       label: 'Dataset 1',
  //       backgroundColor: colors[2],
  //       borderColor: borderColors[2],
  //       borderWidth: 1,
  //       data: [0,0,8]
  //     },
  //     {
  //       label: 'Dataset 1',
  //       backgroundColor: colors[3],
  //       borderColor: borderColors[3],
  //       borderWidth: 1,
  //       data: [0,0,0,7]
  //     },
  //     {
  //       label: 'Dataset 1',
  //       backgroundColor: colors[4],
  //       borderColor: borderColors[4],
  //       borderWidth: 1,
  //       data: [0,0,0,0,6]
  //     },
  //     {
  //       label: 'Dataset 1',
  //       backgroundColor: colors[0],
  //       borderColor: borderColors[0],
  //       borderWidth: 1,
  //       data: [0,0,0,0,0,5]
  //     },
  //     {
  //       label: 'Dataset 1',
  //       backgroundColor: colors[1],
  //       borderColor: borderColors[1],
  //       borderWidth: 1,
  //       data: [0,0,0,0,0,0,4]
  //     },
  //     {
  //       label: 'Dataset 1',
  //       backgroundColor: colors[2],
  //       borderColor: borderColors[2],
  //       borderWidth: 1,
  //       data: [0,0,0,0,0,0,0,3]
  //     },
  //     {
  //       label: 'Dataset 1',
  //       backgroundColor: colors[3],
  //       borderColor: borderColors[3],
  //       borderWidth: 1,
  //       data: [0,0,0,0,0,0,0,0,2]
  //     },
  //     {
  //       label: 'Dataset 1',
  //       backgroundColor: colors[4],
  //       borderColor: borderColors[4],
  //       borderWidth: 2,
  //       data: [0,0,0,0,0,0,0,0,0,1]
  //     }
  //   ]
  // };

  new Chart(bar, {
    type: 'bar',
    data: barChartData,
    options: {
      responsive: true,
      legend: {
        position: 'top',
      },
      title: {
        display: false,
        text: 'Chart.js Bar Chart'
      },					
      scales: {
        xAxes: [{
          stacked: true,
          gridLines: {
              // color: "#242526",
          }
        }],
        yAxes: [{
          stacked: true
        }]
      }
    }
  });
}

const transaction7Days = d => {
  containerTransaction7Days.querySelector('h3').textContent = 'Grafik Transaksi 7 Hari Terakhir'

  const ctx = containerTransaction7Days.querySelector('canvas').getContext("2d")
  var data = {
          labels: d.map(x => standartViewDate(x.tanggal)).sort(),
          datasets: [
                {
                  label: "Transaksi Per Hari",
                  fill: false,
                  lineTension: 0,
                  backgroundColor: "#0099be",
                  borderColor: "#0099be",
                  pointHoverBackgroundColor: "#0099be",
                  pointHoverBorderColor: "#0099be",
                  data: d.map(x => x.total).sort()
                }
              ]
            };

  new Chart(ctx, {
      type: 'line',
      data: data,
      options: {
      legend: {
        display: true
      },
      barValueSpacing: 20,
      scales: {
        yAxes: [{
            ticks: {
                min: 0,
            }
        }],
        xAxes: [{
                    gridLines: {
                        color: "rgba(0, 0, 0, 0)",
                    }
                }]
        }
    }
  });
}

const transactionByMonth = d => {
  containerTransactionMonth.querySelector('h3').textContent = 'Grafik Transaksi Bulan '+getMonth(d.bulan)

  const ctx = containerTransactionMonth.querySelector('canvas').getContext("2d")
  var data = {
          labels: d.results.map(dt => simpleDateView(dt.tanggal).split(' ')[0]),
          datasets: [
                {
                  label: "Transaksi Per Hari",
                  fill: false,
                  lineTension: 0,
                  backgroundColor: "#06c000",
                  borderColor: "#06c000",
                  pointHoverBackgroundColor: "#06c000",
                  pointHoverBorderColor: "#06c000",
                  data: d.results.map(dt => dt.total)
                }
              ]
            };

  new Chart(ctx, {
      type: 'line',
      data: data,
      options: {
      legend: {
        display: true
      },
      barValueSpacing: 20,
      scales: {
        yAxes: [{
            ticks: {
                min: 0,
            }
        }],
        xAxes: [{
                    gridLines: {
                        color: "rgba(0, 0, 0, 0)",
                    }
                }]
        }
    }
  });
}

const transactionByYear = d => {
  containerTransactionYear.querySelector('h3').textContent = 'Grafik Transaksi Tahun '+d.tahun

  const ctx = containerTransactionYear.querySelector("canvas").getContext("2d")
  var data = {
          labels: d.results.map(dt => simpleDateView(dt.tanggal).split(' ')[1]),
          datasets: [
                {
                  label: "Transaksi Per Bulan",
                  fill: false,
                  lineTension: 0,
                  backgroundColor: "#fd7622",
                  borderColor: "#fd7622",
                  pointHoverBackgroundColor: "#fd7622",
                  pointHoverBorderColor: "#fd7622",
                  data: d.results.map(dt => dt.total)
                }
              ]
            };
  
  new Chart(ctx, {
      type: 'line',
      data: data,
      options: {
      legend: {
        display: true
      },
      barValueSpacing: 20,
      scales: {
        yAxes: [{
            ticks: {
                min: 0,
            }
        }],
        xAxes: [{
                    gridLines: {
                        color: "rgba(0, 0, 0, 0)",
                    }
                }]
        }
    }
  });
}

const noRp = val => {
  x = val.split(' ')
  x.shift()
  return x 
}

const getMonth = date => {
  month = date.split('-')
  switch (month[1]) {
    case '01':
      bln = 'Januari'
      break;
    case '02':
      bln = 'Februari'
      break;
    case '03':
      bln = 'Maret'
      break;
    case '04':
      bln = 'April'
      break;
    case '05':
      bln = 'Mei'
      break;
    case '06':
      bln = 'Juni'
      break;
    case '07':
      bln = 'Juli'
      break;
    case '08':
      bln = 'Agustus'
      break;
    case '09':
      bln = 'September'
      break;
    case '10':
      bln = 'Oktober'
      break;
    case '11':
      bln = 'November'
      break;
    case '12':
      bln = 'Desember'
      break;
  
    default:
      bln = '-'
      break;
  }
  return bln
}

const standartViewDate = date => {
  viewDate = date.split('-')
  return viewDate[2]+'/'+viewDate[1]+'/'+viewDate[0]
}

