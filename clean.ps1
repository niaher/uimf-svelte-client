Remove-Item -Path ./src/ts, ./example -Include *js, *.js.map, *.d.ts -Recurse -ErrorAction Ignore
Remove-Item -Path ./index.js, ./index.js.map, ./index.d.ts -ErrorAction Ignore
Remove-Item -Path ./*tgz