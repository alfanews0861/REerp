const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Find the project and workspace directories
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Watch all files within the monorepo
config.watchFolders = [workspaceRoot];
// 2. Let Metro know where to resolve packages and in what order
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// 3. Prevent Metro from traversing nested node_modules in packages to prevent duplicate copies
config.resolver.disableHierarchicalLookup = true;

// 4. Force singletons for React and core libraries to prevent "Cannot read property 'useMemo' of null"
const singletons = [
  'react',
  'react-native',
  'expo',
  'expo-router',
  '@react-navigation/native',
  'react-native-safe-area-context',
  'react-native-screens',
];

config.resolver.extraNodeModules = singletons.reduce((acc, name) => {
  acc[name] = path.resolve(projectRoot, 'node_modules', name);
  return acc;
}, {});

const originalResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  // If requesting any singleton or its subpath, force resolution from projectRoot
  for (const name of singletons) {
    if (moduleName === name || moduleName.startsWith(name + '/')) {
      const redirectedContext = {
        ...context,
        originModulePath: path.resolve(projectRoot, 'package.json'),
      };
      return (originalResolveRequest || context.resolveRequest)(
        redirectedContext,
        moduleName,
        platform
      );
    }
  }

  return (originalResolveRequest || context.resolveRequest)(
    context,
    moduleName,
    platform
  );
};

module.exports = config;
