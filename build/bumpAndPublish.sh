#!/bin/bash
npm run bump-version
result=$?

if [ $result -eq 0 ]; then
    npx vsce publish $f --pat $1 --noVerify
    exit
elif [ $result -eq 1 ]; then
    echo "Skipping publishing new version"
    exit
else
    echo "Error. Exited with $result"
    exit 1
fi