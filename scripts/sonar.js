const inquirer = require('inquirer');
const execSync = require('child_process').execSync;

async function runSonar(answer) {
  let key = answer.key;
  let sh = './sonar-scanner/bin/sonar-scanner ' +
    '-Dproject.settings=.sonarcloud.properties -Dsonar.login=';
  execSync(sh + key, {stdio: 'inherit'}, (err) => {
    if (err !== null) {
      console.log('exec error: ', err);
    }
  });
}

const question = [
  {
    message: 'What is your analysis key?',
    type: 'input',
    name: 'key',
    validate: (keyI) => {
      return keyI !== '';
    }
  }
];

inquirer.prompt(question).then(runSonar); 
