"""Check 16 KB page-size compatibility of the native libs inside an APK.

usage: check_16k.py <app.apk> [abis]   (abis default: arm64-v8a,x86_64)

Two things must hold for each 64-bit .so:
  1. ELF: every PT_LOAD segment has p_align >= 16384.
  2. ZIP: if the .so is stored uncompressed, its data starts at a 16384 multiple.
"""
import struct
import sys
import zipfile

PAGE = 16384
PT_LOAD = 1


def elf_min_load_align(data: bytes):
    if data[:4] != b"\x7fELF":
        return None
    if data[4] != 2:  # 32-bit ELF, out of scope for 16 KB
        return "32bit"
    e_phoff = struct.unpack_from("<Q", data, 0x20)[0]
    e_phentsize, e_phnum = struct.unpack_from("<HH", data, 0x36)
    aligns = []
    for i in range(e_phnum):
        off = e_phoff + i * e_phentsize
        p_type = struct.unpack_from("<I", data, off)[0]
        if p_type == PT_LOAD:
            aligns.append(struct.unpack_from("<Q", data, off + 0x30)[0])
    return min(aligns) if aligns else None


def data_offset(f, info):
    f.seek(info.header_offset)
    hdr = f.read(30)
    name_len, extra_len = struct.unpack_from("<HH", hdr, 26)
    return info.header_offset + 30 + name_len + extra_len


def main(path, abis):
    bad = 0
    total = 0
    with zipfile.ZipFile(path) as z, open(path, "rb") as f:
        for info in z.infolist():
            parts = info.filename.split("/")
            if len(parts) != 3 or parts[0] != "lib" or parts[1] not in abis:
                continue
            if not info.filename.endswith(".so"):
                continue
            total += 1
            align = elf_min_load_align(z.read(info))
            stored = info.compress_type == zipfile.ZIP_STORED
            zip_ok = (data_offset(f, info) % PAGE == 0) if stored else None
            elf_ok = isinstance(align, int) and align >= PAGE
            ok = elf_ok and zip_ok is not False
            if not ok:
                bad += 1
            print(
                f"{'OK ' if ok else 'BAD'}  {info.filename:60s} "
                f"elf_align={align if isinstance(align, str) else hex(align or 0):>8s} "
                f"zip={'stored' if stored else 'deflated'}"
                f"{'' if zip_ok is None else (' aligned' if zip_ok else ' MISALIGNED')}"
            )
    print(f"\n{total} libs checked, {total - bad} ok, {bad} bad")
    return 1 if bad else 0


if __name__ == "__main__":
    abis = sys.argv[2] if len(sys.argv) > 2 else "arm64-v8a,x86_64"
    sys.exit(main(sys.argv[1], set(abis.split(","))))
