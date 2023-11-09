import { useMemo } from 'react';
import keyBy from 'lodash/keyBy';
import useSWR, { mutate } from 'swr';
// utils
import axios, { endpoints, fetcher } from '../utils/axios';

import {
  _id,
  _ages,
  _roles,
  _prices,
  _emails,
  _ratings,
  _nativeS,
  _nativeM,
  _nativeL,
  _percents,
  _booleans,
  _sentences,
  _lastNames,
  _fullNames,
  _tourNames,
  _jobTitles,
  _taskNames,
  _postTitles,
  _firstNames,
  _fullAddress,
  _companyNames,
  _productNames,
  _descriptions,
  _phoneNumbers,
} from '../_mock/assets';

// ----------------------------------------------------------------------

const options = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// Define your local conversations data
const localConversations = [
  {
    id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
    participants: [
      {
        status: 'online',
        id: '8864c717-587d-472a-929a-8e5f298024da-0',
        role: 'admin',
        email: 'demo@minimals.cc',
        name: 'Jaydon Frankie',
        lastActivity: '2023-10-23T14:45:15.279Z',
        address: '90210 Broadway Blvd',
        avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_20.jpg',
        phoneNumber: '+40 777666555',
      },
      {
        status: 'online',
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
        role: 'Data Analyst',
        email: 'ashlynn_ohara62@gmail.com',
        name: 'Hello Obrien',
        lastActivity: '2023-10-22T13:45:15.279Z',
        address: '1147 Rohan Drive Suite 819 - Burlington, VT / 82021',
        avatarUrl: `${process.env.PUBLIC_URL}/assets/images/avatars/shihtzu.jpg`,
        phoneNumber: '904-966-2836',
      },
    ],
    type: 'ONE_TO_ONE',
    unreadCount: 0,
    messages: [
      {
        id: 'ff7ff1e9-a946-4484-8536-3360bb553c3f',
        body: 'She eagerly opened the gift, her eyes sparkling with excitement.',
        contentType: 'text',
        attachments: [
          {
            id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
            name: 'cover-2.jpg',
            path: 'https://api-dev-minimal-v510.vercel.app/assets/images/cover/cover_3.jpg',
            preview: 'https://api-dev-minimal-v510.vercel.app/assets/images/cover/cover_3.jpg',
            size: 48000000,
            createdAt: '2023-10-23T14:38:44.497Z',
            modifiedAt: '2023-10-23T14:38:44.497Z',
            type: 'jpg',
          },
        ],
        createdAt: '2023-10-23T04:45:15.280Z',
        senderId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
      },
      {
        id: '0acc8a11-3719-4119-a184-eec898e3e80f',
        body: 'The old oak tree stood tall and majestic, its branches swaying gently in the breeze.',
        contentType: 'text',
        attachments: [
          {
            id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
            name: 'design-suriname-2015.mp3',
            path: 'https://www.cloud.com/s/c218bo6kjuqyv66/design_suriname_2015.mp3',
            preview: 'https://www.cloud.com/s/c218bo6kjuqyv66/design_suriname_2015.mp3',
            size: 24000000,
            createdAt: '2023-10-22T13:38:44.497Z',
            modifiedAt: '2023-10-22T13:38:44.497Z',
            type: 'mp3',
          },
        ],
        createdAt: '2023-10-23T12:45:15.280Z',
        senderId: '8864c717-587d-472a-929a-8e5f298024da-0',
      },
      {
        id: '7ed017d0-ea7c-4545-bed3-1776e482ea60',
        body: 'The aroma of freshly brewed coffee filled the air, awakening my senses.',
        contentType: 'text',
        attachments: [
          {
            id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
            name: 'expertise-2015-conakry-sao-tome-and-principe-gender.mp4',
            path: 'https://www.cloud.com/s/c218bo6kjuqyv66/expertise_2015_conakry_sao-tome-and-principe_gender.mp4',
            preview:
              'https://www.cloud.com/s/c218bo6kjuqyv66/expertise_2015_conakry_sao-tome-and-principe_gender.mp4',
            size: 16000000,
            createdAt: '2023-10-21T12:38:44.497Z',
            modifiedAt: '2023-10-21T12:38:44.497Z',
            type: 'mp4',
          },
        ],
        createdAt: '2023-10-23T14:37:15.280Z',
        senderId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
      },
      {
        id: '71b164de-772f-42e8-964d-b72fce43037f',
        body: 'The children giggled with joy as they ran through the sprinklers on a hot summer day.',
        contentType: 'text',
        attachments: [
          {
            id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b4',
            name: 'money-popup-crack.pdf',
            path: 'https://www.cloud.com/s/c218bo6kjuqyv66/money-popup-crack.pdf',
            preview: 'https://www.cloud.com/s/c218bo6kjuqyv66/money-popup-crack.pdf',
            size: 12000000,
            createdAt: '2023-10-20T11:38:44.497Z',
            modifiedAt: '2023-10-20T11:38:44.497Z',
            type: 'pdf',
          },
          {
            id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5',
            name: 'cover-4.jpg',
            path: 'https://api-dev-minimal-v510.vercel.app/assets/images/cover/cover_4.jpg',
            preview: 'https://api-dev-minimal-v510.vercel.app/assets/images/cover/cover_4.jpg',
            size: 9600000,
            createdAt: '2023-10-19T10:38:44.497Z',
            modifiedAt: '2023-10-19T10:38:44.497Z',
            type: 'jpg',
          },
          {
            id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b6',
            name: 'cover-6.jpg',
            path: 'https://api-dev-minimal-v510.vercel.app/assets/images/cover/cover_6.jpg',
            preview: 'https://api-dev-minimal-v510.vercel.app/assets/images/cover/cover_6.jpg',
            size: 8000000,
            createdAt: '2023-10-18T09:38:44.497Z',
            modifiedAt: '2023-10-18T09:38:44.497Z',
            type: 'jpg',
          },
        ],
        createdAt: '2023-10-23T14:39:15.280Z',
        senderId: '8864c717-587d-472a-929a-8e5f298024da-0',
      },
      {
        id: '85877e4c-07f3-4106-84c6-a0bcbaaa67b0',
        body: 'He carefully crafted a beautiful sculpture out of clay, his hands skillfully shaping the intricate details.',
        contentType: 'text',
        attachments: [
          {
            id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b7',
            name: 'large-news.txt',
            path: 'https://www.cloud.com/s/c218bo6kjuqyv66/large_news.txt',
            preview: 'https://www.cloud.com/s/c218bo6kjuqyv66/large_news.txt',
            size: 6857142.857142857,
            createdAt: '2023-10-17T08:38:44.497Z',
            modifiedAt: '2023-10-17T08:38:44.497Z',
            type: 'txt',
          },
          {
            id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b8',
            name: 'nauru-6015-small-fighter-left-gender.psd',
            path: 'https://www.cloud.com/s/c218bo6kjuqyv66/nauru-6015-small-fighter-left-gender.psd',
            preview:
              'https://www.cloud.com/s/c218bo6kjuqyv66/nauru-6015-small-fighter-left-gender.psd',
            size: 6000000,
            createdAt: '2023-10-16T07:38:44.497Z',
            modifiedAt: '2023-10-16T07:38:44.497Z',
            type: 'psd',
          },
          {
            id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b9',
            name: 'tv-xs.doc',
            path: 'https://www.cloud.com/s/c218bo6kjuqyv66/tv-xs.doc',
            preview: 'https://www.cloud.com/s/c218bo6kjuqyv66/tv-xs.doc',
            size: 5333333.333333333,
            createdAt: '2023-10-15T06:38:44.497Z',
            modifiedAt: '2023-10-15T06:38:44.497Z',
            type: 'doc',
          },
          {
            id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b10',
            name: 'gustavia-entertainment-productivity.docx',
            path: 'https://www.cloud.com/s/c218bo6kjuqyv66/gustavia-entertainment-productivity.docx',
            preview:
              'https://www.cloud.com/s/c218bo6kjuqyv66/gustavia-entertainment-productivity.docx',
            size: 4800000,
            createdAt: '2023-10-14T05:38:44.498Z',
            modifiedAt: '2023-10-14T05:38:44.498Z',
            type: 'docx',
          },
        ],
        createdAt: '2023-10-23T14:41:15.280Z',
        senderId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
      },
      {
        id: 'a9ae488e-1ad8-4c23-aeb9-ae50a1dd8540',
        attachments: [],
        contentType: 'image',
        body: 'https://api-dev-minimal-v510.vercel.app/assets/images/cover/cover_5.jpg',
        createdAt: '2023-10-23T14:43:15.280Z',
        senderId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
      },
      {
        id: 'bee9b0c3-e6a1-495a-a2e2-c916c439b950',
        contentType: 'text',
        attachments: [],
        body: 'The concert was a mesmerizing experience, with the music filling the venue and the crowd cheering in delight.',
        createdAt: '2023-10-23T14:43:15.280Z',
        senderId: '8864c717-587d-472a-929a-8e5f298024da-0',
      },
      {
        id: '2d1e8a85-ab1a-4120-9329-a8f84eb10c42',
        body: 'The waves crashed against the shore, creating a soothing symphony of sound.',
        contentType: 'text',
        attachments: [],
        createdAt: '2023-10-23T14:43:15.280Z',
        senderId: '8864c717-587d-472a-929a-8e5f298024da-0',
      },
    ],
  },
  {
    id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
    participants: [
      {
        status: 'online',
        id: '8864c717-587d-472a-929a-8e5f298024da-0',
        role: 'admin',
        email: 'demo@minimals.cc',
        name: 'Jaydon Frankie',
        lastActivity: '2023-10-23T14:45:15.279Z',
        address: '90210 Broadway Blvd',
        avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_25.jpg',
        phoneNumber: '+40 777666555',
      },
      {
        status: 'offline',
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
        role: 'Legal Counsel',
        email: 'milo.farrell@hotmail.com',
        name: 'Karma',
        lastActivity: '2023-10-21T12:45:15.279Z',
        address: '18605 Thompson Circle Apt. 086 - Idaho Falls, WV / 50337',
        avatarUrl: `${process.env.PUBLIC_URL}/assets/images/avatars/persian.jpg`,
        phoneNumber: '399-757-9909',
      },
    ],
    type: 'ONE_TO_ONE',
    unreadCount: 0,
    messages: [
      {
        id: 'd0ec934a-3dd5-49cb-8149-21989e881e65',
        body: 'The old oak tree stood tall and majestic, its branches swaying gently in the breeze.',
        contentType: 'text',
        attachments: [],
        createdAt: '2023-10-23T06:45:15.280Z',
        senderId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
      },
      {
        id: '649c4e19-0fd3-41ea-9b26-63acb6e21ac7',
        body: 'The aroma of freshly brewed coffee filled the air, awakening my senses.',
        contentType: 'text',
        attachments: [],
        createdAt: '2023-10-23T08:45:15.280Z',
        senderId: '8864c717-587d-472a-929a-8e5f298024da-0',
      },
      {
        id: 'f5694c5f-2ffb-4c10-9202-6210782a185d',
        body: 'The children giggled with joy as they ran through the sprinklers on a hot summer day.',
        contentType: 'text',
        attachments: [],
        createdAt: '2023-10-23T10:15:15.280Z',
        senderId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
      },
      {
        id: 'e3608894-3df3-4e1c-8dc3-9e48bcb4cec8',
        body: 'He carefully crafted a beautiful sculpture out of clay, his hands skillfully shaping the intricate details.',
        contentType: 'text',
        attachments: [],
        createdAt: '2023-10-23T12:30:15.280Z',
        senderId: '8864c717-587d-472a-929a-8e5f298024da-0',
      },
      {
        id: '3fe52209-8901-4088-981f-8a2dfad388b9',
        body: 'The concert was a mesmerizing experience, with the music filling the venue and the crowd cheering in delight.',
        contentType: 'text',
        attachments: [],
        createdAt: '2023-10-23T13:30:15.280Z',
        senderId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
      },
      {
        id: '6df63484-4e85-401d-8766-e3eac7450de5',
        body: 'https://api-dev-minimal-v510.vercel.app/assets/images/cover/cover_8.jpg',
        attachments: [],
        contentType: 'image',
        createdAt: '2023-10-23T13:45:15.280Z',
        senderId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
      },
      {
        id: '9b597571-e63d-41bc-bce0-43601b8e041d',
        body: 'The scent of blooming flowers wafted through the garden, creating a fragrant paradise.',
        contentType: 'text',
        attachments: [],
        createdAt: '2023-10-23T14:00:15.280Z',
        senderId: '8864c717-587d-472a-929a-8e5f298024da-0',
      },
    ],
  },
  {
    id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b4',
    participants: [
      {
        status: 'online',
        id: '8864c717-587d-472a-929a-8e5f298024da-0',
        role: 'admin',
        email: 'demo@minimals.cc',
        name: 'Jaydon Frankie',
        lastActivity: '2023-10-23T14:45:15.279Z',
        address: '90210 Broadway Blvd',
        avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_25.jpg',
        phoneNumber: '+40 777666555',
      },
      {
        status: 'online',
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b4',
        role: 'UX/UI Designer',
        email: 'violet.ratke86@yahoo.com',
        name: 'Harrison Stein',
        lastActivity: '2023-10-20T11:45:15.279Z',
        address: '110 Lamar Station Apt. 730 - Hagerstown, OK / 49808',
        avatarUrl: `${process.env.PUBLIC_URL}/assets/images/avatars/frenchie.jpg`,
        phoneNumber: '692-767-2903',
      },
    ],
    type: 'ONE_TO_ONE',
    unreadCount: 0,
    messages: [
      {
        id: '9574ce4a-27ab-4eec-9dd2-ea369f418722',
        body: 'The aroma of freshly brewed coffee filled the air, awakening my senses.',
        contentType: 'text',
        attachments: [
          {
            id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
            name: 'cover-2.jpg',
            path: 'https://api-dev-minimal-v510.vercel.app/assets/images/cover/cover_3.jpg',
            preview: 'https://api-dev-minimal-v510.vercel.app/assets/images/cover/cover_3.jpg',
            size: 48000000,
            createdAt: '2023-10-23T14:38:44.497Z',
            modifiedAt: '2023-10-23T14:38:44.497Z',
            type: 'jpg',
          },
        ],
        createdAt: '2023-10-23T06:45:15.280Z',
        senderId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b4',
      },
      {
        id: '3148665b-1aa3-40f1-b4a0-ee579ce42282',
        body: 'The children giggled with joy as they ran through the sprinklers on a hot summer day.',
        contentType: 'text',
        attachments: [
          {
            id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
            name: 'design-suriname-2015.mp3',
            path: 'https://www.cloud.com/s/c218bo6kjuqyv66/design_suriname_2015.mp3',
            preview: 'https://www.cloud.com/s/c218bo6kjuqyv66/design_suriname_2015.mp3',
            size: 24000000,
            createdAt: '2023-10-22T13:38:44.497Z',
            modifiedAt: '2023-10-22T13:38:44.497Z',
            type: 'mp3',
          },
        ],
        createdAt: '2023-10-23T08:45:15.280Z',
        senderId: '8864c717-587d-472a-929a-8e5f298024da-0',
      },
      {
        id: 'db582097-c706-47e9-86b0-01d27187bae3',
        body: 'He carefully crafted a beautiful sculpture out of clay, his hands skillfully shaping the intricate details.',
        contentType: 'text',
        attachments: [],
        createdAt: '2023-10-23T10:15:15.280Z',
        senderId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b4',
      },
      {
        id: '356342c6-49be-4d7f-be93-78e89f1f5d97',
        body: 'The concert was a mesmerizing experience, with the music filling the venue and the crowd cheering in delight.',
        contentType: 'text',
        attachments: [
          {
            id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
            name: 'expertise-2015-conakry-sao-tome-and-principe-gender.mp4',
            path: 'https://www.cloud.com/s/c218bo6kjuqyv66/expertise_2015_conakry_sao-tome-and-principe_gender.mp4',
            preview:
              'https://www.cloud.com/s/c218bo6kjuqyv66/expertise_2015_conakry_sao-tome-and-principe_gender.mp4',
            size: 16000000,
            createdAt: '2023-10-21T12:38:44.497Z',
            modifiedAt: '2023-10-21T12:38:44.497Z',
            type: 'mp4',
          },
          {
            id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b4',
            name: 'money-popup-crack.pdf',
            path: 'https://www.cloud.com/s/c218bo6kjuqyv66/money-popup-crack.pdf',
            preview: 'https://www.cloud.com/s/c218bo6kjuqyv66/money-popup-crack.pdf',
            size: 12000000,
            createdAt: '2023-10-20T11:38:44.497Z',
            modifiedAt: '2023-10-20T11:38:44.497Z',
            type: 'pdf',
          },
        ],
        createdAt: '2023-10-23T12:30:15.280Z',
        senderId: '8864c717-587d-472a-929a-8e5f298024da-0',
      },
      {
        id: '09c442f5-bb73-477b-adbe-9b52b631189c',
        body: 'The waves crashed against the shore, creating a soothing symphony of sound.',
        contentType: 'text',
        attachments: [],
        createdAt: '2023-10-23T13:30:15.280Z',
        senderId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b4',
      },
      {
        id: '1a65bff1-5000-46aa-8aaf-3cd1bcf3d2d1',
        body: 'https://api-dev-minimal-v510.vercel.app/assets/images/cover/cover_9.jpg',
        contentType: 'image',
        attachments: [],
        createdAt: '2023-10-23T13:45:15.280Z',
        senderId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b4',
      },
      {
        id: '27b23e33-3fc7-4a1b-8317-e8c0a1df621c',
        body: 'https://api-dev-minimal-v510.vercel.app/assets/images/cover/cover_10.jpg',
        contentType: 'image',
        attachments: [],
        createdAt: '2023-10-23T13:45:15.280Z',
        senderId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b4',
      },
    ],
  },
];

