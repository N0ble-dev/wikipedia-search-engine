let resultsContainer = document.getElementsByClassName("container")[0]
let searchInput = document.getElementById("searchInput")

const validateInput = (el) =>
{
    if (el.value === "") {
        resultsContainer.innerHTML = "<p>Type something in the above search input</p>"
    } else {
        generateResults(el.value)
    }
}


function debounce (func, delay)
{
    let timeoutId;

    return function ()
    {
        // Cancel the previous timer
        clearTimeout(timeoutId);

        // Set a new timer
        timeoutId = setTimeout(() =>
        {
            func.apply(this, arguments);
        }, delay);
    };
}

// Debounce the function with a delay of 900 milliseconds
const debouncedHandleInput = debounce(validateInput, 900);

// Add event listener for input on searchInput and call debouncedHandleInput
searchInput.addEventListener("input", function ()
{
    debouncedHandleInput(this);
});

const generateResults = (searchValue) =>
{
    fetch(
        "https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch="
        + searchValue
    )
        .then(response => response.json())
        .then(data =>
        {
            let results = data.query.search
            let numberOfResults = data.query.search.length
            // check if the result about what he search return value
            if (numberOfResults > 0) {
                resultsContainer.innerHTML = ""
                for (let i = 0; i < numberOfResults; i++) {
                    let result = document.createElement("div")
                    result.classList.add("results")
                    result.innerHTML = `
                    <div>
                        <h3>${results[i].title}</h3>
                        <p>${results[i].snippet}</p>
                    </div>
                    <a href="https://en.wikipedia.org/?curid=${results[i].pageid}" target="_blank">Read More</a>
                    `
                    resultsContainer.appendChild(result)
                }
            } else {
                resultsContainer.innerHTML = "<p>Sorry..We don't have data about what you search try something else</p>"
            }
        })
}
