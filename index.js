// cityRequest();

const but = document.querySelector('[data-element="button"]')
const inp1 = document.querySelector('[data-element="text1"]')
const inp2 = document.querySelector('[data-element="text2"]')
const display1 = document.querySelector('[data-element="display-city"]')
const display2 = document.querySelector('[data-element="display-street"]')

const cityOptions = {
	apiKey: 'fbbe22469b5f7de64e1a7a08d2590dd9',
	modelName: 'Address',
	calledMethod: 'searchSettlements',
	methodProperties: {
		CityName: 'вінниця',
		Limit: 5,
	},
}

// function options(ref) {
// 	const res = {
// 		modelName: 'AddressGeneral',
// 		calledMethod: 'getWarehouses',
// 		apiKey: 'fbbe22469b5f7de64e1a7a08d2590dd9',
// 		Limit: 5,
// 		methodProperties: {
// 			CityRef: ref,
// 		},
// 	}
// }

const streetOptions = {
	modelName: 'AddressGeneral',
	calledMethod: 'getWarehouses',
	apiKey: 'fbbe22469b5f7de64e1a7a08d2590dd9',
	Limit: 5,
	methodProperties: {
		CityRef: 'db5c88de-391c-11dd-90d9-001a92567626',
	},
}

console.log(cityOptions.methodProperties.CityName)
// event.target
inp1.addEventListener(
	'input',
	debounce(() => {
		cityOptions.methodProperties.CityName = inp1.value
		cityRequest(cityOptions).then((v) => {
			const { city, cityRef } = answerCitysObj(v)

			display1.innerHTML = ''
			city.forEach((v, i) =>
				createList({
					tag: 'p',
					text: v,
					attrs: {
						class: 'listP',
						'data-ref': cityRef[i],
					},
					parent: display1,
				})
			)

			console.log(city)
			display1.addEventListener('click', (event) => {
				inp1.value = event.target.textContent
				streetOptions.methodProperties.CityRef = event.target.dataset.ref
				display2.innerHTML = ''
				cityRequest(streetOptions).then((v) =>
					answerStreet(v).forEach((v) =>
						createList({
							tag: 'p',
							text: v,
							attrs: {
								class: 'listP',
							},
							parent: display2,
						})
					)
				)
			})
		})
	}, 500)
)

display2.addEventListener('click', (event) => {
	inp2.value = event.target.textContent
	setTimeout(() => {
		alert(`ви обрали ${inp2.value} у ${inp1.value}`)
	}, 1000)
})

display2.addEventListener(
	'input',
	debounce(() => {})
)

function debounce(func, wait, immediate) {
	let timeout

	return function executedFunction() {
		const context = this
		const args = arguments

		const later = function () {
			timeout = null
			if (!immediate) func.apply(context, args)
		}

		const callNow = immediate && !timeout

		clearTimeout(timeout)

		timeout = setTimeout(later, wait)

		if (callNow) func.apply(context, args)
	}
}

function answerCitysObj(object) {
	const res = {
		city: [],
		cityRef: [],
	}
	const obj = object.data['0'].Addresses
	for (key in obj) {
		res.city.push(obj[key].Present)
		res.cityRef.push(obj[key].DeliveryCity)
	}
	return res
}

function answerStreet(obj) {
	for (key in obj.data) {
		return obj.data.map((v) => v.Description)
	}
}

function cityRequest(options) {
	return fetch('https://api.novaposhta.ua/v2.0/json/', {
		method: 'post',
		body: JSON.stringify(options),
	}).then((response) => response.json())
}

function streetRequest(options) {
	return fetch('https://api.novaposhta.ua/v2.0/json/', {
		method: 'post',
		body: JSON.stringify(options),
	}).then((response) => response.json())
}

function createList(options) {
	const $el = document.createElement(options.tag)
	const $a = document.createElement('div')
	$a.textContent = 'dsadas';
	$el.textContent = options.text
	
	Object.entries(options.attrs).forEach(([name, value]) => {
		$el.setAttribute(name, value)
	})
	$el.appendChild($a)
	options.parent.appendChild($el)
	return $el
}
