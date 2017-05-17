import Cookie from 'js-cookie'
import './main.scss'

(function unpopup() {
    const OVERLAY_DURATION = 300
    const COOKIE_SETTINGS = {
        expires: 7,
    }

    const unpopups = Array.from(document.getElementsByClassName('unpopup')).filter(item => item.getAttribute('id'))
    let overlay

    function isVisible(el) {
        const rect = el.getBoundingClientRect()

        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        )
    }

    function debounce(func, wait, immediate) {
        let timeout
        return (...args) => {
            const context = this
            const later = function later() {
                timeout = null
                if (!immediate) func.apply(context, args)
            }
            const callNow = immediate && !timeout
            clearTimeout(timeout)
            timeout = setTimeout(later, wait)
            if (callNow) func.apply(context, args)
        }
    }

    function findAncestor(el, cls) {
        let parent = el.parentElement

        while (parent.parentElement && !parent.classList.contains(cls)) {
            parent = parent.parentElement
        }

        return parent.classList.contains(cls) ? parent : null
    }

    function initialize() {
        // Add overlay to body
        document.body.insertAdjacentHTML('beforeend', '<div class="unpopup-overlay"></div>')
        overlay = document.getElementsByClassName('unpopup-overlay').item(0)
        overlay.style.transition = `opacity ${OVERLAY_DURATION}ms ease`

        // Add close icons
        const close = document.createElement('div')
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        close.setAttribute('class', 'unpopup-close')
        svg.setAttribute('viewBox', '0 0 50 50')
        svg.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xlink', 'http://www.w3.org/1999/xlink')
        path.setAttribute('d', 'M 15,15 L 35,35 M 35,15 L 15,35')
        svg.appendChild(path)
        close.appendChild(svg)

        unpopups.forEach((item) => {
            close.style.transition = overlay.style.transition
            close.addEventListener('click', closeUnpopup, false)

            item.appendChild(close)
        })

        overlay.addEventListener('click', closeVisibleUnpopups, false)
    }

    function hide(callback) {
        const closeIcons = Array.from(document.getElementsByClassName('unpopup-close'))
        overlay.style.opacity = 0
        closeIcons.forEach((icon) => {
            icon.style.opacity = 0
        })
        setTimeout(() => {
            overlay.style.display = 'none'
            closeIcons.forEach((icon) => {
                icon.style.display = 'none'
            })
            if (typeof callback === 'function') callback()
        }, OVERLAY_DURATION)
    }

    function show(callback) {
        const closeIcons = Array.from(document.getElementsByClassName('unpopup-close'))
        overlay.style.display = 'block'
        closeIcons.forEach((icon) => {
            icon.style.display = 'block'
        })
        setTimeout(() => {
            overlay.style.opacity = 1
            closeIcons.forEach((icon) => {
                icon.style.opacity = 1
            })
            if (typeof callback === 'function') callback()
        }, OVERLAY_DURATION)
    }

    function closeUnpopup(e) {
        const container = findAncestor(e.target, 'unpopup')
        if (container) {
            const id = container.getAttribute('id')
            hide(() => {
                Cookie.set(`unpopup-${id}`, '1', COOKIE_SETTINGS)
            })
        }
    }

    function closeVisibleUnpopups() {
        const visible = unpopups.filter(isVisible)

        hide(() => {
            visible.forEach((item) => {
                const id = item.getAttribute('id')
                Cookie.set(`unpopup-${id}`, '1', COOKIE_SETTINGS)
            })
        })
    }

    let transitioning = false
    const listener = debounce(() => {
        if (transitioning) return
        const popupVisible = unpopups.some(item => isVisible(item) && !Cookie.get(`unpopup-${item.getAttribute('id')}`))
        if (popupVisible) {
            transitioning = true
            show(() => {
                transitioning = false
            })
        } else {
            transitioning = true
            hide(() => {
                transitioning = false
            })
        }
    }, OVERLAY_DURATION / 4)

    // Add listeners to all scrollable containers
    addEventListener('DOMContentLoaded', initialize, false)
    addEventListener('scroll', listener, true)
    addEventListener('load', listener, false)
}())
