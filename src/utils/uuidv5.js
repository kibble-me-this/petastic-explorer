/* eslint-disable */
// ----------------------------------------------------------------------

const { v5: uuidv5, parse: uuidParse } = require('uuid');

// Define a namespace UUID (you can use a predefined or custom one)
const NAMESPACE_DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';

export default function generateVersion5UUID(name) {
  // Parse the namespace UUID
  const myNamespace = uuidParse(NAMESPACE_DNS);

  // Generate a Version 5 UUID based on the provided name and namespace
  const myUUID = uuidv5(name, myNamespace);

  return myUUID;
}
