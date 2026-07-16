import { execFile } from 'child_process';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffprobeStatic from 'ffprobe-static';
import fs from 'fs';
import path from 'path';

export const getVideoDuration = (filePath) => {
    return new Promise((resolve, reject) => {
        // Run ffprobe to get duration in seconds
        const args = [
            '-v', 'error',
            '-show_entries', 'format=duration',
            '-of', 'default=noprint_wrappers=1:nokey=1',
            filePath
        ];

        execFile(ffprobeStatic.path, args, { timeout: 10000 }, (error, stdout) => {
            if (error) {
                return reject(error);
            }
            const duration = parseFloat(stdout.trim());
            if (!isNaN(duration)) {
                resolve(duration);
            } else {
                reject(new Error("Could not determine duration"));
            }
        });
    });
};

export const compressVideo = (inputPath) => {
    return new Promise((resolve, reject) => {
        const ext = path.extname(inputPath);
        const fileName = path.basename(inputPath, ext);
        const dir = path.dirname(inputPath);

        const outputPath = path.join(dir, `${fileName}_compressed${ext}`);

        // scale='if(gt(iw,ih),-2,min(iw,720))':'if(gt(iw,ih),min(ih,720),-2)'
        // This downscales to 720p equivalent if it exceeds it, without upscaling smaller videos
        const scaleExpr = "scale='if(gt(iw,ih),-2,min(iw,720))':'if(gt(iw,ih),min(ih,720),-2)'";

        const args = [
            '-i', inputPath,
            '-vf', scaleExpr,
            '-c:v', 'libx264',
            '-crf', '28',
            '-preset', 'veryfast',
            '-c:a', 'aac',
            '-b:a', '128k',
            '-y', // overwrite output if exists
            outputPath
        ];

        execFile(ffmpegInstaller.path, args, { timeout: 300000 }, async (error, stdout, stderr) => {
            if (error) {
                try { await fs.promises.unlink(outputPath); } catch (_) { }
                return reject(error);
            }

            try {
                // Replace the original uncompressed file with the compressed one
                try {
                    await fs.promises.access(inputPath);
                    await fs.promises.unlink(inputPath);
                } catch (e) { } // Ignore if inputPath doesn't exist

                await fs.promises.rename(outputPath, inputPath);
                resolve(inputPath);
            } catch (e) {
                reject(e);
            }
        });
    });
};
