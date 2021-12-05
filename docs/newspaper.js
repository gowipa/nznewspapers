/**
 * Load the data for a single newspaper.
 * @returns
 */
async function getPaper() {
  const urlParams = new URLSearchParams(window.location.search);
  const newspaperId = urlParams.get("id");
  const url = "data/papers/" + newspaperId + ".json";

  try {
    let res = await fetch(url);
    return await res.json();
  } catch (error) {
    console.log("Error in getPaper");
    console.log(error);
  }
}

function prettyYear(year) {
  if (year.endsWith("uuuu")) {
    return "an unknown date";
  } else if (year.endsWith("uu")) {
    var century = year.substring(0, 2);
    return "sometime in the " + century + "00's";
  } else if (year.endsWith("u")) {
    var decade = year.substring(0, 3);
    return "sometime in the " + decade + "0's";
  } else {
    return year;
  }
}

/**
 * Append a table row to a table body
 * @param {*} tbody The body of the table
 * @param {*} field The field name that we are adding
 * @param {*} value The value of said field
 */
function appendRow(tbody, field, value) {
  let row = document.createElement("tr");
  let row_data_field = document.createElement("td");
  row_data_field.innerHTML = field;
  let row_data_value = document.createElement("td");
  row_data_value.innerHTML = value;

  row.appendChild(row_data_field);
  row.appendChild(row_data_value);
  tbody.appendChild(row);
}

/**
 * Fill in the page title information.
 * @param {*} data Data describing the page comtent.
 */
function bannerBox(newspaper) {
  var box = document.querySelector(".bannerbox");
  var heading2 = document.querySelector("#pagetitle");
  heading2.innerHTML = newspaper.title;
}

/**
 * Fill in the Newspaper Title and summary information.
 * @param {*} newspaper Data describing this newspaper.
 */
function contentBox(newspaper) {
  var box = document.querySelector(".contentbox");

  var genreDiv = appendDiv(box, "genre");
  var para = document.createElement("p");
  var aboutText = document.createElement("em");
  aboutText.textContent = newspaper.genre;
  para.appendChild(aboutText);

  if (newspaper.urlCurrent) {
    appendText(para, " - ");
    appendLink(para, newspaper.urlCurrent, newspaper.title + " Website");
  }

  if (newspaper.urlDigitized) {
    appendText(para, " - ");
    appendLink(para, newspaper.urlDigitized, "Digitized Paper");
  }
  genreDiv.appendChild(para);

  // About this title
  var aboutDiv = appendDiv(box, "about");
  var aboutText = document.createElement("h3");
  aboutText.textContent = "About this Title";

  // Title has been published since 1938 in Opotiki (Opotiki District, Bay of Plenty). View online.
  aboutDiv.appendChild(aboutText);
  appendText(aboutDiv, newspaper.title);
  if (newspaper.finalYear == 9999) {
    appendText(
      aboutDiv,
      " has been published since " + prettyYear(newspaper.firstYear)
    );
  } else {
    appendText(
      aboutDiv,
      " was published from " +
        prettyYear(newspaper.firstYear) +
        " to " +
        prettyYear(newspaper.finalYear)
    );
  }
  appendText(
    aboutDiv,
    " in " +
      newspaper.placename +
      " (" +
      newspaper.district +
      ", " +
      newspaper.region +
      ")."
  );

  if (newspaper.urlCurrent) {
    appendLink(aboutDiv, newspaper.urlCurrent, " View Online");
  }

  // table attempt

  var tableDiv = appendDiv(box, "elements");
  var tableText = document.createElement("h3");
  tableText.textContent = "Key Elements";
  tableDiv.appendChild(tableText);

  let table = document.createElement("table");
  let thead = document.createElement("thead");
  let tbody = document.createElement("tbody");

  var classAttr = document.createAttribute("class");
  classAttr.value = "simpletable";
  table.setAttributeNode(classAttr);

  table.appendChild(thead);
  table.appendChild(tbody);

  // Adding the entire table to the body tag

  tableDiv.appendChild(table);

  // Creating and adding data to first row of the table

  let row_1 = document.createElement("tr");
  let heading_1 = document.createElement("th");
  heading_1.innerHTML = "Field";
  let heading_2 = document.createElement("th");
  heading_2.innerHTML = "Value";

  row_1.appendChild(heading_1);
  row_1.appendChild(heading_2);
  thead.appendChild(row_1);

  //"title": "Chronicle (Kerikeri)",
  //"genre": "Newspaper",
  //"firstYear": "1988",
  //"finalYear": "2003",
  //"district": "Far North District",
  //"idMarcControlNumber": "3561188",
  //"idNZNewspapersV1": "13011",
  //"isCurrent": false,
  //"placecode": "01-01",
  // "placename": "Kerikeri",
  // "region": "Northland",
  // "links": {
  //  "1031": {
  //    "direction": "Succeeding",
  //    "relationship": "Continued by",
  //   "target-description": "Bay Chronicle"

  // Creating and adding data to second row of the table
  appendRow(tbody, "Title", newspaper.title);
  appendRow(tbody, "Genre", newspaper.genre);
  appendRow(tbody, "First Year", newspaper.firstYear);
  appendRow(tbody, "Final Year", newspaper.finalYear);
  // Creating and adding data to third row of the table

  /* );<h3>About this title</h3>

      <p>
        <em><span id="newspaper-title">Title</span></em>
        has been published since <span class="first-year">1938</span> in
        <a href="place?place=Opotiki">Opotiki</a>
        (<a href="place?district=Opotiki District">Opotiki District</a>,
        <a href="place?region=Bay of Plenty">Bay of Plenty</a>).

        <a href="http://www.opotikinews.co.nz/">View online</a>.
      </p> */
}

async function render() {
  const data = await getPaper();
  console.log("AAA newspaper");
  console.log(data);

  document.title = data.title + " - Newspapers of New Zealand";
  bannerBox(data);
  contentBox(data);
}

render();
