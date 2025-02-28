document.addEventListener('DOMContentLoaded', () => {
    // Adicionando evento ao botão somente quando o DOM estiver completamente carregado
    const generateButton = document.getElementById('generate-btn');
    if (generateButton) {
        generateButton.addEventListener('click', generatePalette);
    }
});

// Função para gerar uma paleta de cores harmônicas com tons semelhantes
function generatePalette() {
    const baseColor = chroma.random().set('hsl.s', 0.4).set('hsl.l', 0.5);  // Cor base aleatória (com saturação e luminosidade ajustadas)
    const colors = generateHarmonicColors(baseColor, 5);  // Gerar 5 cores harmônicas com variações suaves

    const paletteContainer = document.getElementById('palette-container');
    paletteContainer.innerHTML = '';  // Limpar a paleta anterior

    colors.forEach(color => {
        const colorDiv = document.createElement('div');
        colorDiv.classList.add('palette-item');
        colorDiv.style.backgroundColor = color;

        // Adicionar o código da cor na div
        const colorCode = document.createElement('span');
        colorCode.classList.add('color-code');
        colorCode.textContent = color;
        colorDiv.appendChild(colorCode);

        // Função de copiar código da cor
        colorDiv.addEventListener('click', () => {
            copyColorCode(color);
        });

        // Função para alterar a cor ao clicar
        colorDiv.addEventListener('dblclick', () => {
            changeColor(colorDiv, color);
        });

        paletteContainer.appendChild(colorDiv);
    });
}

// Função para gerar uma paleta harmônica com cores dentro de um tom específico (ex. azul ou cinza)
function generateHarmonicColors(baseColor, count) {
    const colors = [];

    // Gerar variações da cor base ajustando saturação e luminosidade
    for (let i = 0; i < count; i++) {
        const newColor = baseColor
            .set('hsl.l', baseColor.get('hsl.l') + (i * 0.05) - 0.1) // Ajustando a luminosidade (escuro para claro)
            .set('hsl.s', baseColor.get('hsl.s') + (i * 0.05) - 0.2) // Ajustando a saturação
            .hex();
        colors.push(newColor);
    }

    return colors;
}

// Função para copiar o código da cor
function copyColorCode(color) {
    const tempInput = document.createElement('input');
    document.body.appendChild(tempInput);
    tempInput.value = color;
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);

    // Mostrar o tooltip de cópia
    const tooltip = document.createElement('div');
    tooltip.classList.add('tooltip');
    tooltip.textContent = `Código ${color} copiado!`;
    document.body.appendChild(tooltip);

    // Exibir o tooltip com animação
    tooltip.classList.add('show');

    // Esconder o tooltip após 2 segundos
    setTimeout(() => {
        tooltip.classList.remove('show');
        document.body.removeChild(tooltip);
    }, 2000);
}

// Função para alterar a cor de um bloco
function changeColor(colorDiv, oldColor) {
    const newColor = chroma.random().set('hsl.s', 0.4).set('hsl.l', 0.5); // Nova cor aleatória (dentro de um padrão)
    colorDiv.style.backgroundColor = newColor;
    const colorCode = colorDiv.querySelector('.color-code');
    colorCode.textContent = newColor;
}

