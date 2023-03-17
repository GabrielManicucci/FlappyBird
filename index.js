
const MAIN_DIV = document.getElementById("content")

// MAKING NEW ELEMENT
function newElement(tagName, className) {
  const elemento = document.createElement(tagName)
  elemento.classList.add(className)
  return elemento
}

function Barreira(reversa = true) {
  this.elemento = newElement("div", "barreira")

  const corpo = newElement("div", "corpo")
  const borda = newElement("div", "borda")

  this.elemento.appendChild(reversa ? corpo : borda)
  this.elemento.appendChild(reversa ? borda : corpo)

  this.setAlturaCorpo = altura => (corpo.style.height = `${altura}px`)
}

function ParDeBarreira(x, altura, abertura) {
  this.elemento = newElement("div", "par-barreiras")

  this.barreiraSuperior = new Barreira(true)
  this.barreiraInferior = new Barreira(false)

  this.elemento.appendChild(this.barreiraSuperior.elemento)
  this.elemento.appendChild(this.barreiraInferior.elemento)

  this.aberturaAleatoria = () => {
    const alturaBarreiraSuperior = (altura - abertura) * Math.random()
    const alturaBarreiraInferior = altura - abertura - alturaBarreiraSuperior

    this.barreiraSuperior.setAlturaCorpo(alturaBarreiraSuperior)
    this.barreiraInferior.setAlturaCorpo(alturaBarreiraInferior)
  }

  this.setX = x => (this.elemento.style.left = `${x}px`)
  this.getX = () => parseInt(this.elemento.style.left.split("px")[0])
  this.getWidth = () => this.elemento.clientWidth

  this.setX(x)
  this.aberturaAleatoria()
}

function ConjuntoBareiras(
  largura,
  espaco,
  altura,
  abertura,
  marcandoPontos,
  MarcandoNivel2,
  MarcandoNivel3
) {
  this.pares = [
    new ParDeBarreira(largura, altura, abertura),
    new ParDeBarreira(largura + espaco, altura, abertura),
    new ParDeBarreira(largura + espaco * 2, altura, abertura),
    new ParDeBarreira(largura + espaco * 3, altura, abertura),
    new ParDeBarreira(largura + espaco * 4, altura, abertura)
  ]

  let newPonto = 0
  let deslocamento = 3
  this.animar = () => {
    this.pares.forEach(par => {

      const newPosition = par.getX() - deslocamento
      par.setX(newPosition)

      if (newPosition < -par.getWidth()) {
        par.setX(par.getX() + espaco * this.pares.length)
        par.aberturaAleatoria()
        // console.log(`PAr de barreira saiu da main div: ${newPosition}`)
      }

      const metadeJogo = largura / 2
      if (
        newPosition + deslocamento >= metadeJogo &&
        newPosition < metadeJogo
      ) {
        newPonto = marcandoPontos()
        console.log(newPonto)
      } else if (newPonto == 3) {
        deslocamento = 5
        MarcandoNivel2()
      } else if (newPonto == 7) {
        deslocamento = 7
        MarcandoNivel3()
      }
    })
  }
}

function Passaro(altura) {
  let voando = false

  this.elemento = newElement("img", "bird")
  this.elemento.src = "./imgs/passaro.png"

  this.getY = () => parseInt(this.elemento.style.bottom.split("px")[0])
  this.setY = y => (this.elemento.style.bottom = `${y}px`)

  window.onkeydown = e => (voando = true)
  window.onkeyup = e => (voando = false)

  window.ontouchstart = e => (voando = true)
  window.ontouchend = e => (voando = false)

  this.animar = () => {
    const alturaMaxima = altura - this.elemento.clientHeight
    const novoY = this.getY() + (voando ? 8 : -6)

    if (novoY <= 0) {
      this.setY(0)
    } else if (novoY >= alturaMaxima) {
      this.setY(alturaMaxima)
    } else {
      this.setY(novoY)
    }
  }

  this.setY(altura / 2)
}

function MarcandoPontos() {
  this.elemento = newElement("div", "pontuation")
  this.elemento.innerHTML = 0

  this.setPonto = ponto => {
    // ponto = ponto + 1
    this.elemento.innerHTML = ponto
    // console.log(ponto)
  }
}

function MarcandoNivel() {
  this.elemento = newElement("div", "nivel")
  this.elemento.innerHTML = "nível " + 1

  this.setNivel = nivel => {
    this.elemento.innerHTML = `nivel ${nivel}`
  }
}

function estaoSobrepostos(elementoA, elementoB) {
  const passaro = elementoA.getBoundingClientRect()
  const barreira = elementoB.getBoundingClientRect()

  const horizontal =
    passaro.left + passaro.width >= barreira.left &&
    barreira.left + barreira.width >= passaro.left
  const vertical =
    passaro.top + passaro.height >= barreira.top &&
    barreira.top + barreira.height >= passaro.top

  return horizontal && vertical
}

function colidiu(passaro, barreiras) {
  let colidiu = false

  barreiras.pares.forEach(par => {
    const superior = par.barreiraSuperior.elemento
    const inferior = par.barreiraInferior.elemento

    if (!colidiu) {
      colidiu =
        estaoSobrepostos(passaro.elemento, superior) ||
        estaoSobrepostos(passaro.elemento, inferior)
    }
  })

  return colidiu
}

function MenuStart() {
  this.elemento = newElement('div', 'menu')

  this.botao = newElement('button', 'button')
  this.botao.innerHTML = 'start'

  this.elemento.appendChild(this.botao)
}


function FlappyBird() {
  let ponto = 0
  const nivel2 = 2
  const nivel3 = 3

  const width = MAIN_DIV.clientWidth
  const height = MAIN_DIV.clientHeight

  const passaro = new Passaro(height)
  MAIN_DIV.appendChild(passaro.elemento)

  const pontuation = new MarcandoPontos()
  MAIN_DIV.appendChild(pontuation.elemento)

  const progresso = new MarcandoNivel()
  MAIN_DIV.appendChild(progresso.elemento)

  const barreiras = new ConjuntoBareiras(
    width,
    480,
    height,
    240,
    () => {
      ++ponto
      pontuation.setPonto(ponto)
      return ponto
    },
    () => {
      
      progresso.setNivel(nivel2)
    },
    () => {
      progresso.setNivel(nivel3)
    }
  )

  barreiras.pares.forEach(par => MAIN_DIV.appendChild(par.elemento))

  
  this.menu = new MenuStart()
  MAIN_DIV.appendChild(this.menu.elemento)
  
  this.start = () => {
    this.menu.elemento.classList.add('hide')
    const temporizador = setInterval(() => {
      barreiras.animar()
      passaro.animar()

      // if (colidiu(passaro, barreiras)) {
      //   clearInterval(temporizador)
      // }
    }, 20)
  } 

  // this.startTeste = () => {
    
  // }
}

const jogoFlappyBird = new FlappyBird()
// jogoFlappyBird.start()

const botaoMenuFlappyBird = jogoFlappyBird.menu.botao
// const funcaoStart = jogoFlappyBird.start
// console.log(funcaoStart)


botaoMenuFlappyBird.addEventListener('click', jogoFlappyBird.start)
console.log(botaoMenuFlappyBird)



