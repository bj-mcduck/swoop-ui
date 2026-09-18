import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    this.context = this.element.getContext("2d")
    this.pointer = { x: -1000, y: -1000, active: false }
    this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    this.resize = this.resize.bind(this)
    this.movePointer = this.movePointer.bind(this)
    this.leavePointer = this.leavePointer.bind(this)
    this.frame = this.frame.bind(this)

    this.resizeObserver = new ResizeObserver(this.resize)
    this.resizeObserver.observe(this.element)
    window.addEventListener("pointermove", this.movePointer, { passive: true })
    window.addEventListener("pointerleave", this.leavePointer)
    this.resize()
  }

  disconnect() {
    this.resizeObserver?.disconnect()
    window.removeEventListener("pointermove", this.movePointer)
    window.removeEventListener("pointerleave", this.leavePointer)
    cancelAnimationFrame(this.animationFrame)
  }

  resize() {
    const bounds = this.element.getBoundingClientRect()
    const ratio = Math.min(window.devicePixelRatio || 1, 2)
    this.width = Math.max(bounds.width, 1)
    this.height = Math.max(bounds.height, 1)
    this.element.width = this.width * ratio
    this.element.height = this.height * ratio
    this.context.setTransform(ratio, 0, 0, ratio, 0, 0)
    this.buildParticles()
    cancelAnimationFrame(this.animationFrame)
    this.animationFrame = requestAnimationFrame(this.frame)
  }

  buildParticles() {
    const count = Math.min(620, Math.max(360, Math.round(this.width * .53)))
    const colors = ["#1c8ece", "#21b3e8", "#7dd7f4", "#ffffff", "#b3e821"]
    this.particles = Array.from({ length: count }, (_, index) => ({
      t: (index / count) * Math.PI * 2 + Math.random() * .08,
      offset: (Math.random() - .5) * this.height * .29,
      depth: Math.random(),
      speed: (.000065 + Math.random() * .000055) * (index % 7 === 0 ? -1 : 1),
      size: .65 + Math.random() * 1.55,
      color: colors[index % colors.length],
      opacity: .18 + Math.random() * .48,
      x: 0,
      y: 0
    }))
  }

  movePointer(event) {
    const bounds = this.element.getBoundingClientRect()
    this.pointer.x = event.clientX - bounds.left
    this.pointer.y = event.clientY - bounds.top
    this.pointer.active = this.pointer.x >= 0 && this.pointer.x <= bounds.width && this.pointer.y >= 0 && this.pointer.y <= bounds.height
  }

  leavePointer() { this.pointer.active = false }

  frame(time) {
    const ctx = this.context
    ctx.clearRect(0, 0, this.width, this.height)
    const centerX = this.width / 2
    const centerY = this.height * .52
    const radiusX = this.width * .40
    const radiusY = this.height * .40

    this.particles.forEach((particle) => {
      if (!this.reducedMotion) particle.t += particle.speed * 16.67
      const sin = Math.sin(particle.t)
      const cos = Math.cos(particle.t)
      const dx = radiusX * cos
      const dy = radiusY * Math.cos(particle.t * 2)
      const magnitude = Math.hypot(dx, dy) || 1
      const normalX = -dy / magnitude
      const normalY = dx / magnitude
      const pulse = Math.sin(time * .00018 + particle.t * 3) * 5 * particle.depth

      let x = centerX + radiusX * sin + normalX * (particle.offset + pulse)
      let y = centerY + radiusY * sin * cos + normalY * (particle.offset + pulse)

      if (this.pointer.active) {
        const deltaX = x - this.pointer.x
        const deltaY = y - this.pointer.y
        const distance = Math.hypot(deltaX, deltaY)
        if (distance < 145 && distance > 0) {
          const force = Math.pow(1 - distance / 145, 2) * 72
          x += (deltaX / distance) * force
          y += (deltaY / distance) * force
        }
      }

      particle.x = x
      particle.y = y
    })

    ctx.lineWidth = .55
    for (let index = 0; index < this.particles.length; index += 1) {
      const particle = this.particles[index]
      for (let step = 1; step <= 3; step += 1) {
        const neighbor = this.particles[(index + step) % this.particles.length]
        const distance = Math.hypot(particle.x - neighbor.x, particle.y - neighbor.y)
        if (distance < 82) {
          ctx.strokeStyle = `rgba(75, 174, 220, ${.16 * (1 - distance / 82)})`
          ctx.beginPath()
          ctx.moveTo(particle.x, particle.y)
          ctx.lineTo(neighbor.x, neighbor.y)
          ctx.stroke()
        }
      }
    }

    this.particles.forEach((particle) => {
      ctx.globalAlpha = particle.opacity
      ctx.fillStyle = particle.color
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fill()
    })
    ctx.globalAlpha = 1
    this.animationFrame = requestAnimationFrame(this.frame)
  }
}