const mockData = [
  {
    id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
    participants: [
      {
        status: 'online',
        id: '8864c717-587d-472a-929a-8e5f298024da-0',
        role: 'admin',
        email: 'demo@minimals.cc',
        name: 'Jaydon Frankie',
        lastActivity: '2023-10-23T14:45:15.279Z',
        address: '90210 Broadway Blvd',
        avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_25.jpg',
        phoneNumber: '+40 777666555',
      },
      {
        status: 'online',
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
        role: 'Data Analyst',
        email: 'ashlynn_ohara62@gmail.com',
        name: 'PetasticAI',
        lastActivity: '2023-10-22T13:45:15.279Z',
        address: '1147 Rohan Drive Suite 819 - Burlington, VT / 82021',
        avatarUrl: `${process.env.PUBLIC_URL}/assets/logo.svg`, // Modify the path accordingly
        phoneNumber: '904-966-2836',
      },
    ],
    type: 'ONE_TO_ONE',
    unreadCount: 0,
    messages: [
      {
        id: 'ff7ff1e9-a946-4484-8536-3360bb553c3f',
        body: 'She eagerly opened the gift, her eyes sparkling with excitement.',
        contentType: 'text',
        attachments: [
          {
            id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
            name: 'cover-2.jpg',
            path: 'https://api-dev-minimal-v510.vercel.app/assets/images/cover/cover_3.jpg',
            preview: 'https://api-dev-minimal-v510.vercel.app/assets/images/cover/cover_3.jpg',
            size: 48000000,
            createdAt: '2023-10-23T14:38:44.497Z',
            modifiedAt: '2023-10-23T14:38:44.497Z',
            type: 'jpg',
          },
        ],
        createdAt: '2023-10-23T04:45:15.280Z',
        senderId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
      },
      {
        id: '0acc8a11-3719-4119-a184-eec898e3e80f',
        body: 'The old oak tree stood tall and majestic, its branches swaying gently in the breeze.',
        contentType: 'text',
        attachments: [
          {
            id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
            name: 'design-suriname-2015.mp3',
            path: 'https://www.cloud.com/s/c218bo6kjuqyv66/design_suriname_2015.mp3',
            preview: 'https://www.cloud.com/s/c218bo6kjuqyv66/design_suriname_2015.mp3',
            size: 24000000,
            createdAt: '2023-10-22T13:38:44.497Z',
            modifiedAt: '2023-10-22T13:38:44.497Z',
            type: 'mp3',
          },
        ],
        createdAt: '2023-10-23T12:45:15.280Z',
        senderId: '8864c717-587d-472a-929a-8e5f298024da-0',
      },
      // Add more messages here if needed...
    ],
  },
  // Add more conversation entries here...
];

