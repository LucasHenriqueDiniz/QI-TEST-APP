#!/bin/sh
# usage: shot.sh <name> [dir]
# Saves <name>-full.png (device resolution) and <name>.png (height 1170, cheap
# to read) and prints the small one's path. Dir defaults to $SHOTS_DIR or
# $TMPDIR/qi-shots; screenshots never go into the repo.
set -e
NAME="$1"
DIR="${2:-${SHOTS_DIR:-${TMPDIR:-/tmp}/qi-shots}}"
[ -n "$NAME" ] || { echo "usage: shot.sh <name> [dir]" >&2; exit 2; }
mkdir -p "$DIR"
adb exec-out screencap -p > "$DIR/$NAME-full.png"
sips -Z 1170 "$DIR/$NAME-full.png" --out "$DIR/$NAME.png" >/dev/null
echo "$DIR/$NAME.png"
