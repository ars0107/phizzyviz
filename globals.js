// Create global state values
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

globals.selectedDate = "2020-01-01"


