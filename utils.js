const log = console.log;
const chalk =  require('chalk');
const orange = chalk.hex('#FF9900');

const measurementOptions = ["mile", "fathom", "yard", "inch", "marathon"]

const validator = (type, answer) => {
  if (!answer) false
  else if (type === inputs.DISTANCE.title) {
    const trimmedInput = answer.trim()
    // input always comes through as a string. parseInt converts input
    // to a number (if not, returns NaN)
    const isNumber = !isNaN(parseInt(answer))
    if (isNumber) {
      return true 
    } else {
      return false
    }
  }
  else if (type === inputs.MEASUREMENT.title) {
    // measurements validation requires that the user input be one of the predefined options
    return measurementOptions.includes(answer) ? true : false
  } else if (type === inputs.LOCATION.title) {
    return answer.length < 50 ? true : false
  } else {
    // all other inputs have a less-than-50-character limit
    const noNumAndLessThanFifty = answer.length < 50 && /^([^0-9]*)$/.test(answer)
    return noNumAndLessThanFifty ? true : false
  }
}


const inputs = {
  DISTANCE: {
    title: "distance",
    promptText: "\n\nEnter a distance (must be a number): ",
    errorText: "Whoops! Distance must be a number.  Try again...\n",
    errorLimitFn: () => {
      const randomNum = Math.ceil(Math.random() * 100)
      log(orange(`It's fine, you'll get the hang of it - For now I just picked '${randomNum}' for you\n`))
      return randomNum
    }
  },
  MEASUREMENT: {
    title: "measurement",
    promptText: "\n\nEnter a measurement from one of these options ('mile', 'fathom', 'yard', 'inch', 'marathon'): ",
    errorText: "Whoops! Measurement must be one of these options ('mile', 'fathom', 'yard', 'inch', 'marathon').  Try again...\n",
    errorLimitFn: () => {
      const randomItem = measurementOptions[Math.floor(Math.random() * measurementOptions.length)]
      log(orange(`Fool me once, strike one. But fool me twice... strike three. I just went ahead and picked '${randomItem}' for you\n`))
      return randomItem
    }
  },
  LOCATION: {
    title: "location",
    promptText: "\n\nEnter a location (should be between 1 and 50 characters): ",
    errorText: "Whoops! Location must be between 1 and 50 characters in length.  Try again...",
    errorLimitFn: () => {
      const defaultLocation = "Boring, Oregon"
      log(orange(`Why don't we just go with '${defaultLocation}'\n`))
      return defaultLocation
    }
  },
  ADJECTIVE: {
    title: "adjective",
    promptText: "\n\nEnter an adjective (something fun, but less than 50 characters): ",
    errorText: "Whoops! Adjective must be between 1 and 50 characters (but no numbers) in length.  Try again...",
    errorLimitFn: () => {
      const defaultAdjective = "frictionless"
      log(orange(`Maybe let's say... '${defaultAdjective}'\n`))
      return defaultAdjective
    }
  },
  NOUN: {
    title: "noun",
    promptText: "\n\nEnter an noun (something even more fun, same character limit): ",
    errorText: "Whoops! Noun must be between 1 and 50 characters (but no numbers) in length.  Try again...",
    errorLimitFn: () => {
      const defaultNoun = "aardvark"
      log(orange(`Uh oh - Let's try '${defaultNoun}'\n`))
      return defaultNoun
    }
  },
}

const conversionChart = {
  "inch": 63360,
  "yard": 1760,
  "fathom": 880,
  "mile": 1,
  "marathon": (1/26.2)
}

const renderStory = (storyDetails) => {
  const { distance, measurement, location, adjective, noun } = storyDetails
  const indefiniteArticles = () => {
    // this isn't completely correct, but I cant think
    // of another way to handle it.  It will be right most
    // of the time.  (examples that would be wrong - "honest", "one-eyed")
    const vowels = ["a", "e", "i", "o", "u"];
    return vowels.includes(adjective[0]) ? "an" : "a"
  }
  return `  · One day Anna was walking her ${distance} ${measurement} commute to ${location} and found ${indefiniteArticles()} ${adjective} ${noun} on the ground.`
}

const getMostCommon = (arr, key) => {
  const newObj = {}
  // separate into array of objects with location as the key
  // and the number of times it was submitted as the value 
  arr.forEach(entry => {
    const item = entry[key].toLowerCase();
    if (newObj[item]) {
      newObj[item] += 1
    } else {
      newObj[item] = 1
    }
  })

  // gets the max value(s) from the list created above
  const highNum = Math.max(...Object.values(newObj));

  // creates a list of the most common values
  const mostCommonList =
        Object.entries(newObj)
        .filter((entry) => entry[1] === highNum)
        .map(item => `'${item[0]}'`)

  // shows count of most common item(s) in the list
  const count = `(${highNum} time${highNum > 1 ? "s": ""}${mostCommonList.length > 1 ? " each" : ""})`

  log(orange(`  · Most common ${key}${mostCommonList.length > 1 ? "s" : ""}: ${mostCommonList.join(", ")} ${count}`))
}

module.exports = {
  validator,
  inputs,
  conversionChart,
  renderStory,
  measurementOptions,
  getMostCommon
};
