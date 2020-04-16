#!/usr/bin/env bash
#

for i in {1..35}
do
    URL="https://www.polskieradio.pl/9/5360/Strona/${i}"
    node app.js $URL
done

 node app.js -p
