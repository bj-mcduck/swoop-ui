import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["copy", "card"]

  connect() {
    this.update = this.update.bind(this)
    window.addEventListener("scroll", this.update, { passive: true })
    window.addEventListener("resize", this.update)
    this.update()
  }

  disconnect() {
    window.removeEventListener("scroll", this.update)
    window.removeEventListener("resize", this.update)
  }

  update() {
    const height = window.innerHeight
    const progress = Math.max(0, -this.element.getBoundingClientRect().top / height)
    this.copyTarget.style.transform = `translateY(${-progress * height}px)`
    this.cardTargets.forEach((card, index) => {
      const phase = progress - (index + 1)
      const y = phase < 0 ? -phase * height : phase > .55 ? -((phase - .55) / .45) * height : 0
      const visible = phase > -.7 && phase < 1
      card.style.transform = `translateY(${y}px)`
      card.style.opacity = visible ? Math.min(1, (phase + .7) / .3, (1 - phase) / .25) : 0
      card.toggleAttribute("inert", !visible)
      card.setAttribute("aria-hidden", String(!visible))
    })
  }
}
