#!/bin/bash

# constants
ENGINE_DIR='../../engine'
GAME_DIR='..'

BUILD_DIR="$GAME_DIR/build"
GAME_CONTENT_DIR="$BUILD_DIR/game"

echo "Executing scripts"

# unify engine.js and game.js
# echo " * execute $ENGINE_DIR/tools/group.sh"
"$ENGINE_DIR"/tools/group.sh "$ENGINE_DIR"

# echo " * execute $GAME_DIR/tools/group.sh"
"$GAME_DIR"/tools/group.sh "$GAME_DIR"

echo "Copying resources"

if [ ! -d "$GAME_CONTENT_DIR" ]; then
  mkdir "$GAME_CONTENT_DIR"
fi

mv "$BUILD_DIR"/game.js "$GAME_CONTENT_DIR"
cp "$GAME_DIR"/game/index.html "$BUILD_DIR"
cp "$GAME_DIR"/game/options.js "$GAME_CONTENT_DIR"
cp "$ENGINE_DIR"/build/engine.js "$GAME_CONTENT_DIR"
cp "$GAME_DIR"/game/style.css "$GAME_CONTENT_DIR"
cp -R "$GAME_DIR"/game/fonts "$GAME_CONTENT_DIR"
cp -R "$GAME_DIR"/game/images "$GAME_CONTENT_DIR"
cp -R "$GAME_DIR"/game/sounds "$GAME_CONTENT_DIR"

echo "Done"
