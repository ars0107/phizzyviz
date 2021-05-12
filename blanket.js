let data = []
let backgroundColor = "black"

// for (let i = 0; i < 365; i++) {

//     let min = Math.random() * 20 + 20
//     let max = min + Math.random() * 60
//     let avg = .5 * (min + max)

//     let day = {
//         min: min,
//         max: max,
//         avg: avg
//     }

//     data.push(day)
// };

d3.json('data/davis_06.json').then(function(data) {
    console.log(data)
    
    let indexArray = []
    
    // slicing months
    for (let i = 1; i < data.length; i++) {
        if (data[i].datetime.slice(0, 7) != data[i-1].datetime.slice(0, 7)) {
            indexArray.push(i)
        }
    }
    
    for (let i = 0; i < indexArray.length; i++) {
        let item = {'type': 'label', 'month': 11-i}
        data.splice(indexArray[indexArray.length - 1 - i], 0, item)
    }

    // Add January label
    data.splice(0, 0, {'type': 'label', 'month': 0})

    console.log(data)
    
    let columns = 15
    let edge = 32
    let rows = Math.ceil(data.length/columns)
    let width = columns * edge
    let height = rows * edge
    let offset = 0
    
    function indexToXY(i){
        // example: i = 0
        // x = 5, y = 0
        // example (end of line)
        // x = 14, y = 0, so i = 9
    
        let y = Math.floor((i + offset )/columns)
        let x = i + offset - y * columns
        return {x: x*edge, y: y*edge}
    
        // todo: one more example to work through
        // i = Cam's birthday 
        // todo: figure out the i value of Cam's b-day
    }
    
    // select element, adjust attributes
    let svg = d3.select("#blanket")
        .attr("width", width)
        .attr("height", height)
    
    let yarnColors = [
        {'name':'aubergine','url':'/images/aubergine-132.jpg'},
        {'name':'coral','url':'/images/coral-135.jpg'},
        {'name':'corn','url':'/images/corn-120.jpg'},
        {'name':'dusty-blue','url':'/images/dusty-blue-149.jpg'},
        {'name':'dutch-blue','url':'/images/dutch-blue-125.jpg'},
        {'name':'green','url':'/images/green-146.jpg'},
        {'name':'magenta','url':'/images/magenta-133.jpg'},
        {'name':'pineapple','url':'/images/pineapple-152.jpg'},
        {'name':'red','url':'/images/red-112.jpg'},
        {'name':'tangerine','url':'/images/tangerine-151.jpg'},
        {'name':'teal','url':'/images/teal-107.jpg'},
        {'name':'violet','url':'/images/violet-131.jpg'},
        {'name':'wine','url':'/images/wine-117.jpg'},
        {'name':'light-grey-fg', 'url':'/images/light-grey-103.jpg'},
    ]

    let bgYarnColors = [
        {'name':'light-grey-bg', 'url':'/images/light-grey-103.jpg'},
        {'name':'dark-grey-bg', 'url':'/images/dark-grey-104.jpg'},
    ]

    let defs = svg.append('defs')

    defs.selectAll('.fg-color').data(yarnColors).enter()
        .append('pattern')
        .attr('class', 'fg-color')
        .attr('id', d => d.name)
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('width', edge)
        .attr('height', edge)
      .append('image')
        .attr('href', d => d.url)
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', edge)
        .attr('height', edge)

    defs.selectAll('.bg-color').data(bgYarnColors).enter()
        .append('pattern')
        .attr('id', d => d.name)
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('width', edge * 2)
        .attr('height', edge * 2)
      .append('image')
        .attr('href', d => d.url)
        .attr('x', -edge/2)
        .attr('y', -edge/2)
        .attr('width', edge * 2)
        .attr('height', edge * 2)


    let layer1 = svg.append('g')
    let layer2 = svg.append('g')
    
    
        // making a virtual selection of the class "square" & binding data
    let squares = layer1.selectAll(".square").data(data)
        .enter().append("g")
        .attr("class", "square")
        .attr("transform", (d,i) => `translate(${indexToXY(i).x},${indexToXY(i).y})`)
    
    function color(val){
        //if (val >= 100) return 'darkred';
        if (val >= 100) return 'url(#wine)'
        else if (val >= 90) return 'url(#red)';
        else if (val >= 80) return 'url(#tangerine)';
        else if (val >= 70) return 'url(#corn)';
        else if (val >= 60) return 'url(#green)';
        else if (val >= 50) return 'url(#teal)';
        else if (val >= 40) return 'url(#dusty-blue)';
        else if (val >= 30) return 'url(#dutch-blue)';
        else if (val >= 20) return 'url(#violet)';
        else if (val >= 10) return 'url(#aubergine)';
        else if (val >= 0) return 'url(#coral)';
        else return 'url(#magenta)';
    }
    
    squares    
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', edge)
      .attr('height', edge)
      //.attr('fill', '#615b58')
      .attr('fill', 'url(#dark-grey-bg)')
//       .attr('stroke', d => d.datetime == '2007-09-28' ? 'magenta': '#888')

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
                return color(d.value)
            } else {
                return 'url(#light-grey-fg)'
            }
        })
        //.attr('stroke', d => d3.color(color(d.value)).darker())
    
    let highlightSquares = layer2.selectAll(".highlight-square").data(data)
        .enter().append("g")
        .attr("class", "highlight-square")
        .attr("transform", (d,i) => `translate(${indexToXY(i).x},${indexToXY(i).y})`)  
    
    
    highlightSquares    
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', edge)
      .attr('height', edge)
      .attr('fill', 'none')
      .attr('stroke', 'magenta')
      .attr('stroke-width', 5)
      .attr('display', d => d.datetime == '2015-12-31' ? 'block': 'none')

    highlightSquares
        .append('text')
        .attr('x', edge/2)
        .attr('y', edge/2)
        .attr('dy', edge/8)
        .attr('text-anchor', 'middle')
        .text(d => {
            let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            return months[d.month]
            })
        .style('font-weight', '800')
        .style('font-size', `${edge*5/16}px`)
        .style('font-family', 'sans-serif')
})

