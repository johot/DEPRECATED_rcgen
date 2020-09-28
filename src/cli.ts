#!/usr/bin/env node
import program from "commander";
import chalk from "chalk";
import fs from "fs";
import path from "path";
//import inquirer from "inquirer";
import clipboardy from "clipboardy";

const pascalcase = require("pascalcase");

const packageJson = require("../package.json");

program.version(packageJson.version);

program
  .arguments("<componentName>")
  .option("-c, --clip", "Add component to clipboard (instead of file)")
  .option("-p, --page", "Create Next.js page component")
  .option("-i, --import", "Include React import")
  .action((componentName: any, options: any) => {
    createComponent(
      componentName,
      options.page ? "nextjspage" : "component",
      options.import,
      options.clip ? "clipboard" : "file"
    );
  });

program.parse(process.argv);

function createComponent(
  componentName: string,
  templateType: "component" | "nextjspage",
  addReactImport: boolean,
  output: "file" | "clipboard"
) {
  const originalComponentName = componentName;

  // Pascal case it!
  componentName = pascalcase(componentName);

  let templateContents = fs.readFileSync(path.join(__dirname, "../templates/" + templateType + ".txt"), "utf-8");
  templateContents = templateContents.replace(/ComponentName/g, componentName);

  if (!addReactImport) templateContents = templateContents.replace(/import React from "react";/g, "");

  templateContents = templateContents.trim();

  const outFileName = path.resolve(
    process.cwd() + "/" + (templateType === "nextjspage" ? originalComponentName : componentName) + ".tsx"
  );

  if (output === "file") {
    if (fs.existsSync(outFileName)) {
      console.error("File already exists:", outFileName);
    } else {
      fs.writeFileSync(outFileName, templateContents);
      console.log(`Component  (${chalk.magentaBright(componentName)}) created in file:`, outFileName, "👍");
    }
  } else {
    clipboardy.writeSync(templateContents);
    console.log(`Component (${chalk.magentaBright(componentName)}) pasted to clipboard 👍`);
  }
}
