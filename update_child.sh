#!/bin/bash

# Usage: ./update_child.sh /path/to/child/project

if [ -z "$1" ]; then
  echo "Usage: $0 /path/to/child/project"
  exit 1
fi

CHILD_PATH="$1"
EXCLUDE_FILE="rsync-exclude.txt"

rsync -av --exclude-from="$EXCLUDE_FILE" "$CHILD_PATH/" "./" 