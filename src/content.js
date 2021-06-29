const infoDiv = document.createElement("div");

const createInfoDiv = () => {
  infoDiv.id = 'oxbridge-overlay-div';
  infoDiv.classList.add('info-box');

  const universityTag = document.createElement('p');
  universityTag.id = 'info-box-university-text'
  infoDiv.appendChild(universityTag);
}

const populateInfoDiv = (name, university) => {
  $('#info-box-university-text').html(`went to <i>${university}</i>`);

}

const extractName = (person) => {
  return person.text.replace(/[.,!"]/g, "");
}

const createNameId = (name, i) => {
  const nameId = name.replace(/[\/#$%\^&\*;:{}=\-_"'`~()]/g, "").replace(' ', '-');
  return `${nameId.toLowerCase()}-${ i.toString()}`;
}

const processTag = (tag, i) => {
  let people = [];
  $(tag).contents().each(function(index, element) {
    if(this.nodeType === 3) {
      let doc = nlp(element.nodeValue);
      people = people.concat(doc.people().json());
    }
  });
  const updates = [];
  for (const person of people) {
    // Names must be at least 2 names long
    if (person.terms.length < 2) {
      continue;
    }
    const name = extractName(person);
    const alumniId = createNameId(name, i);

    tag.innerHTML = tag.innerHTML.replace(name,
      `<span id="${alumniId}">${name}</span>`
    )
    updates.push({
      name: name,
      alumniId: alumniId
    })
  }
  for (const update of updates) {
    chrome.runtime.sendMessage({
      type: 'sendName',
      data: {
        name: update.name
      }
    }, (university) => {
      if (university) {
        const spanElement = $(`#${update.alumniId}`)[0];
        if (!spanElement) {
          return;
        }
        spanElement.classList.add('name-span');

        spanElement.addEventListener('mouseover', () => {
          populateInfoDiv(update.name, university);
          const boundingRect = spanElement.getBoundingClientRect();
          infoDiv.style.top = `${boundingRect.top + boundingRect.height + 2 + $(document).scrollTop()}px`;
          infoDiv.style.left = `${boundingRect.left + $(document).scrollLeft()}px`;
          infoDiv.style.display = 'block';
        });
        spanElement.addEventListener('mouseout', () => {
          infoDiv.style.display = 'none';
        });
      }
    });
  }
}

const addHoverDiv = () => {
  $('body').append(infoDiv)
}

const extractRelevantTags = () => {
  // Extract names from any <p> tags
  // TODO: Handle other tags
  for (const tag of ['span', 'p', 'b', 'h1', 'h2', 'div', 'a', 'th', 'tr']) {
    let i = 0;
    for (const pTag of $(tag)) {
      processTag(pTag, i)
      i += 1;
    }
  }
};

const onLoaded = async () => {
  createInfoDiv();
  addHoverDiv();
  populateInfoDiv('William Burr', 'University of Cambridge')
  extractRelevantTags();
}


$(window).on(`load`, () => onLoaded());

