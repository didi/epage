const msgPath = process.env.HUSKY_GIT_PARAMS
const msg = require('fs').readFileSync(msgPath, 'utf-8').trim()
const child = require('child_process')
const color = require('./color')

function checkGitAccount () {
  child.exec('git config user.email', function (err, sto) {
    const unsafeStr = /@didi(chuxing|global)?\.com$/

    if (err) process.exit(1)
    const account = (sto || '').trim()

    if (unsafeStr.test(account)) {
      console.error(color.red('Please switch to your personal  github account !!!'))
      process.exit(1)
    } else {
      checkCommitMsg(msg)
    }
  })
}

function checkCommitMsg (msg) {
  const commitRE = /^(revert|feat|fix|docs|style|refactor|perf|test|chore)(\(.+\))?: .{1,50}/

  if (!commitRE.test(msg)) {
    console.log()
    console.error(color.red('Invalid commit message format.') + '\nmust start with revert|feat|fix|docs|style|refactor|perf|test|chore:\nExample: feat: upgrade v0.1 xxx\n')
    process.exit(1)
  } else {
    return true
  }
}

checkGitAccount()
