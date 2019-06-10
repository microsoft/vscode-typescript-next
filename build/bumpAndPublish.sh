#!/bin/bash
npm run bump-version
result=$?

EXPECTED_ERROR_CODE=1
UNEXPECTED_ERROR_CODE=2

if [ $result -eq 0 ]; then
    output="$(npx vsce publish $f --pat $1 --noVerify 2>&1)"
    publishResult=$?
    echo $output
    if [ $publishResult -eq 0 ]; then
        exit
    elif [[ $output =~ "already exists" ]]; then
        echo "Publish failed but expected. Skipping publishing same version."
        exit $EXPECTED_ERROR_CODE
    else
        echo "Error publishing"
        exit $UNEXPECTED_ERROR_CODE
    fi;
elif [ $result -eq 1 ]; then
    echo "Skipping publishing same version"
    exit $EXPECTED_ERROR_CODE
else
    echo "Error. Exited with $result"
    exit $UNEXPECTED_ERROR_CODE
fi