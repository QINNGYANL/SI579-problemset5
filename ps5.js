const wordInput = document.getElementById('word_input');
const showRhymesButton = document.querySelector('#show_rhymes');
const Output = document.querySelector('#word_output');
const descOutput = document.querySelector('#output_description');
const showSynonymsButton = document.querySelector('#show_synonyms');
const showSaveWords = document.querySelector('#saved_words');
const save = [];
showSaveWords.innerHTML = "(none)";
var is_empty = true;
function getRhymes(rel_rhy, callback) {
    //utput.textContent = "...loading";
    fetch(`https://api.datamuse.com/words?${(new URLSearchParams({rel_rhy})).toString()}`)
        .then((response) => response.json())
        .then((data) => {
            callback(data);
        }, (err) => {
            console.error(err);
        });
}

function getSimilarMeaning(ml, callback) {
    //Output.textContent = "...loading";
    fetch(`https://api.datamuse.com/words?${(new URLSearchParams({ml})).toString()}`)
        .then((response) => response.json())
        .then((data) => {
            callback(data);
        }, (err) => {
            console.error(err);
        });
}

const keyboard = document.getElementById('word_input');
keyboard.addEventListener("keydown", ()=>{
    if (event.key === 'Enter'){
        updateOutput();
        //updateDescription();
    }
});

showRhymesButton.addEventListener('click', ()=>{
    updateOutput();
    //updateDescription();
});

showSynonymsButton.addEventListener('click', ()=>{
    updateSimilar();
    //updateDescriptionSimilar();
});
function updateOutput(){
    getRhymes(wordInput.value, (result) => {
        // console.log(wordInput.value);
        console.log(result.length);
        if (result.length != 0) {
            is_empty = false;
        }
        else {
            is_empty = true;
        }
        updateDescription();
        Output.textContent = '';
        //console.log(result);
        result = groupBy(result, 'numSyllables');
        //console.log(result);
        for (const key in result){
            const heading = document.createElement('h3');
            heading.setAttribute('class', "numberofsyllable");
            heading.innerHTML = key + " syllable:";
            Output.append(heading);
            const words = result[key];
                for (const key in words){
                    const word = words[key];
                    //console.log(word);
                    const wordlist = document.createElement('li');
                    //wordlist.setAttribute('class', "list-group-item");
                    wordlist.textContent = word.word;
                    Output.append(wordlist);

                    const savebutton = document.createElement('button');
                    savebutton.setAttribute('class', "btn btn-outline-success");
                    savebutton.textContent = "save";
                    Output.append(savebutton);

                    savebutton.addEventListener('click', ()=>{
                        save.push(word.word);
                        showSaveWords.innerHTML = save.join(', ');
                    });
                }
        }
    });
}





function updateSimilar(){
    getSimilarMeaning(wordInput.value, (result) => {
        // console.log(wordInput.value);
        // console.log(result);
        if (result.length != 0) {
            is_empty = false;
        }
        else {
            is_empty = true;
        }
        updateDescriptionSimilar();
        Output.textContent = '';
        //console.log(result);
        for (const key in result){
            //console.log(key);
            const word = result[key];
            const wordlist = document.createElement('li');
           // const button = document.createElement('button');
            //wordlist.setAttribute('class', "list-group-item");
            wordlist.textContent = word.word;
            Output.append(wordlist);

            const savebutton = document.createElement('button');
            savebutton.setAttribute('class', "btn btn-outline-success");
            savebutton.textContent = "save";
            Output.append(savebutton);

            savebutton.addEventListener('click', ()=>{
                save.push(word.word);
                showSaveWords.innerHTML = save.join(', ');
            });

        }
    });
}

function updateDescription(){
    if (!is_empty) {
        descOutput.innerHTML = "Words that rhyme with " + wordInput.value + ":";
    }
    else {
        descOutput.innerHTML = "(no results)";
    }
    //console.log(descOutput.value);
}

function updateDescriptionSimilar(){
    if(!is_empty){
        descOutput.innerHTML = "Words with a similar meaning to " + wordInput.value + ":";
    }
    else {
        descOutput.innerHTML = "(no results)";
    }
}

function groupBy(objects, property) {
    // If property is not a function, convert it to a function that accepts one argument (an object) and returns that object's
    // value for property (obj[property])
    if(typeof property !== 'function') {
        const propName = property;
        property = (obj) => obj[propName];
    }

    const groupedObjects = new Map(); // Keys: group names, value: list of items in that group
    for(const object of objects) {
        const groupName = property(object);
        //Make sure that the group exists
        if(!groupedObjects.has(groupName)) {
            groupedObjects.set(groupName, []);
        }
        groupedObjects.get(groupName).push(object);
    }

    // Create an object with the results. Sort the keys so that they are in a sensible "order"
    const result = {};
    for(const key of Array.from(groupedObjects.keys()).sort()) {
        result[key] = groupedObjects.get(key);
    }
    return result;
}

