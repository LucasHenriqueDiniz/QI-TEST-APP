// Frames of a screen recording as PNGs, through AVFoundation (no ffmpeg needed).
// usage: swift video_frames.swift <video.mp4> <out-dir> <fps> [start-s] [end-s]
import AVFoundation
import AppKit

let args = CommandLine.arguments
let url = URL(fileURLWithPath: args[1])
let outDir = args[2]
let fps = Double(args[3]) ?? 30
let asset = AVURLAsset(url: url)
let duration = CMTimeGetSeconds(asset.duration)
let start = args.count > 4 ? Double(args[4])! : 0
let end = args.count > 5 ? min(Double(args[5])!, duration) : duration
let generator = AVAssetImageGenerator(asset: asset)
generator.requestedTimeToleranceBefore = .zero
generator.requestedTimeToleranceAfter = .zero
generator.maximumSize = CGSize(width: 360, height: 780)
var t = start
var n = 0
while t < end {
    let time = CMTime(seconds: t, preferredTimescale: 600)
    if let cg = try? generator.copyCGImage(at: time, actualTime: nil) {
        let rep = NSBitmapImageRep(cgImage: cg)
        let data = rep.representation(using: .png, properties: [:])!
        try! data.write(to: URL(fileURLWithPath: String(format: "%@/f%04d_%05.0fms.png", outDir, n, t * 1000)))
        n += 1
    }
    t += 1.0 / fps
}
print("\(n) frames, video \(String(format: "%.2f", duration)) s")
