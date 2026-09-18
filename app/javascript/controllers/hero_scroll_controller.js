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
      const phase = progress - (1.35 + index * 1.65)
      // A curved approach and departure both have zero velocity at the
      // reading position. Spaced centers leave room between adjacent stories.
      const y = phase < 0 ? Math.pow(-phase / .95, 2) * height : phase > .22 ? -Math.pow((phase - .22) / .95, 2) * height : 0
      const visible = phase > -.95 && phase < 1.17
      card.style.transform = `translateY(${y}px)`
      card.style.opacity = visible ? Math.max(0, Math.min(1, (phase + .95) / .4, (1.17 - phase) / .4)) : 0
      card.toggleAttribute("inert", !visible)
      card.setAttribute("aria-hidden", String(!visible))
    })
  }
}
