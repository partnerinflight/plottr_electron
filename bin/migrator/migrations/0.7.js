var _ = require('lodash')

function migrate (data) {
  if (data.file && data.file.version === '0.7.0') return

  var obj = _.cloneDeep(data)

  // remove chapters ... yes again
  delete obj.chapters

  // remove chapter ids from scenes
  data.scenes.forEach((s) => {
    delete s.chapterId
  })

  return obj
}

module.exports = migrate
