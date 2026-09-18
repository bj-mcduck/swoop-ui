import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["header", "scrollCue", "center", "menu", "panel", "stage", "indicator", "eyebrow", "title", "description", "links", "toggle", "search", "searchInput", "searchButton"]

  connect() {
    this.content = {
      privacy: ["Privacy", "Protection is built into every signal, system, and solution.", ["Our approach", "Privacy hub", "Your privacy choices"]],
      why: ["Why Swoop", "A connected intelligence platform designed around the patient journey.", ["Our platform", "For marketers", "For brands", "For patients"]],
      solutions: ["Solutions", "Reach the right audience, in the right place, with the right next step.", ["DTC Audiences", "HCP Audiences", "Predictive Audiences", "Communities", "Web Solutions", "Rx"]],
      about: ["About Swoop", "Meet the people improving patient outcomes through data and technology.", ["Meet Swoop", "Leadership", "Careers", "Media kit"]],
      insights: ["Insights", "Research, ideas, and results from across the connected patient journey.", ["Blog", "Events", "Newsroom", "Case studies", "Patient insights"]]
    }

    this.activeKey = null
    this.onScroll = this.updateHeader.bind(this)
    this.onDocumentClick = this.handleDocumentClick.bind(this)
    window.addEventListener("scroll", this.onScroll, { passive: true })
    document.addEventListener("click", this.onDocumentClick)
    this.updateHeader()
  }

  disconnect() {
    window.removeEventListener("scroll", this.onScroll)
    document.removeEventListener("click", this.onDocumentClick)
    window.clearTimeout(this.searchCloseTimer)
    window.clearTimeout(this.panelTimer)
    window.clearTimeout(this.indicatorTimer)
    this.indicatorAnimation?.cancel()
  }

  updateHeader() {
    const isScrolled = window.scrollY > 24
    this.headerTarget.classList.toggle("is-scrolled", isScrolled)
    this.scrollCueTarget.classList.toggle("is-scrolled", isScrolled)
  }

  toggleMobile() {
    const open = this.menuTarget.classList.toggle("open")
    this.toggleTarget.setAttribute("aria-expanded", open)
  }

  toggleSearch() {
    const opening = !this.centerTarget.classList.contains("search-open")
    this.close()
    if (opening) {
      window.clearTimeout(this.searchCloseTimer)
      this.searchButtonTarget.classList.remove("search-closing")
      this.centerTarget.classList.add("search-open")
      this.searchTarget.removeAttribute("inert")
      this.searchTarget.setAttribute("aria-hidden", "false")
      this.searchButtonTarget.classList.add("active")
      this.searchButtonTarget.setAttribute("aria-expanded", "true")
      this.searchButtonTarget.setAttribute("aria-label", "Close search")
      window.setTimeout(() => this.searchInputTarget.focus(), 220)
    } else {
      this.closeSearch()
    }
  }

  closeSearch() {
    if (!this.centerTarget.classList.contains("search-open")) return
    this.centerTarget.classList.remove("search-open")
    this.searchTarget.setAttribute("inert", "")
    this.searchTarget.setAttribute("aria-hidden", "true")
    this.searchButtonTarget.setAttribute("aria-expanded", "false")
    this.searchButtonTarget.setAttribute("aria-label", "Open search")
    this.searchButtonTarget.classList.add("search-closing")
    window.clearTimeout(this.searchCloseTimer)
    this.searchCloseTimer = window.setTimeout(() => {
      this.searchButtonTarget.classList.remove("active")
      this.searchButtonTarget.classList.remove("search-closing")
    }, 390)
  }

  handleDocumentClick(event) {
    if (this.centerTarget.classList.contains("search-open") &&
        !this.searchTarget.contains(event.target) &&
        !this.searchButtonTarget.contains(event.target)) {
      this.closeSearch()
    }

    if (!this.panelTarget.hidden &&
        !this.panelTarget.contains(event.target) &&
        !this.menuTarget.contains(event.target)) {
      this.close()
    }
  }

  submitSearch(event) {
    if (!this.searchInputTarget.value.trim()) event.preventDefault()
  }

  togglePanel(event) {
    this.closeSearch()
    const key = event.currentTarget.dataset.panel

    if (this.activeKey === key && !this.panelTarget.hidden) {
      this.close()
      return
    }

    if (this.activeKey && !this.panelTarget.hidden) {
      this.slideToPanel(key)
    } else {
      this.renderPanel(key)
      this.panelTarget.hidden = false
      this.panelTarget.classList.add("open")
    }

    this.activeKey = key
    this.setExpandedButton(event.currentTarget)
    this.moveIndicator(event.currentTarget)
  }

  renderPanel(key) {
    const [title, description, links] = this.content[key]
    this.eyebrowTarget.textContent = "Explore"
    this.titleTarget.textContent = title
    this.descriptionTarget.textContent = description
    this.linksTarget.innerHTML = links.map(link => `<a href="#${key}">${link}<span>↗</span></a>`).join("")
  }

  slideToPanel(key) {
    window.clearTimeout(this.panelTimer)
    const keys = Object.keys(this.content)
    const direction = keys.indexOf(key) > keys.indexOf(this.activeKey) ? "left" : "right"
    this.stageTarget.className = `mega-menu-stage slide-out-${direction}`

    this.panelTimer = window.setTimeout(() => {
      this.renderPanel(key)
      const entryDirection = direction === "left" ? "right" : "left"
      this.stageTarget.className = `mega-menu-stage slide-in-${entryDirection}`
      this.stageTarget.offsetWidth
      this.stageTarget.className = "mega-menu-stage"
    }, 180)
  }

  moveIndicator(button) {
    window.clearTimeout(this.indicatorTimer)
    this.indicatorAnimation?.cancel()
    this.indicatorAnimation = null
    this.indicatorTarget.classList.remove("closing")
    this.indicatorTarget.style.left = `${button.offsetLeft}px`
    this.indicatorTarget.style.width = `${button.offsetWidth}px`
    requestAnimationFrame(() => this.indicatorTarget.classList.add("visible"))
  }

  close() {
    this.panelTarget.classList.remove("open")
    this.panelTarget.hidden = true
    this.activeKey = null
    this.setExpandedButton(null)
    window.clearTimeout(this.indicatorTimer)
    this.indicatorAnimation?.cancel()

    if (this.indicatorTarget.classList.contains("visible")) {
      this.indicatorAnimation = this.indicatorTarget.animate(
        [
          { transform: "translateX(0) scaleX(1)", opacity: 1 },
          { transform: "translateX(100%) scaleX(0)", opacity: 1 }
        ],
        { duration: 340, easing: "cubic-bezier(.22,.8,.35,1)", fill: "forwards" }
      )
      this.indicatorAnimation.onfinish = () => {
        this.indicatorTarget.classList.remove("visible")
        this.indicatorAnimation?.cancel()
        this.indicatorAnimation = null
      }
    }
  }

  setExpandedButton(activeButton) {
    this.menuTarget.querySelectorAll(".nav-link").forEach(button => {
      const active = button === activeButton
      button.classList.toggle("active", active)
      button.setAttribute("aria-expanded", active)
    })
  }
}
