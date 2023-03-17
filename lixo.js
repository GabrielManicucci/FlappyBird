const MAIN_DIV = document.querySelector(".content")

// // MAKING A NEW ELEMENT
function newElement(tagName, className) {
  const elem = document.createElement(tagName)
  elem.classList.add(className) // ou elem.className = className
  return elem
}

// // // MAKING BARREIRAS
function Barreira(reversa = false) {
  this.elemento = newElement("div", "barreira")

  const borda = newElement("div", "borda")
  const corpo = newElement("div", "corpo")
  this.elemento.appendChild(reversa ? corpo : borda)
  this.elemento.appendChild(reversa ? borda : corpo)

  this.setAltura = altura => (corpo.style.height = `${altura}px`)
}



// MAKING PAR DE BARREIRAS E SUA LÓGICA
function ParBarreiras(altura, abertura, x) {
  this.elemento = newElement("div", "par-barreiras")

  this.superior = new Barreira(true)
  this.inferior = new Barreira(false)

  this.elemento.appendChild(this.superior.elemento)
  this.elemento.appendChild(this.inferior.elemento)

  // Definindo aleatoriedade da abertura entre as barreiras e a altura da barreira de baixo
  this.sortearAbertura = () => {
    const alturaSuperior = Math.random() * (altura - abertura)
    const alturaInferior = altura - abertura - alturaSuperior
    this.superior.setAltura(alturaSuperior)
    this.inferior.setAltura(alturaInferior)
  }

  this.getX = () => parseInt(this.elemento.style.left.split("px")[0])
  this.setX = x => (this.elemento.style.left = `${x}px`)
  this.getLargura = () => this.elemento.clientWidth

  this.sortearAbertura()
  this.setX(x)
}


// // MAKING ANIMAÇÃO DAS BARREIRAS E SUA LÓGICA
function Barreiras(altura, largura, abertura, espaco, notificarPonto) {
  this.pares = [
    new ParBarreiras(altura, abertura, largura),
    new ParBarreiras(altura, abertura, largura + espaco),
    new ParBarreiras(altura, abertura, largura + espaco * 2),
    new ParBarreiras(altura, abertura, largura + espaco * 3)
  ]

  const deslocamento = 3
  this.animar = () => {
    this.pares.forEach(par => {
      par.setX(par.getX() - deslocamento)

      // Quando a barreira sair da área do jogo
      if (par.getX() < -par.getLargura()) {
        par.setX(par.getX() + espaco * this.pares.length)
        par.sortearAbertura()
      }

      // Notificando pontos após uma barreira passar o meio da tela
      const meio = largura / 2
      const passouMeio = () => {
        if (par.getX() + deslocamento >= meio && par.getX() < meio) {
          notificarPonto()
        }
      }
      passouMeio()
    })
  }
}

// // MAKING BIRD
function Passaro(alturaJogo) {
  let voando = false

  this.elemento = new newElement("img", "bird")
  this.elemento.src = "./imgs/passaro.png"

  this.getY = () => parseInt(this.elemento.style.bottom.split("px")[0])
  this.setY = y => (this.elemento.style.bottom = `${y}px`)

  window.onkeydown = e => (voando = true)
  window.onkeyup = e => (voando = false)

  this.animar = () => {
    const novoY = this.getY() + (voando ? 7 : -4)
    const alturaMaxima = alturaJogo - this.elemento.clientHeight

    // Restrições e animação do pássaro
    if (novoY <= 0) {
      this.setY(0)
    } else if (novoY >= alturaMaxima) {
      this.setY(alturaMaxima)
    } else {
      this.setY(novoY)
    }
  }

  this.setY(alturaJogo / 2)
}

// // PONTUAÇÃO
function Progresso() {
  // let pontos = 0
  this.elemento = newElement("div", "pontuation")
  // this.elemento.innerHTML = pontos
  this.atualizarPontos = pontos => {
    // pontos = pontos + 1
    // ++pontos
    this.elemento.innerHTML = pontos
  }
  this.atualizarPontos(0)
}



// COLISÃO
function estaoSobrepostos(elementoA, elementoB) {
  const a = elementoA.getBoundingClientRect()
  const b = elementoB.getBoundingClientRect()

  const horizontal = a.left + a.width >= b.left && b.left + b.width >= a.left
  const vertical = a.top + a.height >= b.top && b.top + b.height >= a.top
  // console.log(vertical)
  // console.log(horizontal)
  console.log(a.top + a.height)
  return horizontal && vertical
}

function colidiu(passaro, barreiras) {
  let colidiu = false
  barreiras.pares.forEach(par => {
    if (!colidiu) {
      const superior = par.superior.elemento
      const inferior = par.inferior.elemento
      colidiu =
        estaoSobrepostos(passaro.elemento, superior) ||
        estaoSobrepostos(passaro.elemento, inferior)
    }
  })
  return colidiu
}

function FlappyBird() {
  let pontos = 0

  const altura = MAIN_DIV.clientHeight
  const largura = MAIN_DIV.clientWidth

  const progresso = new Progresso()

  const barreiras = new Barreiras(altura, largura, 230, 400, () =>
    progresso.atualizarPontos(++pontos)
  )

  const passaro = new Passaro(altura)

  MAIN_DIV.appendChild(progresso.elemento)
  MAIN_DIV.appendChild(passaro.elemento)
  barreiras.pares.forEach(par => MAIN_DIV.appendChild(par.elemento))

  this.start = () => {
    const temporizador = setInterval(() => {
      barreiras.animar()
      passaro.animar()

      if (colidiu(passaro, barreiras)) {
        clearInterval(temporizador)
      }
    }, 20)
  }
}

new FlappyBird().start()