document.addEventListener("DOMContentLoaded", function() {
    let w = window.innerWidth;
    let h = window.innerHeight;
    let animated = false;

    const select = function(el) {
        return document.getElementById(el);
    };

    const wrapper = select("main-wrapper");
    const images = [
        { id: "#planet-1", name:"planet-1" },
        { id: "#planet-2", name:"planet-2" },
        { id: "#moon-crescent", name:"moon-crescent" },
        { id: "#moon-full", name:"moon-full" },
        { id: "#constellation", name:"constellation" },
        { id: "#comet", name:"comet" },
        { id: "#galaxy", name:"galaxy" }
    ];
    const stars = ["#star-1", "#star-2", "#star-3"];

    window.addEventListener("resize", function() {
        w = window.innerWidth;
        h = window.innerHeight;
        init();
    });

    // building the pattern
    function El(image, x, y, delay) {
        this.image = image;
        this.x = x;
        this.y = y;
        this.delay = delay;
    }

    El.prototype.attach = function() {
        this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.use = document.createElementNS("http://www.w3.org/2000/svg", "use");
        this.use.setAttributeNS(
            "http://www.w3.org/1999/xlink",
            "xlink:href",
            this.image.id
        );
        this.svg.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
        this.svg.setAttribute(
            "style",
            "top: " +
            this.y +
            "px; left: " +
            this.x +
            "px; animation-delay: " +
            this.delay +
            "s;"
        );
    };

    function Star(image, x, y) {
        this.image = image;
        this.x = x;
        this.y = y;
    }

    Star.prototype.attach = function() {
        this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.use = document.createElementNS("http://www.w3.org/2000/svg", "use");
        this.use.setAttributeNS(
            "http://www.w3.org/1999/xlink",
            "xlink:href",
            this.image
        );
        this.svg.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
        this.svg.setAttribute(
            "style",
            "top: " + this.y + "px; left: " + this.x + "px;"
        );
        this.svg.setAttribute("class", "star");
    };

    const spacing = 130;
    let i, s;

    function init() {
        while (wrapper.firstChild) {
            wrapper.removeChild(wrapper.firstChild);
        }
        i = 0;
        s = 0;

        for (let y = 0; y <= h; y += spacing) {
            if (y % (spacing * 2) === 0) {
                for (let x = 0; x <= w; x += spacing) {
                    if (x % (spacing * 2) === 0) {
                        draw(x, y + 10);
                    } else {
                        draw(x, y - 10);
                    }
                }
            } else {
                for (let x = -(spacing / 2); x <= w; x += spacing) {
                    if ((x + spacing / 2) % (2 * spacing) === 0) {
                        draw(x, y + 10);
                    } else {
                        draw(x, y - 10);
                    }
                }
            }
        }
        const newSpacing = spacing - 40;
        for (let y = newSpacing; y <= h; y += spacing) {
            for (let x = -(spacing / 2); x <= w; x += spacing) {
                if ((x + spacing / 2) % (2 * spacing) === 0) {
                    drawStar(x, y + 10);
                } else {
                    drawStar(x, y - 10);
                }
            }
        }
    }

    function draw(x, y) {
        const image = images[i];
        const delay = Math.floor(Math.random() * 2);
        const el = new El(image, x, y, delay);
        if (i === images.length - 1) {
            i = 0;
        } else {
            i++;
        }
        el.attach();
        el.svg.appendChild(el.use);
        wrapper.appendChild(el.svg);
    }

    function drawStar(x, y) {
        const image = stars[s];
        const star = new Star(image, x, y);
        if (s === stars.length - 1) {
            s = 0;
        } else {
            s++;
        }
        star.attach();
        star.svg.appendChild(star.use);
        wrapper.appendChild(star.svg);
    }

    init();

    // animation functions
    const moonFull = document.querySelector("symbol#moon-full");
    const galaxy = document.querySelector("symbol#galaxy");
    const planet1 = document.querySelector("symbol#planet-1");
    const planet2 = document.querySelector("symbol#planet-2");
    const moonCrescent = document.querySelector("symbol#moon-crescent");
    const comet = document.querySelector("symbol#comet");
    const constellationStars = document.querySelectorAll(
        "symbol#constellation polygon"
    );
    let cometLines = document.querySelectorAll("symbol#comet .trail");

    // Função para iniciar todas as animações
function startAnimation() {
    const tlMoonFull = new TimelineMax({ repeat: -1 });
    tlMoonFull.to(moonFull, 20, { rotation: 360, ease: Power0.easeNone });

    const tlGalaxy = new TimelineMax({ repeat: -1, yoyo: true });
    tlGalaxy.to(galaxy, 5, { rotationX: -45, ease: Power0.easeNone });

    const tlPlanet1 = new TimelineMax({ repeat: -1, yoyo: true });
    tlPlanet1
    .to(planet1, 2, { rotation: 7, ease: Power0.easeNone })
    .to(planet1, 2, { rotation: -2, ease: Power0.easeNone });

    const tlPlanet2 = new TimelineMax({ repeat: -1, yoyo: true });
    tlPlanet2.to(planet2, 0.5, { x: 1, y: 1, ease: Power0.easeNone });

    const tlComet = new TimelineMax({ repeat: -1, yoyo: true });
    const tlCometTrail = new TimelineMax({ repeat: -1, yoyo: true });
    tlComet.to(comet, 0.15, { x: 1, y: 1, ease: Power0.easeNone });
    cometLines.forEach((el, i) => {
        const x2 = parseInt(el.getAttribute("x2")) - 10;
        const y2 = parseInt(el.getAttribute("y2")) - 10;
        let tl = new TimelineMax({ repeat: -1, yoyo: true });
        tl.to(el, 1, { attr: { x2: x2, y2: y2 }, ease: Linear.easeNone });
        tlCometTrail.add(tl, i / 2);
    });

    const tlMoonCrescent = new TimelineMax({ repeat: -1, yoyo: true });
    tlMoonCrescent
    .to(moonCrescent, 2, { rotation: 5, ease: Power0.easeNone })
    .to(moonCrescent, 2, { rotation: -5, ease: Power0.easeNone });

    const tlConstellation = new TimelineMax({ repeat: -1 });
    constellationStars.forEach((el, i) => {
        var tl = new TimelineMax({ repeat: -1, yoyo: true });
        tl.to(el, 1, { opacity: 0.3, ease: Linear.easeNone });
        tlConstellation.add(tl, i);
    });
}

    // This function should be called to start all animations automatically
    startAnimation();
});