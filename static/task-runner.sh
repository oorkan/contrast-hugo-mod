#! /usr/bin/env bash

# colors
# red="\u001b[31m"
# green="\u001b[32m"
# yellow="\u001b[33m"
# clr="\u001b[0m"

# colors - better compatibility on macs
red="\e[1;31m"
green="\e[1;32m"
yellow="\e[1;33m"
clr="\e[1;0m"

event=$1
path=$2
src=$3
dest=$4

buildSass() {
    printf "\n%bBuilding css... %b" "$yellow" "$clr"
    npm run sass

    if [[ ! $(type -p unbuffer) ]]; then
        lint=$(npm run stylelint)
    else
        lint=$(unbuffer npm run stylelint)
    fi

    printf "%s" "$lint"

    if [[ $lint == *"error"* ]]; then
        printf "%b\n\nBuild Failed!%b\n\n" "$red" "$clr"
        exit 1
    fi
}

watchSass() {
    buildSass
}

buildJs() {
    printf "\n%bBuilding js... %b" "$yellow" "$clr"

    local path="$1"
    local src="$2"
    local dest="$3"

    filename=$(basename -- "$path")
    filenameMin=${filename%.*}.min.js

    filePathStructure=${path#"$src"}
    fileDirStructure=${filePathStructure%"$filename"}
    fullDestDir="$dest/$fileDirStructure"

    existingMinFilePath=${path%.*}.min.js
    existingMapPath=${existingMinFilePath%.*}.js.map

    printf "\nCompiling %s%b " "$path" "$clr"

    mkdir -p "$fullDestDir"

    if [[ -e "$existingMinFilePath" ]]; then
        cp "$existingMinFilePath" "$fullDestDir"

        if [[ -e "$existingMapPath" ]]; then
            cp "$existingMapPath" "$fullDestDir"
        fi
    else
        terser "$path" -o "$fullDestDir/$filenameMin" --source-map --compress --mangle
    fi

    printf "%b✓%b\n" "$green" "$clr"
}

watchJs() {
    local path="$1"

    buildJs "$path" "js/src/" "js/"
}

build() {
    printf "\n%bBuilding css... %b" "$yellow" "$clr"
    npm run scss

    if [[ ! $(type -p unbuffer) ]]; then
        lint=$(npm run stylelint)
    else
        lint=$(unbuffer npm run stylelint)
    fi

    printf "%s" "$lint"

    if [[ $lint == *"error"* ]]; then
        printf "%b\n\nBuild Failed!%b\n\n" "$red" "$clr"
        exit 1
    fi
}

watch() {
    npm run scss
    npm run stylelint
}

if [[ $event == "build:sass" ]]; then
    buildSass
    printf "%b\n\nSass Build Complete ✓%b\n\n" "$green" "$clr"
fi

if [[ $event == "build:js" ]]; then
    buildJs "$path" "$src" "$dest"
    printf "%b\nJs Build Complete ✓%b\n\n" "$green" "$clr"
fi

if [[ $event == "build" ]]; then
    build

    printf "%b\n\nBuild Complete ✓%b\n\n" "$green" "$clr"
fi

if [[ $event == "change" ]]; then
    if [[ $path == *".js" ]]; then
        watchJs "$path"
    fi

    if [[ $path == *".scss" ]]; then
        watchSass
    fi
fi
