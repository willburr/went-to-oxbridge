const alumni = new Set();

const personToAlmaMater = {}

fetch('alumni.json')
  .then(response => {
    return response.json()
  })
  .then(alumni => {
    for (const alumnus of alumni) {
      personToAlmaMater[alumnus.name] = alumnus.university;
    }
  })

const getAlmaMaterForPerson = (name) => {
  if (!(name in personToAlmaMater)) {
    console.log(name);
    return null;
  }
  return personToAlmaMater[name];
}

chrome.runtime.onMessage.addListener(((message, sender, sendResponse) => {
  const { data, type } = message;

  switch (type) {
    case 'sendName':
      const { name } = data;
      const almaMater = getAlmaMaterForPerson(name);
      if (almaMater) {
        sendResponse(almaMater);
        alumni.add(name);
      } else {
        sendResponse(null)
      }
      break;
    case 'fetchAlumni':
      sendResponse(Array.from(alumni.values(), al => {return {name: al, university: personToAlmaMater[al]}}))
      break;
    case 'requestNames':
      sendResponse(Object.keys(personToAlmaMater));
      break;
    default:
      break;
  }
}));
