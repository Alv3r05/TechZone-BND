import app from './app';
import config from './config';

const port = config.app.port;

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
