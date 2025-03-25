const bestPractices = {
    html: [
        {
            title: "Use semantic HTML",
            description:
                "Use semantic HTML elements to give meaning to the content. This will help search engines to understand the content and improve the accessibility of the website."
        },
        {
            title: "Use alt text for images",
            description:
                "Add alt text to images to describe the content of the image. This will help visually impaired users to understand the content of the image."
        },
        {
            title: "Use ARIA roles",
            description:
                "Use ARIA roles to improve the accessibility of the website. ARIA roles help screen readers to understand the content of the website."
        }
    ],
    css: [
        {
            title: "Use a CSS reset",
            description:
                "Use a CSS reset to remove default browser styling. This will help to create a consistent look and feel across different browsers."
        },
        {
            title: "Use a CSS preprocessor",
            description:
                "Use a CSS preprocessor like Sass or Less to write maintainable and scalable CSS code. CSS preprocessors provide features like variables, nesting, and mixins."
        }
    ]
}

const appendAlert = (message, type) => {
    const wrapper = document.createElement("div")
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        "</div>"
    ].join("")
    const alertPlaceholder = document.getElementById("liveAlertPlaceholder")
    alertPlaceholder.append(wrapper)
}

class Status {
    constructor() {
        this.status = JSON.parse(localStorage.getItem("status")) ?? {}
    }

    get(key) {
        return this.status[key]
    }

    set(key, value) {
        this.status[key] = value
        localStorage.setItem("status", JSON.stringify(this.status))
    }

    get length() {
        return Object.keys(this.status).length
    }

    get current() {
        return Object.values(this.status).reduce((acc, value) => acc + value, 0)
    }
}

class BestPractices {
    static shared = new BestPractices(bestPractices)

    constructor(bestPractices) {
        this.data = bestPractices
        this.status = new Status()
        if (this.status.length === 0) {
            Object.keys(this.data).forEach(key => {
                this.data[key].forEach(item => {
                    this.status.set(this.getID(item), 0)
                })
            })
        }
    }

    getID(item) {
        return item.title.replace(/\s+/g, "-").toLowerCase()
    }

    createCard(item) {
        const card = document.createElement("div")
        card.className = "card mt-3"

        const cardBody = document.createElement("div")
        cardBody.className = "card-body"

        const cardTitle = document.createElement("h5")
        cardTitle.className = "card-title"
        cardTitle.textContent = item.title

        const cardText = document.createElement("p")
        cardText.className = "card-text"
        cardText.textContent = item.description

        const checkIcon = document.createElement("i")
        checkIcon.className = "bi bi-check2-circle float-end"
        checkIcon.style.color = "green"
        checkIcon.style.display = "none"
        cardTitle.appendChild(checkIcon)

        const checkBox = document.createElement("div")
        checkBox.className = "form-check form-switch float-end"
        const id = this.getID(item)
        checkBox.innerHTML = `<input class="form-check-input" type="checkbox" id="${id}">`
        checkBox.innerHTML += `<label class="form-check-label" for="${id}">I did it!</label>`
        checkBox.querySelector("input").addEventListener("change", event => {
            this.status.set(id, event.target.checked ? 1 : 0)
            updateProgress()
            checkIcon.style.display = event.target.checked ? "block" : "none"
        })
        if (this.status.get(id)) {
            checkBox.querySelector("input").checked = true
            checkIcon.style.display = "block"
        }

        cardBody.appendChild(cardTitle)
        cardBody.appendChild(cardText)
        cardBody.appendChild(checkBox)
        card.appendChild(cardBody)

        return card
    }

    render() {
        const nav = document.querySelector(".nav")
        const tabContent = document.querySelector(".tab-content")

        Object.keys(this.data).forEach((key, i) => {
            const navItem = document.createElement("li")
            const button = document.createElement("button")
            button.className = i === 0 ? "nav-link active" : "nav-link"
            button.textContent = key.toUpperCase()
            button.dataset.bsToggle = "tab"
            button.dataset.bsTarget = `#${key}`
            navItem.appendChild(button)
            nav.appendChild(navItem)

            const content = document.createElement("div")
            content.className = i === 0 ? "tab-pane fade show active" : "tab-pane fade"
            content.id = key
            this.data[key].forEach(item => {
                const card = this.createCard(item)
                content.appendChild(card)
            })
            tabContent.appendChild(content)
        })
    }
}

async function fetchImage() {
    const baseUrl = "https://api.waifu.im"
    const params = {
        included_tags: ["raiden-shogun", "maid"],
        height: ">=2000"
    }
    const queryParams = new URLSearchParams()
    for (const key in params) {
        if (Array.isArray(params[key])) {
            params[key].forEach(value => {
                queryParams.append(key, value)
            })
        } else {
            queryParams.set(key, params[key])
        }
    }
    const requestUrl = `${baseUrl}/search?${queryParams.toString()}`

    try {
        const response = await fetch(requestUrl)
        if (response.ok) {
            const image = await response.json().images[0]
        }
    } catch (error) {
        console.error(error)
        appendAlert(error, "danger")
    }
}
function updateProgress() {
    const total = BestPractices.shared.status.length
    const current = BestPractices.shared.status.current
    const progress = current / total
    const offset = 283 * (1 - progress)

    // calculate color based on progress
    const red = Math.round(255 * (1 - progress))
    const green = Math.round(255 * progress)
    const color = `rgb(${red}, ${green}, 0)`

    // update progress ring
    const progressRing = document.querySelector(".progress-ring")
    const progressText = document.querySelector(".progress-text")

    progressRing.style.transition = "stroke-dashoffset 0.5s ease, stroke 0.5s ease"
    progressRing.style.strokeDashoffset = offset
    progressRing.style.stroke = color

    progressText.textContent = `${current}/${total}`

    if (progress >= 0.8) {
        fetchImage()
    }
}

window.onload = () => {
    BestPractices.shared.render()
    updateProgress()
}
