
let currentHeroSlide = 0
let currentGallerySlide = 0
let currentTestimonial = 0
let heroInterval
let galleryInterval
let testimonialInterval
let isGalleryAutoplay = true
let AOS


const loadingScreen = document.getElementById("loading-screen")
const header = document.getElementById("header")
const hamburger = document.getElementById("hamburger")
const navMenu = document.getElementById("nav-menu")
const backToTop = document.getElementById("back-to-top")
const modal = document.getElementById("modal")
const successMessage = document.getElementById("success-message")
const contactForm = document.getElementById("contact-form")

document.addEventListener("DOMContentLoaded", () => {
  initializeLoading()
  initializeNavigation()
  initializeHeroSlider()
  initializeGalleryCarousel()
  initializeTestimonials()
  initializeScrollEffects()
  initializeAnimations()
  initializeFormHandling()
  initializeCounters()
  initializeLazyLoading()

 
  setTimeout(() => {
    hideLoadingScreen()
  }, 2000)

 
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("ServiceWorker registration successful")
        })
        .catch((err) => {
          console.log("ServiceWorker registration failed")
        })
    })
  }
})


function initializeLoading() {
  const progress = document.querySelector(".loading-progress")
  let width = 0
  const interval = setInterval(() => {
    if (width >= 100) {
      clearInterval(interval)
    } else {
      width += Math.random() * 15
      if (width > 100) width = 100
      progress.style.width = width + "%"
    }
  }, 100)
}

function hideLoadingScreen() {
  loadingScreen.classList.add("hidden")
  document.body.style.overflow = "visible"

  
  if (typeof window.AOS !== "undefined") {
    window.AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
      offset: 100,
    })
  }
}


function initializeNavigation() {
  
  hamburger.addEventListener("click", toggleMobileMenu)

  
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      const targetId = this.getAttribute("href").substring(1)
      scrollToSection(targetId)

      
      if (navMenu.classList.contains("active")) {
        toggleMobileMenu()
      }

      
      updateActiveNavLink(this)
    })
  })

  
  window.addEventListener("scroll", handleHeaderScroll)

  
  window.addEventListener("scroll", updateNavOnScroll)
}

function toggleMobileMenu() {
  hamburger.classList.toggle("active")
  navMenu.classList.toggle("active")
  document.body.style.overflow = navMenu.classList.contains("active") ? "hidden" : "visible"
}

function handleHeaderScroll() {
  if (window.scrollY > 100) {
    header.style.background = "rgba(255, 255, 255, 0.95)"
    header.style.backdropFilter = "blur(10px)"
  } else {
    header.style.background = "#ffffff"
    header.style.backdropFilter = "none"
  }
}

function updateActiveNavLink(activeLink) {
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("active")
  })
  activeLink.classList.add("active")
}

