// import * as esbuild from "esbuild";
const esbuild = require("esbuild");

let result = esbuild.buildSync({
  entryPoints: ["app.ts"],
  sourcemap: "external",
  //   write: false,
  outdir: "dist",
});
console.log(result);

for (let out of result.outputFiles) {
  console.log(out.path, out.contents, out.text);
}
