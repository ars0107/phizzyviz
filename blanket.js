let globals = {nColumns: 15}
globals.tempRanges = {
    min: -10,
    max: 110,
    cutoffs: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    get ranges() {
        let ranges = [{min: this.min, max: this.cutoffs[0]}]
        for (let i = 0; i < this.cutoffs.length - 1; i++) {
            ranges.push({min: this.cutoffs[i], max: this.cutoffs[i+1]})
        }
        ranges.push({min: this.cutoffs[this.cutoffs.length - 1], max: this.max})
        return ranges
    },
    get values() {
        return [this.min].concat(this.cutoffs).concat([this.max])
    }
}

globals.selectedDate = ""

d3.select('#date')
    .on("change", function(d){
        let dt = d.target.value
        globals.selectedDate = dt
        drilldown(dt)
    })

let slider = d3
    .sliderHorizontal()
    .min(10)
    .max(20)
    .step(1)
    .width(300)
    .displayValue(false)
    .value(globals.nColumns)
    .on('onchange', (val) => {
        globals.nColumns = val;
        drawBlanket()
    })

d3.select('#column-slider')
    .append('svg')
    .attr('width', 500)
    .attr('height', 100)
    .append('g')
    .attr('transform', 'translate(30,30)')
    .call(slider);

let yarnColors = {
    aubergine:{url:'./images/aubergine-132.jpg', color: '#512e4f'},
    coral: {url:'./images/coral-135.jpg', color: '#f06188'},
    corn: {url:'./images/corn-120.jpg', color: '#ea9d20'},
    dustyBlue: {url:'./images/dusty-blue-149.jpg', color: '#5485ba'},
    dutchBlue: {url:'./images/dutch-blue-125.jpg', color: '#144e70'},
    green: {url:'./images/green-146.jpg', color: '#317c49'},
    magenta: {url:'./images/magenta-133.jpg', color: '#ad3e9b'},
    pineapple: {url:'./images/pineapple-152.jpg', color: '#f7cc77'},
    red: {url:'./images/red-112.jpg', color: '#b10821'},
    tangerine: {url:'./images/tangerine-151.jpg', color:'#f47946'},
    royalBlue: {url:'./images/royal-blue-148.jpg', color: '#075ead'},
    teal: {url:'./images/teal-107.jpg', color:'#07575e'},
    violet: {url:'./images/violet-131.jpg', color:'#5a3f87'},
    wine: {url:'./images/wine-117.jpg', color: '#611a24'},
    lightGrey: {url:'./images/light-grey-103.jpg', color: '#c8bcaf'},
    darkGrey: {url:'./images/dark-grey-104.jpg', color:'#615b59'},
}

function color(val, texture){
    if (texture) {
        if (val >= globals.tempRanges.cutoffs[10]) return 'url(#wine-fg)'
        else if (val >= globals.tempRanges.cutoffs[9]) return 'url(#red-fg)';
        else if (val >= globals.tempRanges.cutoffs[8]) return 'url(#tangerine-fg)';
        else if (val >= globals.tempRanges.cutoffs[7]) return 'url(#corn-fg)';
        else if (val >= globals.tempRanges.cutoffs[6]) return 'url(#green-fg)';
        else if (val >= globals.tempRanges.cutoffs[5]) return 'url(#teal-fg)';
        else if (val >= globals.tempRanges.cutoffs[4]) return 'url(#dustyBlue-fg)';
        else if (val >= globals.tempRanges.cutoffs[3]) return 'url(#royalBlue-fg)';
        else if (val >= globals.tempRanges.cutoffs[2]) return 'url(#violet-fg)';
        else if (val >= globals.tempRanges.cutoffs[1]) return 'url(#aubergine-fg)';
        else if (val >= globals.tempRanges.cutoffs[0]) return 'url(#coral-fg)';
        else return 'url(#magenta-fg)';
    } else {
        if (val >= globals.tempRanges.cutoffs[10]) return yarnColors.wine.color;
        else if (val >= globals.tempRanges.cutoffs[9]) return yarnColors.red.color;
        else if (val >= globals.tempRanges.cutoffs[8]) return yarnColors.tangerine.color;
        else if (val >= globals.tempRanges.cutoffs[7]) return yarnColors.corn.color;
        else if (val >= globals.tempRanges.cutoffs[6]) return yarnColors.green.color;
        else if (val >= globals.tempRanges.cutoffs[5]) return yarnColors.teal.color;
        else if (val >= globals.tempRanges.cutoffs[4]) return yarnColors.dustyBlue.color;
        else if (val >= globals.tempRanges.cutoffs[3]) return yarnColors.royalBlue.color;
        else if (val >= globals.tempRanges.cutoffs[2]) return yarnColors.violet.color;
        else if (val >= globals.tempRanges.cutoffs[1]) return yarnColors.aubergine.color;
        else if (val >= globals.tempRanges.cutoffs[0]) return yarnColors.coral.color;
        else return yarnColors.magenta.color;
    }
}

