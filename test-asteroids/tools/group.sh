#!/bin/bash

if [ "$#" == "0" ]; then
  BASE_DIR=..
else
  BASE_DIR=$1
fi

# some constants
CONTENT_DIR=$BASE_DIR/game
FILELIST=$BASE_DIR/tools/file_list.txt
BUILD_DIR=$BASE_DIR/build
END_FILE=game.js

# check engine dir exists
test -d "$CONTENT_DIR" || exit 0

if [ ! -d "$BUILD_DIR" ]; then
  mkdir "$BUILD_DIR"
fi
if [ -e "$BASE_DIR/tools/$END_FILE.old" ]; then
  rm "$BASE_DIR/tools/$END_FILE.old"
fi
if [ -e "$BUILD_DIR/$END_FILE" ]; then
  mv "$BUILD_DIR/$END_FILE" "$BASE_DIR/tools/$END_FILE.old"
fi

echo "Creating $END_FILE from $BASE_DIR"

echo "// $END_FILE built on "`date +%F-%0k-%0M-%0S` >> "$BUILD_DIR/$END_FILE"

while read line           
do           

  if [ -e "$CONTENT_DIR/$line" ]; then
    echo " * $line"
    cat "$CONTENT_DIR/$line" >> "$BUILD_DIR/$END_FILE"
  else
    echo " ----- $line does not exist"
  fi

done < "$FILELIST"

