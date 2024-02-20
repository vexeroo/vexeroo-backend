#!/bin/bash

for dir in ./*/
do
    # Copy the content of 'flow.txt' into a file named "Dockerfile" in each directory
    cp flow2.txt "${dir}tsconfig.json"
done



# # For every directory in the current directory
# for dir in ./*/
# do
#     # Create a file named "flow" and write "flow" into it
#     echo '"use strict";' > "${dir}app.js"
# done


#!/bin/bash
