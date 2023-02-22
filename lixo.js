// const numeroAleatorio = Math.random()
// console.log(numeroAleatorio)

// const a = -100

// const b = -101

// console.log( b - a )

// let pontos = 0

// function addPonto () {
//   pontos = pontos + 1
//   console.log(pontos)
// }

// setInterval(() => {
//   addPonto()
// }, 1000);

// let colidiu = false

// if (!colidiu) {
//   console.log('colidiu está falso')
// }

// let pontos = 0
// let colidiu = false

function addPonto() {
  ++pontos

  if (pontos > 5) {
    colidiu = true
    return colidiu
  } else {
    return colidiu
  }
}

setInterval(() => {
  addPonto()

  if (!colidiu) {
    console.log("colidiu está falso")
  } else {
    console.log("colidiu agora é true")
  }
}, 1000)

// let colidiu = false
// console.log(!colidiu)

// if (!colidiu) {
//   console.log('colidiu é false')
// } else {
//   console.log('colidiu é true')
// }

// function alteradoValor() {
//   colidiu = true
//   if (!colidiu) {
//     console.log('colidiu agr é true')
//   }
// }

// alteradoValor()
