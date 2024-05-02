export function getShelterAccountId(user) {
  // Check if user object exists and has the email attribute
  if (!user || !user.email) {
    return null; // Return null if user object or email attribute is missing
  }

  // Search for the object in the array with the matching publicAddress
  const userObject = emailPublicAddressArray.find((u) => u.email === user.email);

  // If a matching user object is found
  if (userObject) {
    const shelters = userObject.shelters;

    // If there is only one shelter, return its shelterAccountId
    if (shelters.length === 1) {
      return shelters[0].shelterId;
    }

    // If there are multiple shelters, return an array of shelterAccountIds
    return shelters.map((shelter) => shelter.shelterId);
  }

  // If no matching user object is found, return null
  return null;
}


export function getShelterAccountId1(user) {
  // Search for the object in the array with the matching publicAddress
  const userObject = emailPublicAddressArray1.find((u) => u.publicAddress === user.email);

  // If a matching user object is found, return its shelterAccountId; otherwise, return null
  return userObject ? userObject.shelterAccountId : null;
}

export const emailPublicAddressArray1 = [
  {
    publicAddress: 'fb9b34e032a94707e114023c44698716bef222d36310b48c7af02e5240c2b612',
    email: 'carlos+fetch@petastic.com',
    shelterAccountId: '5ee83180f121686526084263',
  },
  {
    publicAddress: '45bc1ecbfd50a5777f5c4dfe41e09e64d0cef8ab2930218d78cb4d00e4702bf1',
    email: 'carlos+haven@petastic.com',
    shelterAccountId: '5ee83180f121686526084263',
  },
  {
    publicAddress: '416fb87e70e19cc52fd9ff28ce43cc8c3f3af33feae03a4d7ac73d6f6e9f36a1',
    email: 'carlos@petastic.com',
    shelterAccountId: '5ee83180f121686526084263',
  },
  {
    publicAddress: 'e43f2104635c62f96227ce5dc039d4cd28cc3b94f34b3935f26d972376c00c54',
    email: 'nicolec@animalhaven.org',
    shelterAccountId: '5ee83180f121686526084263',
  },
  {
    publicAddress: '6acf976c4547a5f6add59bcbd80f53997eb79779a71bbe5a2f602ee365a6f675',
    email: 'kristink@animalhaven.org',
    shelterAccountId: '5ee83180f121686526084263',
  },
  {
    publicAddress: '6acf976c4547a5f6add59bcbd80f53997eb79779a71bbe5a2f602ee365a6f675',
    email: 'adena+today@petastic.com',
    shelterAccountId: '5ee83180f121686526084263',
  },
  {
    publicAddress: 'e505362fd476dd644fd6b16ac1b4437626d1c2e6fb1f6de08adf03505cb1bb18',
    email: 'adena@petastic.com',
    shelterAccountId: '5ee83180f121686526084263',
  },
];