function updateNavOnScroll() {
  const sections = document.querySelectorAll("section[id]")
  const scrollPos = window.scrollY + 150

  sections.forEach((section) => {
    const sectionTop = section.offsetTop
    const sectionHeight = section.offsetHeight
    const sectionId = section.getAttribute("id")

    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
      const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`)
      if (activeLink) {
        document.querySelectorAll(".nav-link").forEach((link) => {
          link.classList.remove("active")
        })
        activeLink.classList.add("active")
      }
    }
  })
}


function initializeHeroSlider() {
  const slides = document.querySelectorAll(".hero-slide")
  const navBtns = document.querySelectorAll(".hero-nav-btn")

  if (slides.length > 1) {
    startHeroAutoplay()
  }
}

function changeHeroSlide(index) {
  const slides = document.querySelectorAll(".hero-slide")
  const navBtns = document.querySelectorAll(".hero-nav-btn")

  
  slides[currentHeroSlide].classList.remove("active")
  navBtns[currentHeroSlide].classList.remove("active")

  
  currentHeroSlide = index

  
  slides[currentHeroSlide].classList.add("active")
  navBtns[currentHeroSlide].classList.add("active")

  
  stopHeroAutoplay()
  startHeroAutoplay()
}

function nextHeroSlide() {
  const slides = document.querySelectorAll(".hero-slide")
  const nextIndex = (currentHeroSlide + 1) % slides.length
  changeHeroSlide(nextIndex)
}

function startHeroAutoplay() {
  heroInterval = setInterval(nextHeroSlide, 5000)
}

function stopHeroAutoplay() {
  if (heroInterval) {
    clearInterval(heroInterval)
  }
}


function switchTab(tabName) {
  
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.remove("active")
  })
  document.querySelectorAll(".tab-pane").forEach((pane) => {
    pane.classList.remove("active")
  })

  
  document.querySelector(`[onclick="switchTab('${tabName}')"]`).classList.add("active")
  document.getElementById(tabName).classList.add("active")
}


function showService(serviceName) {
  
  document.querySelectorAll(".service-nav-item").forEach((item) => {
    item.classList.remove("active")
  })
  document.querySelectorAll(".service-detail").forEach((detail) => {
    detail.classList.remove("active")
  })

  
  document.querySelector(`[onclick="showService('${serviceName}')"]`).classList.add("active")
  document.getElementById(serviceName).classList.add("active")
}


function initializeGalleryCarousel() {
  if (isGalleryAutoplay) {
    startGalleryAutoplay()
  }
}

function changeSlide(direction) {
  const slides = document.querySelectorAll(".carousel-slide")
  const indicators = document.querySelectorAll(".indicator")

  
  slides[currentGallerySlide].classList.remove("active")
  indicators[currentGallerySlide].classList.remove("active")

  
  if (direction === 1) {
    currentGallerySlide = (currentGallerySlide + 1) % slides.length
  } else {
    currentGallerySlide = (currentGallerySlide - 1 + slides.length) % slides.length
  }

  
  slides[currentGallerySlide].classList.add("active")
  indicators[currentGallerySlide].classList.add("active")

  
  if (isGalleryAutoplay) {
    stopGalleryAutoplay()
    startGalleryAutoplay()
  }
}

function goToSlide(index) {
  const slides = document.querySelectorAll(".carousel-slide")
  const indicators = document.querySelectorAll(".indicator")

  
  slides[currentGallerySlide].classList.remove("active")
  indicators[currentGallerySlide].classList.remove("active")

  
  currentGallerySlide = index

  
  slides[currentGallerySlide].classList.add("active")
  indicators[currentGallerySlide].classList.add("active")

  
  if (isGalleryAutoplay) {
    stopGalleryAutoplay()
    startGalleryAutoplay()
  }
}


function toggleCarouselAutoplay() {
  const playPauseIcon = document.getElementById("play-pause-icon")

  if (isGalleryAutoplay) {
    stopGalleryAutoplay()
    isGalleryAutoplay = false
    playPauseIcon.className = "fas fa-play"
  } else {
    startGalleryAutoplay()
    isGalleryAutoplay = true
    playPauseIcon.className = "fas fa-pause"
  }
}

function startGalleryAutoplay() {
  galleryInterval = setInterval(() => {
    changeSlide(1)
  }, 4000)
}

function stopGalleryAutoplay() {
  if (galleryInterval) {
    clearInterval(galleryInterval)
  }
}


function initializeTestimonials() {
  startTestimonialAutoplay()
}

function showTestimonial(index) {
  const slides = document.querySelectorAll(".testimonial-slide")
  const navBtns = document.querySelectorAll(".testimonial-nav-btn")

  
  slides[currentTestimonial].classList.remove("active")
  navBtns[currentTestimonial].classList.remove("active")

  
  currentTestimonial = index

  
  slides[currentTestimonial].classList.add("active")
  navBtns[currentTestimonial].classList.add("active")

 
  stopTestimonialAutoplay()
  startTestimonialAutoplay()
}

function nextTestimonial() {
  const slides = document.querySelectorAll(".testimonial-slide")
  const nextIndex = (currentTestimonial + 1) % slides.length
  showTestimonial(nextIndex)
}

function startTestimonialAutoplay() {
  testimonialInterval = setInterval(nextTestimonial, 6000)
}

function stopTestimonialAutoplay() {
  if (testimonialInterval) {
    clearInterval(testimonialInterval)
  }
}


function initializeScrollEffects() {
  window.addEventListener("scroll", handleScroll)
}

function handleScroll() {
  
  if (window.scrollY > 300) {
    backToTop.classList.add("visible")
  } else {
    backToTop.classList.remove("visible")
  }

  
  const hero = document.querySelector(".hero")
  if (hero) {
    const scrolled = window.scrollY
    const rate = scrolled * -0.5
    hero.style.transform = `translateY(${rate}px)`
  }
}


function initializeAnimations() {
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate")
      }
    })
  }, observerOptions)

  
  document.querySelectorAll(".stat-number").forEach((el) => {
    observer.observe(el)
  })
}


function initializeCounters() {
  const counters = document.querySelectorAll(".stat-number[data-count]")

  const observerOptions = {
    threshold: 0.5,
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target)
        observer.unobserve(entry.target)
      }
    })
  }, observerOptions)

  counters.forEach((counter) => {
    observer.observe(counter)
  })
}

function animateCounter(element) {
  const target = Number.parseInt(element.getAttribute("data-count"))
  const duration = 2000
  const step = target / (duration / 16)
  let current = 0

  const timer = setInterval(() => {
    current += step
    if (current >= target) {
      current = target
      clearInterval(timer)
    }
    element.textContent = Math.floor(current)
  }, 16)
}


function initializeFormHandling() {
  if (contactForm) {
    contactForm.addEventListener("submit", handleFormSubmit)
  }


  const inputs = document.querySelectorAll("input, textarea, select")
  inputs.forEach((input) => {
    input.addEventListener("blur", validateField)
    input.addEventListener("input", clearFieldError)
  })
}

function handleFormSubmit(e) {
  e.preventDefault()


  if (!validateForm()) {
    return
  }

 
  const submitBtn = contactForm.querySelector('button[type="submit"]')
  const originalText = submitBtn.innerHTML
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...'
  submitBtn.disabled = true

  
  setTimeout(() => {
   
    submitBtn.innerHTML = originalText
    submitBtn.disabled = false

    
    showSuccessMessage()

    
    contactForm.reset()
  }, 2000)
}

function validateForm() {
  let isValid = true
  const requiredFields = contactForm.querySelectorAll("[required]")

  requiredFields.forEach((field) => {
    if (!validateField({ target: field })) {
      isValid = false
    }
  })

  return isValid
}

function validateField(e) {
  const field = e.target
  const value = field.value.trim()
  let isValid = true

  
  clearFieldError({ target: field })

  
  if (field.hasAttribute("required") && !value) {
    showFieldError(field, "Este campo es obligatorio")
    isValid = false
  }

  if (field.type === "email" && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      showFieldError(field, "Por favor ingresa un email válido")
      isValid = false
    }
  }

  
  if (field.type === "tel" && value) {
    const phoneRegex = /^[+]?[0-9\s\-$$$$]{10,}$/
    if (!phoneRegex.test(value)) {
      showFieldError(field, "Por favor ingresa un teléfono válido")
      isValid = false
    }
  }

  return isValid
}

function showFieldError(field, message) {
  field.style.borderColor = "#ef4444"

  
  const errorElement = document.createElement("span")
  errorElement.className = "field-error"
  errorElement.textContent = message
  errorElement.style.color = "#ef4444"
  errorElement.style.fontSize = "0.875rem"
  errorElement.style.marginTop = "0.25rem"
  errorElement.style.display = "block"

  
  field.parentNode.appendChild(errorElement)
}

function clearFieldError(e) {
  const field = e.target
  field.style.borderColor = "#e2e8f0"

  
  const errorElement = field.parentNode.querySelector(".field-error")
  if (errorElement) {
    errorElement.remove()
  }
}

function showSuccessMessage() {
  successMessage.classList.add("active")

  setTimeout(() => {
    successMessage.classList.remove("active")
  }, 4000)
}


function openModal(type) {
  const modalTitle = document.getElementById("modal-title")
  const modalBody = document.getElementById("modal-body")

  let title = ""
  let content = ""

  switch (type) {
    case "terms":
      title = "Términos y Condiciones"
      content = `
                <h4>1. Aceptación de los Términos</h4>
                <p>Al utilizar nuestros servicios, usted acepta estos términos y condiciones en su totalidad.</p>
                
                <h4>2. Servicios Médicos</h4>
                <p>Los servicios proporcionados son de naturaleza médica profesional y requieren evaluación presencial para diagnóstico y tratamiento.</p>
                
                <h4>3. Confidencialidad</h4>
                <p>Toda la información médica será tratada con estricta confidencialidad según las normas profesionales y legales aplicables.</p>
                
                <h4>4. Responsabilidades del Paciente</h4>
                <p>El paciente debe proporcionar información médica completa y precisa, y seguir las indicaciones médicas proporcionadas.</p>
                
                <h4>5. Limitaciones</h4>
                <p>Los resultados médicos pueden variar según cada caso individual y no se garantizan resultados específicos.</p>
            `
      break

    case "privacy":
      title = "Política de Privacidad"
      content = `
                <h4>Recopilación de Información</h4>
                <p>Recopilamos información personal necesaria para brindar servicios médicos de calidad, incluyendo datos de contacto, historial médico y información de seguros.</p>
                
                <h4>Uso de la Información</h4>
                <p>La información se utiliza exclusivamente para:</p>
                <ul>
                    <li>Proporcionar atención médica</li>
                    <li>Programar citas</li>
                    <li>Comunicación sobre tratamientos</li>
                    <li>Facturación y seguros</li>
                </ul>
                
                <h4>Protección de Datos</h4>
                <p>Implementamos medidas de seguridad técnicas y organizativas para proteger su información personal.</p>
                
                <h4>Compartir Información</h4>
                <p>No compartimos información personal con terceros excepto cuando sea requerido por ley o para la prestación de servicios médicos.</p>
            `
      break

    case "cookies":
      title = "Política de Cookies"
      content = `
                <h4>¿Qué son las Cookies?</h4>
                <p>Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando visita nuestro sitio web.</p>
                
                <h4>Tipos de Cookies que Utilizamos</h4>
                <ul>
                    <li><strong>Cookies Esenciales:</strong> Necesarias para el funcionamiento básico del sitio</li>
                    <li><strong>Cookies de Rendimiento:</strong> Nos ayudan a mejorar la experiencia del usuario</li>
                    <li><strong>Cookies de Funcionalidad:</strong> Recuerdan sus preferencias</li>
                </ul>
                
                <h4>Control de Cookies</h4>
                <p>Puede controlar y eliminar cookies a través de la configuración de su navegador.</p>
                
                <h4>Cookies de Terceros</h4>
                <p>Utilizamos servicios de terceros como Google Maps que pueden establecer sus propias cookies.</p>
            `
      break
  }

  modalTitle.textContent = title
  modalBody.innerHTML = content
  modal.classList.add("active")
  document.body.style.overflow = "hidden"
}

function closeModal() {
  modal.classList.remove("active")
  document.body.style.overflow = "visible"
}


function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId)
  if (section) {
    const headerHeight = header.offsetHeight
    const sectionTop = section.offsetTop - headerHeight - 20

    window.scrollTo({
      top: sectionTop,
      behavior: "smooth",
    })
  }
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
}

function openDirections() {
  const address = "Av. Reforma 1234, Colonia Médica, Ciudad de México"
  const encodedAddress = encodeURIComponent(address)
  const url = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`
  window.open(url, "_blank")
}


document.addEventListener("click", (e) => {
  
  if (e.target === modal) {
    closeModal()
  }

  
  if (!navMenu.contains(e.target) && !hamburger.contains(e.target) && navMenu.classList.contains("active")) {
    toggleMobileMenu()
  }
})

document.addEventListener("keydown", (e) => {
  
  if (e.key === "Escape" && modal.classList.contains("active")) {
    closeModal()
  }

  
  if (e.key === "Escape" && navMenu.classList.contains("active")) {
    toggleMobileMenu()
  }
})


document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopHeroAutoplay()
    stopGalleryAutoplay()
    stopTestimonialAutoplay()
  } else {
    startHeroAutoplay()
    if (isGalleryAutoplay) {
      startGalleryAutoplay()
    }
    startTestimonialAutoplay()
  }
})


function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}


window.addEventListener("scroll", debounce(handleScroll, 10))


function initializeLazyLoading() {
  const images = document.querySelectorAll("img[data-src]")

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.src = img.dataset.src
        img.removeAttribute("data-src")
        imageObserver.unobserve(img)
      }
    })
  })

  images.forEach((img) => imageObserver.observe(img))
}


document.addEventListener(
  "error",
  (e) => {
    if (e.target.tagName === "IMG") {
      e.target.src = "/placeholder.svg?height=400&width=600"
      e.target.alt = "Imagen no disponible"
    }
  },
  true,
)


console.log(
  `
%c🧠 Dra. Noelia Guthrie - Neurocirujana Especialista
%cSitio web desarrollado con HTML, CSS y JavaScript vanilla
%c© 2024 - Todos los derechos reservados
`,
  "color: #2563eb; font-size: 16px; font-weight: bold;",
  "color: #64748b; font-size: 12px;",
  "color: #94a3b8; font-size: 10px;",
)
