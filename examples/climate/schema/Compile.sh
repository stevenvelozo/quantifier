#! /bin/bash
echo "Climate DDL Compilation"
echo ""
echo "Note: This script requires the stricture tool to be installed globally. You can "
echo "      install it by executing the command: npm install -g stricture"
echo ""
echo "---"
echo ""

echo "--> Generating JSON model from DDL using Stricture"
stricture -i ./Climate.mddl -c Compile -f ./ -o "Climate"

# We don't need the PICT stuff for this project.
rm Climate-PICT.json

echo "--> Generating Meadow Schemas from JSON using Stricture"
stricture/bin/stricture -i ./Climate-Extended.json -c Meadow  -f ./ -o "MeadowSchema-"
