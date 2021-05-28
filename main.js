function update(){
    let latitude = globals.selectedLocation.latitude
    let longitude = globals.selectedLocation.longitude
    let year = d3.select('#date').property('value').slice(0,4) || "2020"
    let url = `https://phizzyviz-weather-data.herokuapp.com/api/v1/tempdata?latitude=${latitude}&longitude=${longitude}&start=${year}-01-01&end=${year}-12-31`
    d3.json(url).then(function(data) {
        console.log(data)

        //d3.select("#date").property("value", `${data.year}-01-01`)

        globals.data = parseData(data)

        clearDrilldown()
        drawBlanket()
    })
}

initializeUI()
//update('Fort_Lee_2018')