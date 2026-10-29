"""Puts the showcase history in the app for store screenshots, and the owner's back.

usage: showcase.py write <backup-dir>     (dev build installed)
       showcase.py restore <backup-dir>   (dev build installed)

`write` copies the app's storage out to <backup-dir> (it must not exist yet,
so a backup is never overwritten) and writes scripts/store/showcase.json's
history in its place, with no test in progress and no pending review prompt.
Install the preview build over the dev build afterwards (same package and
signing key, so the data stays), take the shots (scripts/device/
store_shots.py), reinstall the dev build and run `restore`. Both need the
dev build because only a debuggable app lets `run-as` reach its storage.
"""
import json
import os
import sys
import time

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(HERE), "device"))
import ui  # noqa: E402


def main():
    if len(sys.argv) != 3 or sys.argv[1] not in ("write", "restore"):
        sys.exit(__doc__)
    action, backup = sys.argv[1], sys.argv[2]
    ui.require_device()
    ui.adb("shell", "am", "force-stop", ui.PACKAGE)
    if action == "write":
        if os.path.exists(backup):
            sys.exit(f"{backup} exists; refusing to overwrite a backup")
        os.makedirs(backup)
        ui.pull_storage(backup)
        if not os.path.exists(os.path.join(backup, "RKStorage")):
            sys.exit("could not copy the app's storage out (is the dev build installed?)")
        showcase = json.load(open(os.path.join(HERE, "showcase.json")))
        ui.write_storage(backup, {**showcase, "reviewPromptedAt": int(time.time() * 1000)}, ("testProgress",))
        print(f"owner's storage in {backup}; showcase written ({len(showcase['testHistory'])} entries)")
    else:
        ui.push_storage(backup)
        print(f"owner's storage restored from {backup}")


if __name__ == "__main__":
    main()
