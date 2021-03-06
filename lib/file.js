const fs = require('fs')
const os = require('os')
const path = require('path')
const ONE_HOUR_AGO = Date.now() - 60 * 60 * 1000
const HOME_REGEX = new RegExp('^' + os.homedir())
const plist = require('plist')

class File {
  constructor (name, dir) {
    this.name = name
    this.path = path.join(dir, name)
    this.stats = null
  }

  isViewable (exclude) {
    const isHidden = this.path.match(/\/\.[^\/]+$/)
    const isExcluded = exclude.indexOf(this.path) !== -1
    return !isHidden && !isExcluded
  }

  isApp () {
    if (process.platform === 'win32') {
      return !!this.name.match(/\.(exe)$/)
    } else if (process.platform === 'darwin') {
      return !!this.name.match(/\.(prefPane|app)$/)
    } else {
      const mode = this.stats.mode
      return !!(mode & parseInt('0001', 8))
    }
  }

  title () {
    const fileName = this.name.split('.')[0]
    if (process.platform !== 'darwin' || !this.isApp()) {
      return fileName
    }
    try {
      const infoPath = path.join(this.path, 'contents', 'Info.plist')
      const file = plist.parse(fs.readFileSync(infoPath).toString())
      return file.CrAppModeShortcutName || file.CFBundleDisplayName || file.CFBundleName || fileName
    } catch (e) {
      return fileName
    }
  }

  isDirectory () {
    const isDirectory = this.stats.isDirectory()
    const isSymbolicLink = this.stats.isSymbolicLink()
    return isDirectory && !isSymbolicLink && !this.isApp()
  }

  isBroken () {
    return !this.stats
  }

  relativePath () {
    return this.path.replace(HOME_REGEX, '~')
  }

  toJson () {
    return {
      icon: this.isDirectory() ? 'fa-folder' : 'fa-file',
      title: this.title(),
      subtitle: this.relativePath(),
      value: this.relativePath(),
      id: this.relativePath(),
    }
  }

  getStats () {
    return new Promise((accept, reject) => {
      fs.stat(this.path, (err, stats) => {
        if (!err) this.stats = stats
        accept()
      })
    })
  }
}

module.exports = File
