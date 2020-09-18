#!/usr/bin/env node
import program from "commander";
import chalk from "chalk";
import fs from "fs";
import path from "path";
import inquirer from "inquirer";
const pascalcase = require("pascalcase");

const packageJson = require("../package.json");

program.version(packageJson.version);

program
  .command("page")
  .description("Create Next.js page")
  // .option("-P, --production", "Create a production build")
  // .option("-C, --config <path>", "Razor React build config file")
  // .option("-A, --analyze", "Analyze bundle after build")
  // .option("-D, --debugErrors", "Create a build that can be more easily debugged for errors")
  // // Not needed currently, using it from config instead --> .option("--assetPrefix <path>", "Set the asset path to use, defaults to /")
  .action((options: any) => {
    console.log("Create Next.js page TODO...");
  });

program
  .command("component")
  .description("Create React component")
  // .option("-P, --production", "Create a production build")
  // .option("-C, --config <path>", "Razor React build config file")
  // .option("-A, --analyze", "Analyze bundle after build")
  // .option("-D, --debugErrors", "Create a build that can be more easily debugged for errors")
  // // Not needed currently, using it from config instead --> .option("--assetPrefix <path>", "Set the asset path to use, defaults to /")
  .action((options: any) => {
    main();
  });

// Handle it however you like
if (process.argv.length < 3) {
  // e.g. display usage
  //program.help();

  main();
} else {
  program.parse(process.argv);
}

async function main() {
  const answers = await inquirer.prompt([
    {
      name: "componentName",
      message: "⚛️ Component name?",
    },
  ]);

  createComponent(answers.componentName);
}

function createComponent(componentName: string) {
  componentName = pascalcase(componentName);

  let template = fs.readFileSync(path.join(__dirname, "../templates/component.txt"), "utf-8");
  template = template.replace(/ComponentName/g, componentName);
  fs.writeFileSync(process.cwd() + "/" + componentName + ".tsx", template);
}