#!/usr/bin/env bash

SCRIPT_PATH=$(readlink -f $0)

echo $SCRIPT_PATH

PRETTIER_PATH=$(node -e "console.log(require('module').createRequire('$SCRIPT_PATH').resolve('prettier'))")
PRETTIER_PATH=$(dirname $PRETTIER_PATH)/bin/prettier.cjs

CONFIG_PATH=$SCRIPT_PATH
CONFIG_PATH=$(dirname $CONFIG_PATH)
CONFIG_PATH=$(dirname $CONFIG_PATH)
CONFIG_PATH=$CONFIG_PATH/.prettierrc.js

eval $PRETTIER_PATH --config $CONFIG_PATH $@