function drawTempRanges() {
    let svgHeight = 500
    let svgWidth = 75

    let margin = {top: 10, left: 50, bottom: 10, right: 0}

    let width = svgWidth - margin.left - margin.right
    let height = svgHeight - margin.top - margin.bottom

    d3.select('#temperature-picker').html('<i class="fas fa-sync" id="reset"></i>')

    d3.select('#reset').on('click', function(){
        globals.tempRanges.cutoffs = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
        drawTempRanges()
        drawBlanket()
        drilldown()
    })

    let svg =  d3.select('#temperature-picker').append('svg')
        .attr('width', svgWidth)
        .attr('height', svgHeight)

    let tempScale = d3.scaleLinear()
        .domain([globals.tempRanges.min, globals.tempRanges.max])
        .range([height, margin.bottom])

    let g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)

    let ranges = g.selectAll('.range').data(globals.tempRanges.ranges)
        .enter().append('rect').attr('class', 'range')
        .attr('x', 0)
        .attr('y', d => tempScale(d.max))
        .attr('width', 25)
        .attr('height', d => tempScale(d.min) - tempScale(d.max))
        .attr('fill', d => color(0.5*(d.min + d.max), false))

    let drag = d3.drag()
        .on('start', function(event, d) { d3.select(this).attr('y', d => tempScale(d) - 3).attr('height', 6) })
        .on('drag', function(event, d) {
            let min = tempScale(globals.tempRanges.min + 1);
            let max = tempScale(globals.tempRanges.cutoffs[1] - 1);
            for (let i = 0; i < globals.tempRanges.cutoffs.length; i++) {
                let cutoff = globals.tempRanges.cutoffs[i];
                if (cutoff < d) {
                    min = tempScale(cutoff + 1)
                    max = tempScale(globals.tempRanges.cutoffs[i + 2] - 1 || globals.tempRanges.max - 1)
                }
            }
            d3.select(this).attr('transform', `translate(0,${Math.max(max, Math.min(min, event.y))})`)
        })
        .on('end', function(event, d) { d3.select(this).attr('y', d => tempScale(d) - 1).attr('height', 2) })
        .on('start.update drag.update', update)
        .on('end.update', endUpdate)

    function update(event, d) {
        ranges.attr('y', d => tempScale(d.max))
    }

    function endUpdate(event, d) {
        let i = globals.tempRanges.cutoffs.indexOf(d)
        let min = tempScale(globals.tempRanges.min + 1);
        let max = tempScale(globals.tempRanges.cutoffs[1] - 1);
        for (let i = 0; i < globals.tempRanges.cutoffs.length; i++) {
            let cutoff = globals.tempRanges.cutoffs[i];
            if (cutoff < d) {
                min = tempScale(cutoff + 1)
                max = tempScale(globals.tempRanges.cutoffs[i + 2] - 1 || globals.tempRanges.max - 1)
            }
        }
        value = Math.max(max, Math.min(min, event.y))
        globals.tempRanges.cutoffs[i] = tempScale.invert(value)
        drawTempRanges();
        drawBlanket();
        drilldown()
    }

    let cutoffs = g.selectAll('.cutoff').data(globals.tempRanges.cutoffs)
        .enter().append('g').attr('class', 'cutoff')
            .attr('transform', d => `translate(0, ${tempScale(d)})`)


    cutoffs
        .append('rect')
        .attr('x', 0)
        .attr('y', d => -6)
        .attr('width', 25)
        .attr('height', 12)
        .attr('opacity', 0)

    cutoffs
        .append('rect')
        .attr('x', 0)
        .attr('y', d => -1)
        .attr('width', 25)
        .attr('height', 2)
        .attr('fill', 'black')

    cutoffs.call(drag)

    let axis = d3.axisLeft(tempScale).tickValues(globals.tempRanges.values)

    svg.append('g')
        .attr('transform',`translate(${margin.left}, ${margin.top})`)
        .call(axis)
}

