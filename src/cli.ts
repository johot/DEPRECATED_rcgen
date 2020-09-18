#!/usr/bin/env node
import program from "commander";
import chalk from "chalk";
import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import clipboardy from "clipboardy";

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

program
  .command("clip")
  .description("Create React component and paste into clipboard")
  // .option("-P, --production", "Create a production build")
  // .option("-C, --config <path>", "Razor React build config file")
  // .option("-A, --analyze", "Analyze bundle after build")
  // .option("-D, --debugErrors", "Create a build that can be more easily debugged for errors")
  // // Not needed currently, using it from config instead --> .option("--assetPrefix <path>", "Set the asset path to use, defaults to /")
  .action((options: any) => {
    main("clipboard");
  });

// Handle it however you like
if (process.argv.length < 3) {
  // e.g. display usage
  //program.help();

  main();
} else {
  program.parse(process.argv);
}

async function main(output: "file" | "clipboard" = "file") {
  const answers = await inquirer.prompt([
    {
      name: "componentName",
      message: "⚛️ Component name?",
    },
  ]);

  createComponent(answers.componentName, output);
}

function createComponent(componentName: string, output: "file" | "clipboard") {
  componentName = pascalcase(componentName);

  let template = fs.readFileSync(path.join(__dirname, "../templates/component.txt"), "utf-8");
  template = template.replace(/ComponentName/g, componentName);

  const outFileName = process.cwd() + "/" + componentName + ".tsx";

  if (output === "file") {
    if (fs.existsSync(outFileName)) {
      console.error("File already exists:", outFileName);
    } else {
      fs.writeFileSync(outFileName, template);
      console.log("Component created in file:", outFileName);
    }
  } else {
    clipboardy.writeSync(template);
    console.log("Component pasted to clipboard");
  }
}