export function useGetContacts() {
  // Uncomment this section to fetch data using SWR
  // const URL = [endpoints.chat, { params: { endpoint: 'contacts' } }];
  // const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, options);

  // Define your local contacts data
  const localContacts = [
    {
      status: 'busy',
      id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
      role: 'HR Manager',
      email: 'nannie_abernathy70@yahoo.com',
      name: 'Jayvion Simon',
      lastActivity: '2023-10-23T13:09:53.656Z',
      address: '19034 Verna Unions Apt. 164 - Honolulu, RI / 87535',
      avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_1.jpg',
      phoneNumber: '365-374-4961',
    },
    {
      status: 'online',
      id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
      role: 'Data Analyst',
      email: 'ashlynn_ohara62@gmail.com',
      name: 'FetchAi',
      lastActivity: '2023-10-22T12:09:53.656Z',
      address: '1147 Rohan Drive Suite 819 - Burlington, VT / 82021',
      avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_2.jpg',
      phoneNumber: '904-966-2836',
    },
    {
      status: 'offline',
      id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
      role: 'Legal Counsel',
      email: 'milo.farrell@hotmail.com',
      name: 'Karma',
      lastActivity: '2023-10-21T11:09:53.656Z',
      address: '18605 Thompson Circle Apt. 086 - Idaho Falls, WV / 50337',
      avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_3.jpg',
      phoneNumber: '399-757-9909',
    },
    {
      status: 'online',
      id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b4',
      role: 'UX/UI Designer',
      email: 'violet.ratke86@yahoo.com',
      name: 'Harrison Stein',
      lastActivity: '2023-10-20T10:09:53.656Z',
      address: '110 Lamar Station Apt. 730 - Hagerstown, OK / 49808',
      avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_4.jpg',
      phoneNumber: '692-767-2903',
    },
    {
      status: 'offline',
      id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5',
      role: 'Project Manager',
      email: 'letha_lubowitz24@yahoo.com',
      name: 'Reece Chung',
      lastActivity: '2023-10-19T09:09:53.656Z',
      address: '36901 Elmer Spurs Apt. 762 - Miramar, DE / 92836',
      avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_5.jpg',
      phoneNumber: '990-588-5716',
    },
    {
      status: 'online',
      id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b6',
      role: 'Account Manager',
      email: 'aditya_greenfelder31@gmail.com',
      name: 'Lainey Davidson',
      lastActivity: '2023-10-18T08:09:53.656Z',
      address: '2089 Runolfsson Harbors Suite 886 - Chapel Hill, TX / 32827',
      avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_6.jpg',
      phoneNumber: '955-439-2578',
    },
    {
      status: 'alway',
      id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b7',
      role: 'Registered Nurse',
      email: 'lenna_bergnaum27@hotmail.com',
      name: 'Cristopher Cardenas',
      lastActivity: '2023-10-17T07:09:53.656Z',
      address: '279 Karolann Ports Apt. 774 - Prescott Valley, WV / 53905',
      avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_7.jpg',
      phoneNumber: '226-924-4058',
    },
    {
      status: 'online',
      id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b8',
      role: 'Business Analyst',
      email: 'luella.ryan33@gmail.com',
      name: 'Melanie Noble',
      lastActivity: '2023-10-16T06:09:53.656Z',
      address: '96607 Claire Square Suite 591 - St. Louis Park, HI / 40802',
      avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_8.jpg',
      phoneNumber: '552-917-1454',
    },
    {
      status: 'offline',
      id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b9',
      role: 'Creative Director',
      email: 'joana.simonis84@gmail.com',
      name: 'Chase Day',
      lastActivity: '2023-10-15T05:09:53.656Z',
      address: '9388 Auer Station Suite 573 - Honolulu, AK / 98024',
      avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_9.jpg',
      phoneNumber: '285-840-9338',
    },
    {
      status: 'online',
      id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b10',
      role: 'Financial Planner',
      email: 'marjolaine_white94@gmail.com',
      name: 'Shawn Manning',
      lastActivity: '2023-10-14T04:09:53.656Z',
      address: '47665 Adaline Squares Suite 510 - Blacksburg, NE / 53515',
      avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_10.jpg',
      phoneNumber: '306-269-2446',
    },
    {
      status: 'offline',
      id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b11',
      role: 'Event Coordinator',
      email: 'vergie_block82@hotmail.com',
      name: 'Soren Durham',
      lastActivity: '2023-10-13T03:09:53.656Z',
      address: '989 Vernice Flats Apt. 183 - Billings, NV / 04147',
      avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_11.jpg',
      phoneNumber: '883-373-6253',
    },
    {
      status: 'online',
      id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b12',
      role: 'Marketing Director',
      email: 'vito.hudson@hotmail.com',
      name: 'Cortez Herring',
      lastActivity: '2023-10-12T02:09:53.656Z',
      address: '91020 Wehner Locks Apt. 673 - Albany, WY / 68763',
      avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_12.jpg',
      phoneNumber: '476-509-8866',
    },
    {
      status: 'busy',
      id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b13',
      role: 'Software Developer',
      email: 'tyrel_greenholt@gmail.com',
      name: 'Brycen Jimenez',
      lastActivity: '2023-10-11T01:09:53.656Z',
      address: '585 Candelario Pass Suite 090 - Columbus, LA / 25376',
      avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_13.jpg',
      phoneNumber: '201-465-1954',
    },
    {
      status: 'online',
      id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b14',
      role: 'Research Scientist',
      email: 'dwight.block85@yahoo.com',
      name: 'Giana Brandt',
      lastActivity: '2023-10-10T00:09:53.656Z',
      address: '80988 Renner Crest Apt. 000 - Fargo, VA / 24266',
      avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_14.jpg',
      phoneNumber: '538-295-9408',
    },
    {
      status: 'offline',
      id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b15',
      role: 'Content Strategist',
      email: 'mireya13@hotmail.com',
      name: 'Aspen Schmitt',
      lastActivity: '2023-10-08T23:09:53.656Z',
      address: '28307 Shayne Pike Suite 523 - North Las Vegas, AZ / 28550',
      avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_15.jpg',
      phoneNumber: '531-492-6028',
    },
    {
      status: 'online',
      id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b16',
      role: 'Operations Manager',
      email: 'dasia_jenkins@hotmail.com',
      name: 'Colten Aguilar',
      lastActivity: '2023-10-07T22:09:53.656Z',
      address: '205 Farrell Highway Suite 333 - Rock Hill, OK / 63421',
      avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_16.jpg',
      phoneNumber: '981-699-7588',
    },
    {
      status: 'offline',
      id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b17',
      role: 'Sales Representative',
      email: 'benny89@yahoo.com',
      name: 'Angelique Morse',
      lastActivity: '2023-10-06T21:09:53.656Z',
      address: '253 Kara Motorway Suite 821 - Manchester, SD / 09331',
      avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_17.jpg',
      phoneNumber: '500-268-4826',
    },
    {
      status: 'online',
      id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b18',
      role: 'Supply Chain Analyst',
      email: 'dawn.goyette@gmail.com',
      name: 'Selina Boyer',
      lastActivity: '2023-10-05T20:09:53.656Z',
      address: '13663 Kiara Oval Suite 606 - Missoula, AR / 44478',
      avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_18.jpg',
      phoneNumber: '205-952-3828',
    },
    {
      status: 'alway',
      id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b19',
      role: 'Operations Coordinator',
      email: 'zella_hickle4@yahoo.com',
      name: 'Lawson Bass',
      lastActivity: '2023-10-04T19:09:53.656Z',
      address: '8110 Claire Port Apt. 703 - Anchorage, TN / 01753',
      avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_19.jpg',
      phoneNumber: '222-255-5190',
    },
    {
      status: 'online',
      id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b20',
      role: 'Customer Service Associate',
      email: 'avery43@hotmail.com',
      name: 'Ariana Lang',
      lastActivity: '2023-10-03T18:09:53.656Z',
      address: '4642 Demetris Lane Suite 407 - Edmond, AZ / 60888',
      avatarUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_20.jpg',
      phoneNumber: '408-439-8033',
    },
  ];

  // Define other variables
  const isLoading = false; // Set to false since you're not fetching data
  const error = null; // Set to null since there's no error with local data
  const isValidating = false; // Set to false since there's no validation

  // Check if there's an error, and handle it gracefully
  if (error) {
    console.error('An error occurred while fetching contacts:', error);
    // You can return some default or error state here if needed
    // Example: return { contacts: [], contactsLoading: false, contactsError: true, ... };
  }

  // Use local data or fetched data based on your needs
  const contactsData = localContacts; // Use local data
  // const contactsData = data?.contacts || []; // Use fetched data

  // Create the memoized value
  const memoizedValue = useMemo(
    () => ({
      contacts: contactsData,
      contactsLoading: isLoading,
      contactsError: error,
      contactsValidating: isValidating,
      contactsEmpty: !isLoading && (!contactsData || !contactsData.length),
    }),
    [contactsData, isLoading, error, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetConversations() {
  // const URL = [endpoints.chat, { params: { endpoint: 'conversations' } }];
  // const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, options);

  // Define other variables
  const isLoading = false; // Set to false since you're not fetching data
  const error = null; // Set to null since there's no error with local data
  const isValidating = false; // Set to false since there's no validation

  // Check if there's an error, and handle it gracefully
  if (error) {
    console.error('An error occurred while fetching conversations:', error);
    // You can return some default or error state here if needed
    // Example: return { conversations: {}, conversationsLoading: false, conversationsError: true, ... };
  }

  // Use local data or fetched data based on your needs
  const conversationsData = localConversations; // Use local data
  // const conversationsData = data?.conversations || []; // Use fetched data

  const memoizedValue = useMemo(() => {
    const byId = keyBy(conversationsData, 'id') || {}; // Use conversationsData here
    const allIds = Object.keys(byId) || [];

    return {
      conversations: {
        byId,
        allIds,
      },
      conversationsLoading: isLoading,
      conversationsError: error,
      conversationsValidating: isValidating,
      conversationsEmpty: !isLoading && !allIds.length,
    };
  }, [conversationsData, isLoading, error, isValidating]);

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetConversation(conversationId) {
  const URL = conversationId
    ? [endpoints.chat, { params: { conversationId, endpoint: 'conversation' } }]
    : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, options);

  console.log('data?.conversation:', data?.conversation?.messages.length);

  if (data?.conversation?.messages) {
    const messageBodiesToRemove = [
      'The children giggled with joy as they ran through the sprinklers on a hot summer day.',
      'The aroma of freshly brewed coffee filled the air, awakening my senses.',
      'He carefully crafted a beautiful sculpture out of clay, his hands skillfully shaping the intricate details.',
      'The concert was a mesmerizing experience, with the music filling the venue and the crowd cheering in delight.',
      'The waves crashed against the shore, creating a soothing symphony of sound.',
      'https://api-dev-minimal-v510.vercel.app/assets/images/cover/cover_10.jpg',
      'https://api-dev-minimal-v510.vercel.app/assets/images/cover/cover_9.jpg',
      'She eagerly opened the gift, her eyes sparkling with excitement.',
      'The old oak tree stood tall and majestic, its branches swaying gently in the breeze.',
      'https://api-dev-minimal-v510.vercel.app/assets/images/cover/cover_5.jpg',
      'The scent of blooming flowers wafted through the garden, creating a fragrant paradise.',
      'https://api-dev-minimal-v510.vercel.app/assets/images/cover/cover_8.jpg',

      // Add more message bodies if needed
    ];

    // Iterate over the message bodies to remove
    messageBodiesToRemove.forEach((messageBodyToRemove) => {
      // Find the index of the message with the specified body
      const indexToRemove = data.conversation.messages.findIndex(
        (message) => message.body === messageBodyToRemove
      );

      // Remove the message if it exists in the array
      if (indexToRemove !== -1) {
        data.conversation.messages.splice(indexToRemove, 1);
      }
    });
  }

  console.log('data?.conversationL:', data?.conversation?.messages.length);

  // Use local data instead of API data
  const localConversation = localConversations.find(
    (conversation) => conversation.id === conversationId
  );

  console.log('URL:', URL);
  console.log('data:', data);
  console.log('isLoading:', isLoading);
  console.log('error:', error);
  console.log('isValidating:', isValidating);
  console.log('localConversation:', localConversation);

  // Move this useMemo hook to the top level
  const memoizedValue = useMemo(
    () => ({
      conversation: data?.conversation,
      // conversation: localConversation,
      conversationLoading: isLoading,
      conversationError: error,
      conversationValidating: isValidating,
    }),
    [data?.conversation, error, isLoading, isValidating]
    // [localConversation, error, isLoading, isValidating]
  );

  // Check if conversationId matches a specific ID you want to override
  // if (conversationId === 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2') {
  //  return {
  //    conversation: mockData[0], // Return the mockData entry you want to use
  //    conversationLoading: false, // Indicate that loading is complete
  //    conversationError: null, // No error in this case
  //    conversationValidating: false, // Not validating
  //  };
  // }

  console.log('memoizedValue:', memoizedValue);

  // If the conversationId doesn't match, return the fetched data
  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function sendMessage(conversationId, messageData) {
  const CONVERSATIONS_URL = [endpoints.chat, { params: { endpoint: 'conversations' } }];

  const CONVERSATION_URL = [
    endpoints.chat,
    {
      params: { conversationId, endpoint: 'conversation' },
    },
  ];

  /**
   * Work on server
   */
  // const data = { conversationId, messageData };
  // await axios.put(endpoints.chat, data);

  /**
   * Work in local
   */
  mutate(
    CONVERSATION_URL,
    (currentData) => {
      const { conversation: currentConversation } = currentData;

      const conversation = {
        ...currentConversation,
        messages: [...currentConversation.messages, messageData],
      };

      return {
        conversation,
      };
    },
    false
  );

  /**
   * Work in local
   */
  mutate(
    CONVERSATIONS_URL,
    (currentData) => {
      const { conversations: currentConversations } = currentData;

      const conversations = currentConversations.map((conversation) =>
        conversation.id === conversationId
          ? {
              ...conversation,
              messages: [...conversation.messages, messageData],
            }
          : conversation
      );

      return {
        conversations,
      };
    },
    false
  );
}

// ----------------------------------------------------------------------

export async function createConversation(conversationData) {
  const URL = [endpoints.chat, { params: { endpoint: 'conversations' } }];

  /**
   * Work on server
   */
  const data = { conversationData };
  const res = await axios.post(endpoints.chat, data);

  /**
   * Work in local
   */
  mutate(
    URL,
    (currentData) => {
      const conversations = [...currentData.conversations, conversationData];
      return {
        ...currentData,
        conversations,
      };
    },
    false
  );

  return res.data;
}

// ----------------------------------------------------------------------

export async function clickConversation(conversationId) {
  const URL = endpoints.chat;

  try {
    // Fetch and assign data to currentData
    const response = await axios.get(URL, { params: { conversationId, endpoint: 'mark-as-seen' } });
    const fetchedData = response.data; // Adjust this based on your actual response structure

    // Ensure fetchedData is defined and contains 'conversations' property
    if (fetchedData && fetchedData.conversations) {
      mutate(
        [
          URL,
          {
            params: { endpoint: 'conversations' },
          },
        ],
        (currentData) => {
          const conversations = currentData.conversations.map((conversation) =>
            conversation.id === conversationId ? { ...conversation, unreadCount: 0 } : conversation
          );

          return {
            ...currentData,
            conversations,
          };
        },
        false
      );
    } else {
      console.error('Invalid data structure:', fetchedData);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