drawTempRanges();

function drilldown(dt) {
    if (!dt) dt = globals.selectedDate;
    let svg = d3.select("#drilldown>svg") // selects drilldown svg
    let edge = 300
    let width = edge
    let height = edge
    svg.attr('height', height).attr('width', width).html("")

    let datum = globals.data.data.filter(x => x.datetime == dt)[0]
    svg

    .selectAll('circle').data(d => ['tempmax','temp','tempmin'].map(x => {return {measurement:x, value:datum[x]}; })).enter()
        .append('circle')
        .attr('cx', 0.5*edge)
        .attr('cy', 0.5*edge)
        .attr('r', d => {
            if (d.measurement == 'tempmax') return 0.5*3/4*edge
            else if (d.measurement == 'temp') return 0.5*2/4*edge
            else if (d.measurement == 'tempmin') return 0.5*1/4*edge
        })
        .attr('fill', d => {
            if(d.value) {
                return color(d.value, false)
            } else {
                return 'lightgrey'
            }
        })

    let description = d3.select("#drilldown>div")
    description.html("")
    description.append("p")
        .text(dt)
    description.append("p")
        .text(`Max temp: ${datum.tempmax}`)
        .append("div").attr("class", "color-block").style("background", color(datum.tempmax))
    description.append("p")
        .text(`Average temp: ${datum.temp}`)
        .append("div").attr("class", "color-block").style("background", color(datum.temp))
    description.append("p")
        .text(`Min temp: ${datum.tempmin}`)
        .append("div").attr("class", "color-block").style("background", color(datum.tempmin))
}

