// nznimport-newspapers.js
// Reads newspaper data from tab-seperated archived data file and writes to JSON.

var fs = require("fs");
var parse = require("csv-parse");

var inputDirectory = process.cwd() + "/data-import/2015-02-01-nznewspapers";
var jsonDirectory = process.cwd() + "/docs/data/json";

if (process.argv[2]) {
  inputDirectory = process.argv[2];
  if (process.argv[3]) {
    jsonDirectory = process.argv[3];
  }
}

var inputFilename = inputDirectory + "/newspapers.txt";
if (!fs.existsSync(inputFilename)) {
  console.error("Missing input file: " + inputFilename);
  process.exit(1);
}

console.log("Running: " + process.argv[1]);
console.log("Input dir: " + inputDirectory);
console.log("Input file: " + inputFilename);
console.log("Output dir: " + jsonDirectory);

if (!fs.existsSync(jsonDirectory)) {
  fs.mkdirSync(jsonDirectory, { recursive: true });
}

/**
 * Read (or create) a newspaper JSON file and update it with new data.
 * @param  {string} record Newspaper info in JSON format
 */
function updateNewspaperRecord(record) {
  var id = record.Id;
  var filename = jsonDirectory + "/" + id + ".json";

  // Read any existing record:
  newspaper = {};
  try {
    if (fs.existsSync(filename)) {
      newspaper = JSON.parse(fs.readFileSync(filename));
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  // Update with new data:
  for (var key in record) {
    // console.log(key);
    if (key == "Id") {
      newspaper.id = id;
    } else if (key == "Current?") {
      newspaper["is-current"] = record[key];
    } else if (key == "Placecode") {
      newspaper["nzn-placecode"] = record[key];
    } else if (key == "Modified At" || key == "Modified By") {
      // Ignore
    } else {
      if (record[key] != "") {
        newKey = key.toLowerCase().replaceAll(" ", "-");
        newspaper[newKey] = record[key];
      }
    }
  }

  if (newspaper.revision) {
    newspaper.revision += 1;
  } else {
    newspaper.revision = 1;
  }

  // Write back record:
  const newspaperJson = JSON.stringify(newspaper, null, 2);

  fs.writeFile(filename, newspaperJson, (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
  });
}

function parseNewspaperRows(err, records) {
  console.log("Start parseNewspaperRows()");
  var count = 0;
  var countGenre = {};

  if (err) {
    //handle error
    console.log("Error parsing newspaper records.");
    console.log(err);
    return;
  }

  records.forEach(function (arrayItem) {
    count += 1;
    var genre = arrayItem.Genre;

    updateNewspaperRecord(arrayItem);

    if (countGenre[genre]) {
      countGenre[genre] += 1;
    } else {
      countGenre[genre] = 1;
    }
  });

  console.log("End parseNewspaperRows(): " + count + " records");
  console.log(countGenre);
}

var newspaperParser = parse(
  {
    columns: true,
    delimiter: "\t",
    trim: true,
    skip_empty_lines: true,
  },
  parseNewspaperRows
);

console.log("Starting Read");
fs.createReadStream(inputFilename).pipe(newspaperParser);
