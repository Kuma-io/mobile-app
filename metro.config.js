const { getDefaultConfig, mergeConfig } = require("@expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

/**
 * Metro configuration
 * https://metrobundler.dev/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = getDefaultConfig(__dirname);
const modulesToEnableExports = ["@privy-io/expo", "@privy-io/expo/passkey"];

// config.transformer = {
//   ...config.transformer,
//   babelTransformerPath: require.resolve("react-native-svg-transformer"),
// };

const resolveRequestWithPackageExports = (context, moduleName, platform) => {
  if (modulesToEnableExports.includes(moduleName)) {
    const ctx = {
      ...context,
      unstable_enablePackageExports: true,
    };
    return ctx.resolveRequest(ctx, moduleName, platform);
  }

  return context.resolveRequest(context, moduleName, platform);
};

config.resolver.resolveRequest = resolveRequestWithPackageExports;

module.exports = withNativeWind(config, { input: "./global.css" });
