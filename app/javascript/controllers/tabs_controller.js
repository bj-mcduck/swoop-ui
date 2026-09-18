import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["tab", "panel"]

  select(event) {
    const selected = Number(event.currentTarget.dataset.index)
    this.tabTargets.forEach((tab, index) => tab.classList.toggle("active", index === selected))
    this.panelTargets.forEach((panel, index) => panel.hidden = index !== selected)
  }
}
