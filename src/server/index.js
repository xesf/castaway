import fs from 'fs';
import path from 'path';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import webpack from 'webpack';
import webpackDevServer from 'webpack-dev-middleware';

import webpackConfig from '../../webpack.config';
import App from './index-ssr';

const cwd = process.cwd();

const logStream = fs.createWriteStream(path.join(cwd, '/server-log.txt'), { flags: 'a' });

const app = express();

app.listen(process.env.port || 8080, process.env.host || '0.0.0.0');

app.use(morgan('combined', { stream: logStream}));
app.use(cors());

webpackConfig.devtool = process.env.SRCMAP === 'true' ? 'source-map' : undefined;
const compiler = webpack(webpackConfig);
app.use(webpackDevServer(compiler));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// app.use('/', express.static(path.join(cwd, 'public')));
app.use('/assets', express.static(path.join(cwd, 'public/assets')));
app.use('/data', express.static(path.join(cwd, 'data')));

const indexBody = renderToStaticMarkup(React.createElement(App));

app.get('/', (req, res) => {
    res.end(indexBody);
});
