import { Feature, specificationType } from '../feature';

const exampleUsage = `
// read messages
navigator.nfc.watch(message => {
    ...
});

// write message
navigator.nfc.push({
    records: [{ recordType: "url", data: "https://w3c.github.io/web-nfc/" }]
  }).then(() => {
    console.log("Message pushed.");
  });
`;

export default new Feature('nfc',
    exampleUsage,
    () => ({}),
    { test: () => navigator.nfc, specification: specificationType.STANDARD },
    { test: () => navigator.mozNfz, specification: specificationType.VENDOR });
