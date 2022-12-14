const body = document.querySelector('body')
let block = document.querySelector('.city-list')
let list = document.querySelector('.list')

//убрать список городов если произошел клик вне блока
body.addEventListener('click', (event) => {
    const withinBoundaries = event.composedPath().includes(block)
    
    if (block.classList.contains('visible')) { 
        if ( ! withinBoundaries ) {
            block.classList.toggle('visible')
        }
    }
})


let input = document.querySelector('.input-city')
input.addEventListener('input', () => {  
    if (input.value != '') {
        document.querySelector('.button-input').style.visibility = 'visible'
    } else {
        document.querySelector('.button-input').style.visibility = 'hidden'
    }
    addList(cityJson, list, input.value)
})


let btnInput = document.querySelector('.img-button')

btnInput.addEventListener('click', (event) => {
    let parent = event.target.parentElement.parentElement
    console.log(parent)
    parent.querySelector('.input-city').value = ''
    addList(cityJson, list)
    document.querySelector('.button-input').style.visibility = 'hidden'
})


const buttonArrow = document.querySelector('.city-arrow')
//объект для хранения данных из запроса
let cityJson
//массив для хранения выбранных городов
let clickedCities = []

//показать список городов при клике на стрелку
buttonArrow.addEventListener('click', getCityList)

function getCityList(event) {
    event.stopPropagation();
    
    block.classList.toggle('visible')

    if ( ! cityJson ) {
        postRequest(list)
    } else {
        addList(cityJson, list)
    }

}

//запрос на получение списка городов
function postRequest(list) {
    fetch('https://studika.ru/api/areas', {
        method: 'POST'
    })

    .then(response => response.json())

    .then(data => {
        //console.log(data)
        cityJson = data
        
        addList(data, list)
    })
}

//поиск названий городов с полученном от сервера объекте
function addList(data, list, str) {
    list.innerHTML = ''
    data.forEach(element => {
        addListElement(element, list, str)

        if (element.cities) {
            element.cities.forEach(item => {
                addListElement(item, list, str)
            })
        }

    });
}

//добавление названия города в список и создание обработчика клика по городу
function addListElement(item, list, str = '') {
    
    if (str == '' || item.name.toLowerCase().includes(str.toLowerCase())) {

        let listItem = document.createElement('p')
        listItem.classList.add('list-item')

        if (str == '') {
            listItem.innerText = item.name
        } else {
            let numStart = item.name.toLowerCase().indexOf(str.toLowerCase())

            let firstPart = document.createElement('span')
            firstPart.textContent = item.name.slice(0, numStart)
            listItem.append(firstPart)

            let span = document.createElement('span')
            span.classList.add('span')
            span.textContent = item.name.slice(numStart, numStart + str.length)
            listItem.append(span)

            let secondPart = document.createElement('span')
            secondPart.textContent = item.name.slice(numStart + str.length)
            listItem.append(secondPart)
        }
        
        listItem.addEventListener('click', (event) => {
            let parent = document.querySelector('.user-city-box')

            if (clickedCities.includes(event.target.innerText)) {
                let index = clickedCities.indexOf(event.target.innerText)
                clickedCities.splice(index, 1)

                let allUserCities = parent.querySelectorAll('.user-city')
                allUserCities.forEach(item => {
                    if (item.textContent == event.target.innerText) {
                        parent.removeChild(item)
                    }
                })

                if (clickedCities.length == 0) {
                    btnCity.disabled = true
                }
                return
            }

            clickedCities.push(event.target.innerText)

            
            let div = document.createElement('div')
            div.classList.add('user-city')
            div.innerText = event.target.innerText
            /* div.style.visibility = 'initial' */
            let img = document.createElement('img')
            img.src = 'icons/del.png'
            img.classList.add('img-del')
            img.addEventListener('click', removeUserCity)

            div.append(img)

            parent.append(div)

            btnCity.disabled = false 
        })

        list.append(listItem)
        
    }

}

//удалить город при нажатии на крестик
function removeUserCity(event) {
    let item = event.target.parentElement

    let index = clickedCities.indexOf(item.innerText)
    clickedCities.splice(index, 1)

    let parent = item.parentElement
    parent.removeChild(item)

    if (clickedCities.length == 0) {
        btnCity.disabled = true
    }        
}

//кнопка сохранить
const btnCity = document.querySelector('.btn-city')

btnCity.addEventListener('click', () => {
    let city = document.querySelector('.city')
    city.textContent = ''

    for (let i = 0; i < clickedCities.length; i++) {
        if (i != 0) {
            city.textContent += ', '
        }
        city.textContent += clickedCities[i]
    }

    fetch('#', {
        method: 'POST',
        body: clickedCities
    })

    block.classList.toggle('visible')
})
