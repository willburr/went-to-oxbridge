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

// Placeholder for resolving the name
const resolvePerson = (name) => {
  return name;
}

chrome.runtime.onMessage.addListener(((message, sender, sendResponse) => {
  const { data, type } = message;

  switch (type) {
    case 'sendName':
      const { name } = data;
      const person = resolvePerson(name);
      const almaMater = getAlmaMaterForPerson(person);
      if (almaMater) {
        sendResponse(almaMater);
        alumni.add(person);
      } else {
        sendResponse(null)
      }
      break;
    case 'fetchAlumni':
      sendResponse(Array.from(alumni.values(), al => {return {name: al, university: personToAlmaMater[al]}}))
      break;
    default:
      break;
  }
}));
