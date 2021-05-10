let data = []
let backgroundColor = "black"

for (let i = 0; i < 365; i++) {

    let min = Math.random() * 20 + 20
    let max = min + Math.random() * 60
    let avg = .5 * (min + max)

    let day = {
        min: min,
        max: max,
        avg: avg
    }

    data.push(day)
};

console.log(data)
// edge will be for each blanket square in pixels
// 375 total squares (365 + 10); 375 = 15 * 25
let edge = 32
let width = 15 * edge
let height = 25 * edge

function indexToXY(i){
    // example: i = 0
    // x = 5, y = 0
    // example (end of line)
    // x = 14, y = 0, so i = 9

    let y = Math.floor((i + 5 )/15)
    let x = i + 5 - y * 15
    return {x: x*edge, y: y*edge}

    // todo: one more example to work through
    // i = Cam's birthday 
    // todo: figure out the i value of Cam's b-day
}

// select element, adjust attributes
let svg = d3.select("#blanket")
    .attr("width", width)
    .attr("height", height)

// making a virtual selection of the class "square" & binding data
let squares = svg.selectAll(".square").data(data)

function color(val){
    if (val >= 100) return 'darkred';
    else if (val >= 90) return 'red';
    else if (val >= 80) return 'orange';
    else if (val >= 70) return 'yellow';
    else if (val >= 60) return 'green';
    else if (val >= 50) return 'darkgreen';
    else if (val >= 40) return 'lightlbue';
    else if (val >= 30) return 'blue';
    else if (val >= 20) return 'mediumpurple';
    else if (val >= 10) return 'darkorchid';
    else if (val >= 0) return 'hotpink';
    else return 'magenta';
}

// function to make concentric circles representing temps
// todo: add border, reduce radiuses of circles
function makeSquare(d){
    let outputString = ""
    outputString += `<rect x=0 y=0 height=${edge} width=${edge} fill=${backgroundColor}></rect>` // drawing the rectangle from upper left corner to bottom right corner
    // largest circle (avg)
    outputString += `<circle cx=${0.5*edge} cy=${0.5*edge} r=${0.5*edge*3/3} fill=${color(d.avg)}></circle>`
    // middlest circle (max)
    outputString += `<circle cx=${0.5*edge} cy=${0.5*edge} r=${0.5*edge*2/3} fill=${color(d.max)}></circle>`
    // smallest circle (min)
    outputString += `<circle cx=${0.5*edge} cy=${0.5*edge} r=${0.5*edge*1/3} fill=${color(d.min)}></circle>`
    // return the output strings
    return outputString
}

// for squares that do not yet have an object associated with them, will be created
squares.enter().append("g")
    .attr("class", "square")
    .attr("transform", (d,i) => `translate(${indexToXY(i).x},${indexToXY(i).y})`)
    .html(makeSquare)
