let selectorElement;

const displayError = (error) => {
    const errorElement = document.getElementById("errmsg");
    errorElement.innerText = error;
    errorElement.classList.remove('visually-hidden');
}

const hideError = () => {
    const errorElement = document.getElementById("errmsg");
    errorElement.innerText = '';
    errorElement.classList.add('visually-hidden');
}

const displayResults = (results) => {
    if (!results.length) {
        displayError('Display Results Error: No results found.');
    }


    results.forEach((result) => {
        doAddCard(result);
    })

    hideError();
}

const doAddCard = (result) => {
    const cards = document.getElementById("cards");

    const card = document.createElement('div');
    card.className = 'card';

    const body = document.createElement('div');
    body.className = 'card-body';

    const info = document.createElement('p');
    info.className = 'card-text';
    info.textContent = JSON.stringify(result);

    body.appendChild(info);
    card.appendChild(body);

    cards.appendChild(card);
}

const doLoadRecordings = async () => {
    try {
        const recordings = await getRecordings();
        displayResults(recordings);
    } catch (error) {
        displayError(`Load Recordings Error: ${error.message}`);
    }
}

const onSelectChange = async () => {
    // const selectorElement = document.getElementById("querySelect");
    const query = selectorElement.value;
    console.log("I was selected");

    try {
        if (selectorElement.value === 1) {
            doLoadRecordings();
        } else {
            const results = await conductQuery(queryMap[query]);
            displayResults(results);
        }
    } catch (error) {
        displayError(`Select Change Error: ${error.message}`);
    }
}

window.onload = () => {
    doLoadRecordings();
    selectorElement = document.getElementById("selector");
    selectorElement.addEventListener("change", onSelectChange);
}