/* eslint-disable import/prefer-default-export */
import { Handler } from '@netlify/functions';

import fetch from 'node-fetch';

const generateHtml = (title: string, name: string, artworkUrl: string) => {
  const HTML = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Spicey - Audius Player</title>
    
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Audius Music Player"/>
    <meta name="keywords" content="spicey, audius, music, player"/>
    <meta name="author" content="Alexander Hofer" />
    <meta name="copyright" content="Alexander Hofer" />
    <meta name="robots" content="index"/>

    <meta property="og:title" content="${title}">
    
    <meta name="description" content="${name}">
    <meta property="og:description" content="${name}">
    
    <meta property="og:image" content="${artworkUrl}">

  </head>
  <body>
   <h1>Hallo Welt</h1>
  </body>
</html>
`;

  return HTML;
};

export const handler: Handler = async (event, context) => {
  try {
    const [, category] = event.path.split('preview/');

    if (category.startsWith('track/')) {
      const [, trackId] = category.split('/');

      const res = await fetch('https://api.audius.co').then((stream) => stream.json());

      const [host] = res.data;

      const trackRes = await fetch(`${host}/v1/tracks/${trackId}?app_name=SPICEY`).then((stream) => stream.json());

      const { artwork, title, user: { name } } = trackRes.data;

      const [artworkUrl] = Object.values<string>(artwork);

      return {
        statusCode: 200,
        body: generateHtml(title, name, artworkUrl),
      };
    }
  } catch (err) {
    console.log(err);
    // Nothing todo
  }

  return {
    statusCode: 200,
    body: '',
  };
};
