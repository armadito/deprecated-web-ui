#!/bin/bash

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
INCLUDE_BIN_PATH=$DIR/../build/linux/packages/ubuntu/debian/source/include-binaries
INCLUDE_BINARIES=

for fn in `find $DIR/../bower_components -type f -exec file {} \; | grep -v text | cut -d: -f1`; do
    fn=$(echo $fn | perl -pe 's|^.*?\/bower_components|bower_components|')
    INCLUDE_BINARIES+="${fn}\n"
done

echo -e "Following files are detected as binaries :"
echo -e $INCLUDE_BINARIES
echo -e $INCLUDE_BINARIES > $INCLUDE_BIN_PATH
