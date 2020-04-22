#!/usr/bin/env bash
#

cat "audycje2.txt" | while read LINE; do
    sleep 10
    node app.js -s $LINE
done
