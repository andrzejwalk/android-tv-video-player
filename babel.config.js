module.exports = function (api) {
  // Cache config permanently - our config is static (no env-based logic)
  api.cache(true);

  return {
    presets: [
      'babel-preset-expo',
    ],
  };
};
