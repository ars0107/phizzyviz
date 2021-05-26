function parseData(data) {
    tempData = []

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

    return data   
}