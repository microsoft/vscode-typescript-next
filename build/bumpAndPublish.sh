#!/bin/bash
npm run bump-version
result=$?

if [ $result -eq 0 ]; then
    output="$(npx vsce publish $f --pat $1 --noVerify 2>&1)"
    publishResult=$?
    echo $output
    if [ $publishResult -eq 0 ]; then
        exit
    elif [[ $output =~ "already exists" ]]; then
        echo "Publish failed but expected. Skipping publishing same version."
        exit
    else
        echo "Error publishing"
        exit 1
    fi;
elif [ $result -eq 1 ]; then
    echo "Skipping publishing same version"
    exit
else
    echo "Error. Exited with $result"
    exit 1
fi