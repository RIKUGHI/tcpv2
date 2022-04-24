const body = document.body
const loadDataPrint = async () => {
  res = await getData(baseUrl('service/getsingledata'+location.search))

  if (res.result.length == 0) {
    body.innerHTML = '<h1>Data Tidak Tersedia</h1>'
  } else {
    body.innerHTML = componentTablePrint(res.result[0])
    setTimeout(() => {
      window.print()
    }, 400);
  }
}

loadDataPrint()

const componentTablePrint = dp => {
  return  `
            <table border="0">
              <thead>
                <tr>
                  <th colspan="4">TOKO CAHAYA PERTAMA</th>
                </tr>
                <tr>
                  <td colspan="4">Jln Raya Klitik Geneng Ngawi</td>
                </tr>
                <tr>
                  <th colspan="4">====================================================================</th>
                </tr>
                <tr>
                  <td class="simple-info">
                    <p>Invoice</p>
                    <p>:</p>
                    <p>${dp.invoice}</p>
                  </td>
                </tr>
                <tr>
                  <td class="simple-info">
                    <p>Tanggal</p>
                    <p>:</p>
                    <p>${simpleDateView(dp.tanggal)}</p>
                  </td>
                </tr>
                <tr>
                  <td colspan="4" align="center">---------------------------------------------------------------------------------------------------------------------</td>
                </tr>
                <tr>
                  <td align="center">Nama</td>
                  <td align="center">Harga</td>
                  <td align="center">Jumlah</td>
                  <td align="center">Sub Total</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colspan="4" align="center">---------------------------------------------------------------------------------------------------------------------</td>
                </tr>
                ${dp.detail_transaksi.result.map(d => {
                  return  `
                            <tr>
                              <td>${d.nama}</td>
                              <td align="right">${formatRupiah(d.harga)}</td>
                              <td>${d.jumlah}</td>
                              <td align="right">${formatRupiah(d.subtotal)}</td>
                            </tr>
                          `
                }).join('')}
                <tr>
                  <td colspan="4" align="center">---------------------------------------------------------------------------------------------------------------------</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3">Total</td>
                  <td>${formatRupiah(dp.total)}</td>
                </tr>
                <tr>
                  <td colspan="3">Bayar</td>
                  <td>${formatRupiah(dp.bayar)}</td>
                </tr>
                <tr>
                  <td colspan="3">kembali</td>
                  <td>${showLiveKembalian(parseInt(dp.bayar),parseInt(dp.total),'Rp. ')}</td>
                </tr>
                <tr>
                  <td colspan="4" align="center">---------------------------------------------------------------------------------------------------------------------</td>
                </tr>
                <tr>
                  <td colspan="4">Terima Kasih Atas Kunjungan Anda</td>
                </tr>
              </tfoot>
            </table>
          `
}



























