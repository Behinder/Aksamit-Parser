'use strict';

const request = require('request');
const cheerio = require('cheerio');
const http = require('http');
const fs = require('fs');
const baseurl = 'https://www.polskieradio.pl';
let aksamitarr = [];
var argumenty = process.argv.slice(2);
// Definicje funkcji
//
const isValidUrl = url => {
   let valid = true;
   try {
     const uri = new URL(url);
   } catch(err) {
      valid = false;
   }
   return valid;
};

const getPageOfGivenURL =  async ( address,cb ) => {
   if(isValidUrl(address)) {
  request(address, {
      timeout: 20000
  }, (error, response, body) => {
      if(!error) {
          cb(body);
      } else {
        console.log(error);
        fs.appendFileSync(__dirname + '/errors.txt', error);
      }
  });
   } else {
      throw new Error(address + ' is not a valid URL');
   }
};

const getPage = ( cb ) => {
    request(url, {
        timeout: 3000
    }, (error, response, body) => {
        if(!error) {
            cb(body);
        }
    });
};


const savePage = ( data ) => {
    let contents = data;
    console.log(data);

    fs.writeFileSync(__dirname + '/audycja.txt', contents);
};

//parsuje pojedynczą stronę audycji wyciągając autorów i piosenki
//
const parsePlaylistPage = ( data ) => {
    const $ = cheerio.load(data);
    let output = [];
    // tutaj coś
    $( "ul.playedSounds" ).children().each( (i, elem ) => {

        let artist = $(elem).find('span .bArtist').text();
        let title = $(elem).find('span .bTitle').text();
        let piosenka = artist.trim().slice(0,-1)+" - "+title.trim();
        // console.log(i+":"+artist.trim().slice(0,-1));
        output.push(piosenka);
    });

    return output.join("\n");
};

//parsuje podstronę audycji Aksamit wyciągając z niej linki do poszczególnych stron
//
const getLinksToAksamitfromPage =  ( data ) => {
    const $ = cheerio.load(data);
    let output = [];

    $('article[class^="ID-"]').each( (i,elem) => {
    let urlhref = $(elem).find('a').attr('href').trim();
    let title = $(elem).find('a').attr('title');

        if (title.includes('Aksamit')) {
            let fullurl = baseurl + urlhref;
            output.push(fullurl);
        }
    });
return output.join("\n");
};

// const saveJSON = ( data ) => {
//         let contents = JSON.stringify( data );
//         fs.writeFileSync(__dirname + '/playlisty.json', contents);
// };


if (argumenty[0] == "-p") {

const dane = fs.readFileSync('audycje.txt', 'UTF-8');
const linie = dane.split(/\r?\n/);

linie.forEach((k) => {
        let ad = k;
        getPageOfGivenURL(ad,body=>{
           let data = parsePlaylistPage(body);
           console.log("Parsujemy playlistę z url "+k);
           fs.appendFileSync(__dirname+'/piosenki2.txt','\n---'+k+'---\n'+data);
        });
});

}
if (argumenty[0] == "-s") {
const dane = fs.readFileSync('audycje.txt', 'UTF-8');
  const url = argumenty[1].substring(argumenty[1].lastIndexOf("/")+1);
  console.log(url);
  getPageOfGivenURL(argumenty[1], body => {
        let data = parsePlaylistPage(body);
        fs.appendFileSync(__dirname+'/'+url+'.txt',data);
  });

}
else {

    getPageOfGivenURL(argumenty[0], body => {
    let data = getLinksToAksamitfromPage(body);
    fs.appendFileSync(__dirname+'/niepelne.txt',data);
    });

}





// getPage( (html) => {
//     let data = parsePlaylistPage( html );
//     savePage(data);
// });
