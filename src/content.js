// Creates a unique id for reference
const createNameId = (name, i) => {
  const nameId = name.replace(/[\/#$%\^&\*;:{}=\-_"'`~()]/g, "").replace(' ', '-');
  return `${nameId.toLowerCase()}-${ i.toString()}`;
}

const processTag = (tag, i, names) => {
  let people = [];
  $(tag).contents().each(function(index, element) {
    if(this.nodeType === 3) {
      // Search for people
      for (let name of names) {
        if (element.nodeValue.indexOf(name) > -1) {
          people.push(name);
        }
      }
    }
  });
  const updates = [];
  for (const person of people) {
    const alumniId = createNameId(person, i);

    tag.innerHTML = tag.innerHTML.replace(person,
      `<span id="${alumniId}">${person}</span>`
    )
    updates.push({
      name: person,
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

const addHoverDiv = () => {
  $('body').append(infoDiv)
}

const extractRelevantTags = (names) => {
  // Extract names from any <p> tags
  // TODO: Handle other tags
  for (const tag of ['span', 'p', 'b', 'h1', 'h2', 'h3', 'div', 'a', 'th', 'tr']) {
    let i = 0;
    for (const pTag of $(tag)) {
      processTag(pTag, i, names)
      i += 1;
    }
  }
};

const onLoaded = async () => {
  chrome.runtime.sendMessage({
    type: 'requestNames'
  }, (names) => {
    createInfoDiv();
    addHoverDiv();
    extractRelevantTags(names);
  });
}


$(window).on(`load`, () => onLoaded());

