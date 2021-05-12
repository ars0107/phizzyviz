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

d3.json('data/austin_15.json').then(function(data) {
    console.log(data)
    // edge will be for each blanket square in pixels
    // 375 total squares (365 + 10); 375 = 15 * 25


    
    let indexArray = []
    
    // slicing months
    for (let i = 1; i < data.length; i++) {
        if (data[i].datetime.slice(0, 7) != data[i-1].datetime.slice(0, 7)) {
            indexArray.push(i)
        }
    }
    
    console.log(indexArray.reverse())
    
    for (let i = indexArray.length; i >= 0; i--) {
        let item = {'type': 'label', 'month': i}
        data.splice(indexArray[i], 0, item)
    }
    
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
    
    let layer1 = svg.append('g')
    let layer2 = svg.append('g')
    
    
        // making a virtual selection of the class "square" & binding data
    let squares = layer1.selectAll(".square").data(data)
        .enter().append("g")
        .attr("class", "square")
        .attr("transform", (d,i) => `translate(${indexToXY(i).x},${indexToXY(i).y})`)
    
    function color(val){
        if (val >= 100) return 'darkred';
        else if (val >= 90) return 'red';
        else if (val >= 80) return 'orange';
        else if (val >= 70) return 'yellow';
        else if (val >= 60) return 'green';
        else if (val >= 50) return 'darkgreen';
        else if (val >= 40) return 'lightblue';
        else if (val >= 30) return 'blue';
        else if (val >= 20) return 'mediumpurple';
        else if (val >= 10) return 'darkorchid';
        else if (val >= 0) return 'hotpink';
        else return 'magenta';
    }
    
    squares    
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', edge)
      .attr('height', edge)
      .attr('fill', '#888')
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
        .attr('fill', d => color(d.value))
        .attr('stroke', d => d3.color(color(d.value)).darker())
    
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
})

