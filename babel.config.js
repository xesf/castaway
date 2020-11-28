module.exports = {
    presets: [
        '@babel/preset-env',
        'react-app',
        [
            'minify',
            {
                mangle: false,
            }
        ],
    ],
    plugins: [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-object-rest-spread'
    ],
};
