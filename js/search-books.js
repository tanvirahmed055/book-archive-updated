const button = document.getElementById("submit-btn");


// handle search button event
button.addEventListener('click', (e) => {
    e.preventDefault();

    document.getElementById("error-message").innerHTML = "";
    document.getElementById("book-items").innerHTML = "";
    document.getElementById("count-detail").innerHTML = "";

    const searchText = document.getElementById("input-value").value;

    if (searchText.length > 0) {
        // display spinner
        document.getElementById("spinner").classList.remove("d-none");
        getBookData(searchText);
    } else {
        document.getElementById("error-message").innerHTML =
            "<h2 class='text-center p-5 bg-danger text-white fw-bold'>Please enter a book name in the search box</h2>";
    }

});


//function for passing url to fetch data based on dynamic search input
const getBookData = (bookName) => {
    bookCardDiv(`https://openlibrary.org/search.json?q=${bookName}`);
}


//function for displaying all books results by search after getting fetched data
const bookCardDiv = url => {
    fetchedData(url)
        .then(data => {
            // turning off spinner
            document.getElementById("spinner").classList.add("d-none");

            const { docs, numFound } = data;

            displayCount(numFound);

            const first30Books = docs.slice(0, 30);

            const bookContainer = document.getElementById("book-items");

            first30Books?.forEach(element => {
                const { cover_i, title, author_name, first_publish_year, publisher } = element;

                const bookDiv = document.createElement('div');

                bookDiv.classList.add = "col";

                bookDiv.innerHTML = `<div class="card h-100 shadow rounded p-3">
                <img src="https://covers.openlibrary.org/b/id/${cover_i ? cover_i : 10909258}-M.jpg" class="card-img-top" alt="...">
                <div class="card-body">
                  <h5 class="card-title fw-bolder">Book Name: ${title ? title : 'No Book Name Found'}</h5>
                  <p class="card-text fw-bold">Author Name: ${author_name ? author_name.slice(0, 10) : 'No Author Name Found'}</p>
                  <p class="card-text fw-bold">Published Year: ${element.first_publish_year ? first_publish_year : 'No Publish Year Found'}</p>
                  <p class="card-text fw-bold">Publisher Name: ${publisher ? publisher.slice(0, 5) : 'No Publisher Name Found'}</p>               
                </div>
              </div>`
                bookContainer.appendChild(bookDiv);
            });
        })
    //clear search field
    document.getElementById("input-value").value = "";
}


//function for fetching data
const fetchedData = async (url) => {
    const res = await fetch(url);
    const data = await res.json();
    return data;
}


//function for showing counting results details
const displayCount = numOfResults => {
    const countContainer = document.getElementById("count-detail");
    if (numOfResults > 0) {
        const searchCountDiv = document.createElement('div');
        searchCountDiv.innerHTML = `
    <div class="mt-5 mb-3"><h3 class="text-center text-danger fw-bold">Showing first 30 results out of ${numOfResults} results.<h3></div>`
        countContainer.appendChild(searchCountDiv);
    } else {
        errorMessage();
    }
}

//function for showing error message.
const errorMessage = () => {
    const searchText = document.getElementById("input-value").value;
    const errorMessageDiv = document.getElementById("error-message");

    errorMessageDiv.innerHTML = `<div class="card m-auto p-5 bg-danger text-white fw-bold" >
          <h1 class="card-title text-center">No Result Found</h1>
        </div>`;
};