// Sources list
// HTML: https://www.w3schools.com/html/html5_syntax.asp
// CSS: https://kinsta.com/blog/css-best-practices/
// JavaScript: https://www.w3schools.com/js/js_best_practices.asp
// This simulates data from an API
const bestPractices = {
    HTML: [
        {
            title: "Use lowercase element names",
            description: "Mixing uppercase and lowercase names looks inconsistent, and lowercase is easier to type."
        },
        {
            title: "Close all HTML elements",
            description: "Close all HTML elements, even if they are optional.<br/>This improves code readability."
        },
        {
            title: "Always quote attribute values",
            description:
                "Always quote attribute values to enhance readability and avoid errors.<br/>Quotes are mandatory if the value contains spaces."
        },
        {
            title: "Manage blank lines and indentation",
            description:
                "Avoid adding unnecessary blank lines, spaces, or indentation.<br/>Use blank lines to separate large or logical code blocks, and use two spaces for indentation.<br/>Avoid using the tab key."
        },
        {
            title: "Never skip the <title> element",
            description:
                "The <code>&lt;title&gt;</code> element is required in HTML.<br/>It is crucial for search engine optimization (SEO) as it influences how search engines rank pages in search results."
        }
    ],
    CSS: [
        {
            title: "Use line breaks liberally",
            description: "Using line breaks improves readability and makes the code easier to understand and maintain."
        },
        {
            title: "Use separate stylesheets for larger projects",
            description:
                "For large websites, using multiple stylesheets helps organize styles for different sections, making the code easier to manage."
        },
        {
            title: "Consider using a CSS framework",
            description:
                "CSS frameworks can speed up development for large projects, reduce bugs, and provide standardization, especially in team environments."
        },
        {
            title: "Start with a CSS reset",
            description: "A CSS reset ensures consistent rendering across browsers and minimizes inconsistencies."
        },
        {
            title: "Use CSS shorthand",
            description:
                "CSS shorthand reduces code size by combining multiple styles into a single line, improving readability and efficiency."
        }
    ],
    JavaScript: [
        {
            title: "Avoid Using eval()",
            description: `The eval() function is used to run text as code. In almost all cases, it should not be necessary to use it.<br/>
                Because it allows arbitrary code to be run, it also represents a security problem.`
        },
        {
            title: "Use === for comparison",
            description:
                "The strict equality operator (===) checks both the data type and value, making it the best practice for comparisons."
        },
        {
            title: "Beware of Automatic Type Conversions",
            description: `Beware that numbers can accidentally be converted to strings or NaN (Not a Number).<br/>
                Subtracting a string from a string, does not generate an error but returns NaN (Not a Number)`
        },
        {
            title: "Declare Arrays with const",
            description: "Declaring arrays with const will prevent any accidential change of type."
        },
        {
            title: "Avoid global variables",
            description:
                "Global variables can lead to conflicts and make the code harder to maintain and debug.<br/>Limit their use whenever possible."
        }
    ]
}

/**
 * Class to manage the status of best practices
 * It uses localStorage to persist the status across sessions.
 * The status is stored as a JSON object with keys as practice IDs and values as 0 or 1.
 */
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

/**
 * Class to manage best practices
 * It uses the Status class to manage the status of each practice.
 * It creates a card for each practice and appends it to the DOM.
 */
class BestPractices {
    static shared = new BestPractices(bestPractices) // Singleton instance

    /**
     * @param {Object} bestPractices - The best practices data
     * @param {Object} bestPractices.HTML - The HTML best practices
     * @param {Object} bestPractices.CSS - The CSS best practices
     * @param {Object} bestPractices.JavaScript - The JavaScript best practices
     */
    constructor(bestPractices) {
        this.data = bestPractices
        this.status = new Status()
        // Initialize status for each practice if not already set
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
        cardText.innerHTML = item.description // allow HTML content because this is a trusted source

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

    /**
     * Render the best practices in the DOM
     * It creates a tab for each category (HTML, CSS, JavaScript) and appends the cards to the corresponding tab content.
     */
    render() {
        const nav = document.querySelector(".nav")
        const tabContent = document.querySelector(".tab-content")

        Object.keys(this.data).forEach((key, i) => {
            const navItem = document.createElement("li")
            const button = document.createElement("button")
            button.className = i === 0 ? "nav-link active" : "nav-link"
            button.textContent = key
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

/**
 * Append an alert message to the alert placeholder
 * @param {string} message - The message to display
 * @param {string} type - The type of alert (success, danger, etc.)
 */
function appendAlert(message, type) {
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

function initTooltips() {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
    tooltipList.forEach(tooltip => {
        tooltip.show()
        setTimeout(() => tooltip.hide(), 2000)
    })
}

async function fetchImage(imageElem) {
    // Image API From: https://docs.waifu.im
    const baseUrl = "https://api.waifu.im"
    const params = {
        is_nsfw: false,
        included_tags: ["kamisato-ayaka"],
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

    // Show spinner while loading
    const parentElem = imageElem.parentElement
    const spinner = document.createElement("div")
    spinner.className = "spinner-border"
    spinner.setAttribute("role", "status")
    spinner.innerHTML = '<span class="visually-hidden">Loading...</span>'
    parentElem.appendChild(spinner)
    imageElem.addEventListener("load", () => {
        parentElem.removeChild(spinner)
    })
    imageElem.style.display = "none"

    const response = await fetch(requestUrl)
    if (response.ok) {
        const resp = await response.json()
        const image = resp.images[0]
        imageElem.src = image.url
        imageElem.alt = `From: ${image.artist.name}`
        imageElem.style.display = "block"
    } else {
        throw new Error("Failed to fetch image: " + response.statusText)
    }
}

/**
 * Show the star icon in the navbar
 * This function is called when the user has completed 80% of the best practices.
 */
function showStar() {
    const starIcon = document.querySelector("#starIcon")
    starIcon.style.display = "inline-block"
}

/**
 * Show the prize modal
 */
async function showPrize() {
    const prizeModal = new bootstrap.Modal(document.getElementById("prizeModal"), {})
    prizeModal.show()
    try {
        const imgContainer = document.querySelector("#prizeImage")
        imgContainer.innerHTML = ""
        const img = document.createElement("img")
        img.className = "img-fluid"
        imgContainer.appendChild(img)
        await fetchImage(img)
    } catch (error) {
        throw error
    }
}

/**
 * Update the progress ring and text
 * This function is called when the user checks or unchecks a practice.
 */
async function updateProgress() {
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

    if (localStorage.getItem("isPrizeClaimed") === "true") {
        showStar()
        return
    }
    if (progress >= 0.8) {
        try {
            localStorage.setItem("isPrizeClaimed", "true")
            showPrize()
            showStar()
        } catch (error) {
            appendAlert(error, "danger")
        }
    }
}

window.onload = () => {
    BestPractices.shared.render()
    initTooltips()
    updateProgress()
}
