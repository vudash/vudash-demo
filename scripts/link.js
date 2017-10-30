#!env node

const { dependencies } = require('../package.json')
const { spawn } = require('child_process')

const deps = Object.keys(dependencies)

function link (pkg) {
  const link = spawn('npm', ['link', pkg])
  
  link.stdout.on('data', data => {
    console.log(`stdout: ${data}`)
  })
  
  link.stderr.on('data', data => {
    console.log(`stderr: ${data}`)
  })
  
  link.on('close', code => {
    console.log(`child process exited with code ${code}`)
  })
}

deps.forEach(pkg => {
  link(pkg)
})