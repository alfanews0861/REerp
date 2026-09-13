const fs = require('fs');
const path = require('path');

function patchFile(filePath) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('drawingOpPool.removeLast()')) {
      content = content.replace(
        'drawingOpPool.removeLast()',
        'drawingOpPool.removeAt(drawingOpPool.size - 1)'
      );
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('[PATCH] Successfully patched ' + filePath);
    } else if (content.includes('drawingOpPool.removeAt(drawingOpPool.size - 1)')) {
      console.log('[PATCH] Already patched ' + filePath);
    }
  }
}

patchFile(path.resolve(__dirname, '../node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenStack.kt'));
patchFile(path.resolve(__dirname, '../../../node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenStack.kt'));
