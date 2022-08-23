const fs = require('fs')
const readline = require('readline');
const chalk =  require('chalk');
const {inputs, renderStory, measurementOptions, validator} = require('./utils')
const orange = chalk.hex('#FF9900');
const blue = chalk.hex('#326f84');
const log = console.log;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

// empty obj that we'll use to organize input responses
let obj = {};

function getInput(prompt, type, errMessage) {
  return new Promise((resolve, reject) => {
    rl.question(prompt, (answer) => {
      const isDistanceType = type === inputs.DISTANCE.title
      validator(type, answer) ?
        resolve(obj[type] = isDistanceType ? parseInt(answer): answer):
        reject(errMessage)
    });
  });
} 

function startAnotherStory() {
  return new Promise((resolve, reject) => {
    rl.question("Make another story? (type 'y' or 'n') ", (answer) => {
      if (answer === "y") {
        getInfo()
      } else if (answer === "n") {
        log("thanks for playing")
      } else {
        log("\n incorrect entry")
        startAnotherStory()
        rl.close()
      }
    })
  })
}

const handleInput = async (type) => {
  const {title, promptText, errorText, errorLimitFn } = type;
  try {
    await getInput(promptText, title, errorText)
  } catch (err) {
    log(orange.bold(err))
    await getInput(promptText, title, errorText)
      .catch(async err => {
        obj[title] = errorLimitFn()
      })
  }
}

const writeToFile = () => {
  var writeLine = fs.createWriteStream('log.txt', {
    // this flag appends data instead of overwriting
    flags: 'a' 
  })
  writeLine.write(`${JSON.stringify(obj)}\n`)
}

async function getInfo() {
  log(orange("\n\nWelcome to Common Paper mad libs:\nFollow the prompts to reveal the final story."))

  const { DISTANCE, MEASUREMENT, LOCATION, ADJECTIVE, NOUN } = inputs;
  
  await handleInput(DISTANCE)
  await handleInput(MEASUREMENT)
  await handleInput(LOCATION)
  await handleInput(ADJECTIVE)
  await handleInput(NOUN)

  const { distance, measurement, location, adjective, noun } = obj

  log("\n\n\nYour story:")
  log("--------")  
  log(blue.bold(renderStory(obj)))
  log("--------")  
  writeToFile()
  startAnotherStory()
}

getInfo()

