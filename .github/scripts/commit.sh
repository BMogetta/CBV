#!/usr/bin/env bash
echo "inicio de echo"
echo $NEW_CBV_NAME
echo $COMMIT_NAME
echo "fin de echo"


git config --local user.email "action@github.com"
git config --local user.name "Github Action"
git add -A
git diff-index --quiet HEAD || (git commit -a -m "docs: Added $COMMIT_NAME" --allow-empty)