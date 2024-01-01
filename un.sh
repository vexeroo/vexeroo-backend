#!/bin/bash

# For every directory in the current directory
for dir in ./*/
do
    # Create a file named "flow" and write "flow" into it
    echo "flow" > "${dir}flow"
done