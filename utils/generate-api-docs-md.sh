#!/usr/bin/env bash
SCRIPT_ROOT=$(cd $(dirname $0); pwd)

cd $SCRIPT_ROOT/..

API_DOC_OUTPUT_DIR=docs/en-US/api
SRC_DIR=src/lib

rm -rf $API_DOC_OUTPUT_DIR

npx typedoc \
    --exclude "**/*+(index|.test).ts" \
    --out api \
    --readme none \
    --name "Documents for @litert/uuid" \
    --plugin typedoc-plugin-markdown \
    --plugin typedoc-vitepress-theme \
    --sourceLinkTemplate "https://github.com/litert/uuid.js/blob/master/{path}#L{line}" \
    $SRC_DIR/Snowflake.ts \
    $SRC_DIR/SnowflakeSI.ts \
    $SRC_DIR/UUIDv4.ts \
    $SRC_DIR/UUIDv5.ts

mv api $API_DOC_OUTPUT_DIR