export const emailPublicAddressArray = [
  {
    publicAddress: 'fb9b34e032a94707e114023c44698716bef222d36310b48c7af02e5240c2b612',
    email: 'carlos+fetch@petastic.com',
    shelters: [
      {
        shelterId: '5ee83180f121686526084263',
        shelterName: 'Animal Haven',
        shelter_name_common: 'Animal Haven',
      },
      {
        shelterId: '5ee83180fb01683673939629',
        shelterName: 'Strong Paws',
        shelter_name_common: 'Strong Paws',
      },
      {
        shelterId: '5ee83180f8a1683475024978',
        shelterName: 'Animal Haven',
        shelter_name_common: 'Animal Haven',
      },
      {
        shelterId: '5ee83180f271685767429993',
        shelterName: 'Animal Haven',
        shelter_name_common: 'Animal Haven',
      },
    ],
  },
  {
    publicAddress: '6fb865589bd69bd1ac01f0f5c331274156d79c4aeda4e3d6f57d570be327d321',
    email: 'meagan@strongpawsrescue.org',
    shelters: [
      {
        shelterId: '5ee83180fb01683673939629',
        shelterName: 'Strong Paws',
        shelter_name_common: 'Strong Paws',
      },
    ],
  },
  {
    publicAddress: '',
    email: 'brixiesrescue@icloud.com',
    shelters: [
      {
        shelterId: '5fe931824271705684215701',
        shelterName: 'Brixies Rescue Inc',
        shelter_name_common: 'Brixies Rescue Inc',
      },
    ],
  },
  {
    publicAddress: '45bc1ecbfd50a5777f5c4dfe41e09e64d0cef8ab2930218d78cb4d00e4702bf1',
    email: 'carlos+haven@petastic.com',
    shelters: [
      {
        shelterId: '5ee83180f121686526084263',
        shelterName: 'Animal Haven', // Replace with the actual shelter name
        shelter_name_common: 'Animal Haven',
      },
      {
        shelterId: '5ee83180fb01683673939629',
        shelterName: 'Animal Haven',
        shelter_name_common: 'Animal Haven',
      },
      {
        shelterId: '5ee83180f8a1683475024978',
        shelterName: 'Animal Haven',
        shelter_name_common: 'Animal Haven',
      },
      {
        shelterId: '5ee83180f271685767429993',
        shelterName: 'Animal Haven',
        shelter_name_common: 'Animal Haven',
      },
    ],
  },
  {
    publicAddress: '416fb87e70e19cc52fd9ff28ce43cc8c3f3af33feae03a4d7ac73d6f6e9f36a1',
    email: 'carlos@petastic.com',
    shelters: [
      {
        shelterId: '5ee83180f121686526084263',
        shelterName: 'Animal Haven', // Replace with the actual shelter name
        shelter_name_common: 'Animal Haven',
      },
      {
        shelterId: '5ee83180fb01683673939629',
        shelterName: 'Animal Haven',
        shelter_name_common: 'Animal Haven',
      },
      {
        shelterId: '5ee83180f8a1683475024978',
        shelterName: 'Animal Haven',
        shelter_name_common: 'Animal Haven',
      },
      {
        shelterId: '5ee83180f271685767429993',
        shelterName: 'Animal Haven',
        shelter_name_common: 'Animal Haven',
      },
      {
        shelterId: '5fe931824271705684215701',
        shelterName: 'Brixies Rescue Inc',
        shelter_name_common: 'Brixies Rescue Inc',
      },
    ],
  },
  {
    publicAddress: 'e43f2104635c62f96227ce5dc039d4cd28cc3b94f34b3935f26d972376c00c54',
    email: 'nicolec@animalhaven.org',
    shelters: [
      {
        shelterId: '5ee83180f121686526084263',
        shelterName: 'Shelter Name 1', // Replace with the actual shelter name
      },
    ],
  },
  {
    publicAddress: '6acf976c4547a5f6add59bcbd80f53997eb79779a71bbe5a2f602ee365a6f675',
    email: 'kristink@animalhaven.org',
    shelters: [
      {
        shelterId: '5ee83180f121686526084263',
        shelterName: 'Shelter Name 1', // Replace with the actual shelter name
      },
    ],
  },
  {
    publicAddress: '6acf976c4547a5f6add59bcbd80f53997eb79779a71bbe5a2f602ee365a6f675',
    email: 'adena+today@petastic.com',
    shelters: [
      {
        shelterId: '5ee83180f121686526084263',
        shelterName: 'Shelter Name 1', // Replace with the actual shelter name
      },
    ],
  },
  {
    publicAddress: 'e505362fd476dd644fd6b16ac1b4437626d1c2e6fb1f6de08adf03505cb1bb18',
    email: 'adena@petastic.com',
    shelters: [
      {
        shelterId: '5ee83180f121686526084263',
        shelterName: 'Animal Haven', // Replace with the actual shelter name
        shelter_name_common: 'Animal Haven',
      },
      {
        shelterId: '5ee83180fb01683673939629',
        shelterName: 'Animal Haven',
        shelter_name_common: 'Animal Haven',
      },
      {
        shelterId: '5ee83180f8a1683475024978',
        shelterName: 'Animal Haven',
        shelter_name_common: 'Animal Haven',
      },
      {
        shelterId: '5ee83180f271685767429993',
        shelterName: 'Animal Haven',
        shelter_name_common: 'Animal Haven',
      },
      {
        shelterId: '5fe931824271705684215701',
        shelterName: 'Brixies Rescue Inc',
        shelter_name_common: 'Brixies Rescue Inc',
      },

    ],
  },
  // Add more user objects with their respective shelters as needed
];
