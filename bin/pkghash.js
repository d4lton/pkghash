#!/usr/bin/env node

const fs = require("fs");
const {exec} = require("child_process");

async function shell(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) { return reject(error) }
      resolve(stdout.trim());
    });
  });
}

(async () => {
  const data = JSON.parse(fs.readFileSync("package.json").toString());
  data.commit = {};
  data.commit.hash = await shell("git rev-parse HEAD");
  data.commit.time = await shell(`git show --no-patch --no-notes --pretty='%cd' ${data.commit.hash}`);
  fs.writeFileSync("package.json", JSON.stringify(data, null, 2));
})();
