const API = 'AIzaSyBLCVZD7ttGVxMh6EEJAkDaBKG6NPpR5T4'
const MAX_RESULTS = 10

const btn = document.getElementById('btn')
const searchInput = document.getElementById('search')
const output = document.getElementById('output')

form.addEventListener('submit', (event) => {
    event.preventDefault()
})

btn.addEventListener('click', () => {
    let searching = searchInput.value
    videoSearch(API, MAX_RESULTS, searching)
    output.innerHTML = ''
})

function videoSearch(key, maxResults, search) {
    let promise = new Promise((resolve, reject) => {
        if (searchInput.value !== '') {
            let requestUrl = requestLink(key, maxResults, search)
            console.log('new videos')
            const xhr = new XMLHttpRequest()
            xhr.open('GET', requestUrl, true)
            xhr.responseType = 'json'
            xhr.onload = () => {
                (xhr.status >= 400) ? console.error(xhr.response) : resolve(xhr.response)
            }
            xhr.onerror = () => {
                reject(xhr.response)
            }
            xhr.send()
        }        
    })
    promise.then(data => {
        console.log(data)
        
    }) 
}

function requestLink (key, maxResults, search) {
    return ('https://www.googleapis.com/youtube/v3/search??eventType=completed&order=date&part=snippet&key=' + key + '&type=video&part=snippet&maxResults=' + maxResults + '&q=' + search)
}