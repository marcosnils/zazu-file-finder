// Deprecated use zazu.json now.
module.exports = {
  name: 'File Finder',
  version: '0.0.1',
  description: 'Find files and applications on your computer easily.',
  blocks: {
    external: [
      {
        id: 'AppCache',
        type: 'ServiceScript',
        script: 'appCacheManager.js',
        interval: 30 * 1000,
      },
    ],
    input: [
      {
        id: 'FindApp',
        type: 'RootScript',
        script: 'appFinder.js',
        connections: ['openApp'],
      },
      {
        id: 'FindScript',
        type: 'PrefixScript',
        prefix: 'find',
        space: true,
        args: 'Required',
        script: 'fileFinderManager.js',
        connections: ['find'],
      },
      {
        id: 'OpenScript',
        type: 'PrefixScript',
        prefix: 'open',
        space: true,
        args: 'Required',
        script: 'fileFinderManager.js',
        connections: ['open'],
      },
    ],
    output: [
      {
        id: 'open',
        type: 'OpenFile',
      },
      {
        id: 'find',
        type: 'ShowFile',
      },
      {
        id: 'openApp',
        type: 'UserScript',
        script: 'openAppManager.js',
        connections: ['open'],
      },
    ],
  },
}
