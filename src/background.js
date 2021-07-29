const personToAlmaMater = {}

fetch('alumni.json')
  .then(response => {
    return response.json()
  })
  .then(alumni => {
    for (const alumnus of alumni) {
      personToAlmaMater[alumnus.name] = alumnus.university;
    }
  });

const aliasToPerson = {};
const aliases = [];

fetch('aliases.json')
  .then(response => {
    return response.json()
  })
  .then(nameToAliases => {
    for (const als of Object.values(nameToAliases)) {
      als.sort((al1, al2) => al2.length - al1.length);
      aliases.push(als);
    }
    for (const [name, al] of Object.entries(nameToAliases)) {
      for (const a of al) {
        aliasToPerson[a] = name;
      }
    }
  });


const getAlmaMaterForPerson = (alias) => {
  const name = aliasToPerson[alias];
  if (!(name in personToAlmaMater)) {
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
      sendResponse(almaMater);
      break;
    case 'requestNames':
      sendResponse(aliases);
      break;
    default:
      break;
  }
}));
