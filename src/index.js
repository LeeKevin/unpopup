import 'babel-polyfill'
import './main.scss'

(function unpopup() {
    const OVERLAY_DURATION = 300

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

    function closeUnpopup(el) {
        console.log(el)
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
    }

    let transitioning = false
    const listener = debounce(() => {
        if (transitioning) return
        const popupVisible = unpopups.some(isVisible)
        const closeIcons = Array.from(document.getElementsByClassName('unpopup-close'))

        if (popupVisible) {
            transitioning = true
            overlay.style.display = 'block'
            closeIcons.forEach((icon) => {
                icon.style.display = 'block'
            })
            setTimeout(() => {
                overlay.style.opacity = 1
                closeIcons.forEach((icon) => {
                    icon.style.opacity = 1
                })
                transitioning = false
            }, OVERLAY_DURATION)
        } else {
            transitioning = true
            overlay.style.opacity = 0
            closeIcons.forEach((icon) => {
                icon.style.opacity = 0
            })
            setTimeout(() => {
                overlay.style.display = 'none'
                closeIcons.forEach((icon) => {
                    icon.style.display = 'none'
                })
                transitioning = false
            }, OVERLAY_DURATION)
        }
    }, OVERLAY_DURATION / 4)

    // Add listeners to all scrollable containers
    addEventListener('DOMContentLoaded', initialize, false)
    addEventListener('scroll', listener, true)
    addEventListener('load', listener, false)
}())
