const schema = {
  title: 'User profile schema',
  description: 'Database schema for the profile of a user',
  version: 0,
  type: 'object',
  properties: {
    peerID: {
      type: 'string',
      primary: true
    },
    name: {
      type: 'string',
      encrypted: true,
    },
    description: {
      type: 'string',
    },
  },
  required: ['peerID', 'name', 'description'],
}

export default schema;
