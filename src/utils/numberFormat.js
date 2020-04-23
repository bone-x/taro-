// 数字转大写
export  function convertNumber(val) {
  const chinessNum = ['一二三四五六七八九', '十']
  let tempStr = String(val).split('').reverse()
  let rs = tempStr.map((item, index) => {
    return (index > 0 && item > 1) ? [chinessNum[0].charAt(item - 1), chinessNum[index]].join('') : chinessNum[index].charAt(item - 1)
  })
  return rs.reverse().join('')
}
