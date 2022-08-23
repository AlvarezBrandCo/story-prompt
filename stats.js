const fs = require('fs')
const readline = require('readline');
const chalk =  require('chalk');
const { inputs, conversionChart, renderStory, getMostCommon } = require('./utils')
const error = chalk.red;
const orange = chalk.hex('#FF9900');
const blue = chalk.hex('#326f84');

const readInterface = readline.createInterface({
  input: fs.createReadStream('log.txt'),
  output: process.stdout,
  terminal: false
});

const log = console.log;

// reads from 'log.txt' and parses the json strings to a usable json object
const readToJson = async () => {
  const arr = []
  return new Promise((resolve, reject) => {
    readInterface.on('line', function(line) {
      arr.push(JSON.parse(line))
      resolve(arr)
    });
  })
}

const getLongestItem = (list, key) => {
  const longest = list.reduce((a, b) => a[key].length > b[key].length ? a : b);
  log(orange(`  · Longest adjective: ${longest[key]} (${longest[key].length} characters!)`))
}

const sendStats = async () => {

  const jsonArr = await readToJson()
  
  // to make it easier for the user to compare distances they will all be relative to 'miles'
  const convertDistancesToMiles = jsonArr.map(item => {
    const { distance, measurement } = item;
    if (isNaN(distance)) {
      return 0
    } else {
      return distance / conversionChart[measurement] 
    }
  }).filter(num => !isNaN(num))
  
  const maxDistance = convertDistancesToMiles.length > 0 ? Math.max(...convertDistancesToMiles) : "no info"
  const minDistance = Math.min(...convertDistancesToMiles)
  const avgDistance = convertDistancesToMiles.reduce((accum, curr) => {
    return accum += curr
  }, 0) / convertDistancesToMiles.length

  log(blue("\n----------------------------------------------"))

  // distance stats
  log(orange.bold("\nDistance stats:"))
  log(orange(`  · Max distance: ${maxDistance.toLocaleString()} miles`))
  log(orange(`  · Min distance: ${minDistance.toLocaleString()} miles`))
  log(orange(`  · Avg distance: ${avgDistance.toLocaleString()} miles`))
  log(blue("\n---\n"))  

  // measurement stats
  log(orange.bold("Measurement stats:"))
  getMostCommon(jsonArr, "measurement")
  log(blue("\n---\n"))
  
  // location stats
  log(orange.bold("Location stats:"))
  getMostCommon(jsonArr, "location")
  log(blue("\n---\n"))

  // adjective stats
  log(orange.bold("Adjective stats:"))
  getLongestItem(jsonArr, "adjective")
  log(blue("\n---\n"))

  // noun stats
  log(orange.bold("Noun stats:"))
  getLongestItem(jsonArr, "noun")
  log(blue("\n---\n"))

  // stories
  log(orange.bold(`First story:`))
  log(orange(renderStory(jsonArr[0])))
  log(orange.bold(`\nMost recent story:`))
  log(orange(renderStory(jsonArr[jsonArr.length - 1])))
  log(blue("\n----------------------------------------------\n"))
}

sendStats()

