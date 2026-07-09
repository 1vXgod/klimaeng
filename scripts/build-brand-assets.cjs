/* One-off: derive favicon + optimized logo assets from the client-provided
   source PNGs in public/brand. */
const sharp = require("sharp");

(async () => {
  // Browser-tab favicon (transparent, square)
  await sharp("public/brand/mark-source.png")
    .resize(256, 256, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9, palette: true })
    .toFile("src/app/icon.png");

  // Apple touch icon (solid background, as iOS requires)
  await sharp("public/brand/mark-source.png")
    .resize(180, 180, { fit: "contain", background: "#ffffff" })
    .flatten({ background: "#ffffff" })
    .png({ compressionLevel: 9 })
    .toFile("src/app/apple-icon.png");

  // Circular mark for UI components (navbar/admin/footer; displayed ≤40px)
  await sharp("public/brand/mark-source.png")
    .resize(128, 128, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9, palette: true })
    .toFile("public/brand/mark.png");

  // Full wordmark for light backgrounds (3x the ~34px display height)
  await sharp("public/brand/logo-source.png")
    .resize({ height: 102 })
    .png({ compressionLevel: 9 })
    .toFile("public/brand/logo.png");

  for (const f of ["src/app/icon.png", "src/app/apple-icon.png", "public/brand/mark.png", "public/brand/logo.png"]) {
    const m = await sharp(f).metadata();
    const kb = Math.round(require("fs").statSync(f).size / 1024);
    console.log(`${f}: ${m.width}x${m.height}, ${kb} KB`);
  }
})();