function drawBlanket(){
    let data = globals.data
    let tempData = data.data
    let columns = globals.nColumns
    let edge = 32
    let rows = Math.ceil(tempData.length/columns)
    let width = columns * edge
    let height = rows * edge
    let offset = 0

    function indexToXY(i){
        let y = Math.floor((i + offset )/columns)
        let x = i + offset - y * columns
        return {x: x*edge, y: y*edge}
    }

    d3.select('header').html(`<h1>${data.displayName} ${data.year}</h1>`)

    // select element, adjust attributes
    let svg = d3.select("#blanket")
        .attr("width", width)
        .attr("height", height)

    svg.html("")

    let defs = svg.append('defs')

    defs.selectAll('.fg-color').data(Object.entries(yarnColors)).enter()
        .append('pattern')
        .attr('class', 'fg-color')
        .attr('id', d => `${d[0]}-fg`)
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('width', edge)
        .attr('height', edge)
        .append('image')
        .attr('href', d => d[1].url)
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', edge)
        .attr('height', edge)

    defs.selectAll('.bg-color').data(Object.entries(yarnColors)).enter()
        .append('pattern')
        .attr('id', d => `${d[0]}-bg`)
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('width', edge * 2)
        .attr('height', edge * 2)
        .append('image')
        .attr('href', d => d[1].url)
        .attr('x', -edge/2)
        .attr('y', -edge/2)
        .attr('width', edge * 2)
        .attr('height', edge * 2)


    let layer1 = svg.append('g')
    let layer2 = svg.append('g')


    // making a virtual selection of the class "square" & binding data
    let squares = layer1.selectAll(".square").data(tempData)
        .enter().append("g")
        .attr("class", "square")
        .attr("transform", (d,i) => `translate(${indexToXY(i).x},${indexToXY(i).y})`)

    squares
        .append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', edge)
        .attr('height', edge)
        .attr('fill', 'url(#darkGrey-bg)')
        .on("click", function(d){
            let dt = d.target.__data__.datetime
            globals.selectedDate = dt
            d3.select("#date").property("value", dt)
            drilldown(dt);
        })

    squares
        .selectAll('circle').data(d => ['tempmax','temp','tempmin'].map(x => {return {measurement:x, value:d[x]}; })).enter()
        .append('circle')
        .attr('cx', 0.5*edge)
        .attr('cy', 0.5*edge)
        .attr('r', d => {
            if (d.measurement == 'tempmax') return 0.5*3/4*edge
            else if (d.measurement == 'temp') return 0.5*2/4*edge
            else if (d.measurement == 'tempmin') return 0.5*1/4*edge
        })
        .attr('fill', d => {
            if(d.value) {
                return color(d.value, d.measurement != 'tempmin')
            } else {
                return 'url(#lightGrey-fg)'
            }
        })
        .style('pointer-events', "none")

    // let highlightSquares = layer2.selectAll(".highlight-square").data(tempData)
    //     .enter().append("g")
    //     .attr("class", "highlight-square")
    //     .attr("transform", (d,i) => `translate(${indexToXY(i).x},${indexToXY(i).y})`)


    // highlightSquares
    //     .append('rect')
    //     .attr('x', 0)
    //     .attr('y', 0)
    //     .attr('width', edge)
    //     .attr('height', edge)
    //     .attr('fill', 'none')
    //     .attr('stroke', 'magenta')
    //     .attr('stroke-width', 5)
    //     .attr('display', d => d.datetime == '2015-12-31' ? 'block': 'none')

    // highlightSquares
    //     .append('text')
    //     .attr('x', edge/2)
    //     .attr('y', edge/2)
    //     .attr('dy', edge/8)
    //     .attr('text-anchor', 'middle')
    //     .text(d => {
    //         let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    //         return months[d.month]
    //         })
    //     .style('font-weight', '800')
    //     .style('font-size', `${edge*5/16}px`)
    //     .style('font-family', 'sans-serif')
}

function update(fileName){
    d3.json(`data/${fileName}.json`).then(function(data) {
        // console.log(data)

        tempData = []

        d3.select("#date").property("value", `${data.year}-01-01`)

        // add January label
        let month = 0
        tempData.push({'type': 'label', 'month': month})
        tempData.push(data.data[0])
        // for loop to go through all of the data
        // create a new data array with a conditional to push current date or if today is a new month; month marker then current date
        for (let i = 1; i < data.data.length; i++) {
            if (data.data[i].datetime.slice(0, 7) == data.data[i-1].datetime.slice(0, 7)) {
                // create data
                tempData.push(data.data[i])
            }
            else {
                // create new month marker then data
                month++
                let label = {'type': 'label', 'month': month}
                tempData.push(label)
                tempData.push(data.data[i])
            }
        }
        data.data = tempData
        globals.data = data

        clearDrilldown()
        drawBlanket()
    })
}

function clearDrilldown(){
    d3.select("#drilldown>svg").html("")
    d3.select("#drilldown>div").html("")
}

d3.select('#location-select').on('change', function(){
    let fileName = d3.select(this).property('value')
    update(fileName)
})

update('Fort_Lee_2018')