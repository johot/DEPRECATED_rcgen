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
  .option("-C, --clip", "Add component to clipboard (instead of file)")
  .option("-P, --page", "Create Next.js page component")
  .option("-I, --import", "Include React import")
  .action((componentName: any, options: any) => {
    if (options.page) throw new Error("Not implemented yet");

    createReactComponent(componentName, options.import, options.clip ? "clipboard" : "file");
  });

program.parse(process.argv);

async function createReactComponent(
  componentName: string,
  addReactImport: boolean,
  output: "file" | "clipboard" = "file"
) {
  // const answers = await inquirer.prompt([
  //   {
  //     name: "componentName",
  //     message: "⚛️ Component name?",
  //   },
  // ]);

  createComponent(componentName, addReactImport, output);
}

function createComponent(componentName: string, addReactImport: boolean, output: "file" | "clipboard") {
  componentName = pascalcase(componentName);

  let template = fs.readFileSync(path.join(__dirname, "../templates/component.txt"), "utf-8");
  template = template.replace(/ComponentName/g, componentName);

  if (!addReactImport) template = template.replace(/import React from "react";/g, "");

  template = template.trim();

  const outFileName = path.resolve(process.cwd() + "/" + componentName + ".tsx");

  if (output === "file") {
    if (fs.existsSync(outFileName)) {
      console.error("File already exists:", outFileName);
    } else {
      fs.writeFileSync(outFileName, template);
      console.log(`Component  (${chalk.magentaBright(componentName)}) created in file:`, outFileName, "👍");
    }
  } else {
    clipboardy.writeSync(template);
    console.log(`Component (${chalk.magentaBright(componentName)}) pasted to clipboard 👍`);
  }
}
