let currentFocus = -1
let locations = []

d3.csv('./worldcities.csv').then(function(data) {
    data.forEach(d => d.population = +d.population)

    globals.locations = data

    // <label for="location">Location: </label>
    // <input type="text" name="location">
    let locationPicker = d3.select('#location-picker')
    locationPicker.append('label')
        .attr('for', 'blanket-location')
        .text('Location: ')

    locationPicker.append('input')
        .attr('type', 'text')
        .attr('name', 'blanket-location')
        .on('keyup', autocomplete)

    locationPicker.append('div')
        .attr('id', 'location-autocomplete')
})

function autocomplete(d) {
    if (d.key === "Enter") {
        locationSubmit(d)
    } else if (d.key === "ArrowDown" || d.key === "ArrowUp") {
        let upDown = {'ArrowDown': 1, 'ArrowUp': -1}
        currentFocus = Math.max(-1, (currentFocus + upDown[d.key]) % locations.length)
    } else {
        currentFocus = -1
    }

    let text = d3.select(d.target).property('value')
    if (text.length >= 3) {
        locations = globals.locations.filter(x => {
            return x.city_ascii.slice(0, text.length).toLowerCase() == text.toLowerCase() ||
                    x.country.slice(0, text.length).toLowerCase() == text.toLowerCase() ||
                    x.admin_name.slice(0, text.length).toLowerCase() == text.toLowerCase()
        })
        .sort((a, b) => a.population > b.population ? -1 : 1)
        .slice(0, 100)

        let suggestions = d3.select('#location-autocomplete').selectAll('.suggestion').data(locations)

        suggestions.enter().append('div').attr('class', 'suggestion')
            .merge(suggestions)
            .text(d => `${d.city}, ${d.admin_name}, ${d.iso3}`)
            .classed('selected', (d, i) => i == currentFocus)
            .on("click", (e, d) => {
                currentFocus = locations.map(x => x.id).indexOf(d.id)
                locationSubmit()
            })

        suggestions.exit().remove()

    } else {
        d3.select('#location-autocomplete').html('')
    }
}

function locationSubmit(d) {
    // console.log(d);
    d3.select('#location-autocomplete').html('')
    if (currentFocus > -1) {
        d = locations[currentFocus]
        d3.select('#location-picker>input').property('value', `${d.city}, ${d.admin_name}, ${d.iso3}`)
        globals.selectedLocation = {name: `${d.city}, ${d.admin_name}, ${d.iso3}`, latitude: +d.lat, longitude: +d.lng}
        update()
    }
}