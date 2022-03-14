const crypto = require('crypto');
const fs = require('fs');

// Default configuration for generating JWT secrets
const SECRET_LENGTH = 64;
/** @type {BufferEncoding} */
const SECRET_FORMAT = 'hex';
const ENV_FILE = '.env';

function generateSecret() {
    return crypto.randomBytes(SECRET_LENGTH)
        .toString(SECRET_FORMAT);
}

function createJwtSecrets() {
    // prepare the env with the generated secrets
    const envKeys = ['JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'];
    const content = fs.readFileSync(ENV_FILE, 'utf8');

    const lines = content.split('\n')
        .map((line) => {
            // tries to find the key
            const selectedKey = envKeys.find((key) =>
                line.startsWith(`${key}=`));

            if (selectedKey) {
                // replace line with generated values
                return `${selectedKey}=${generateSecret()}`;
            }

            // not replacing the line
            return line;
        });

    fs.writeFileSync(ENV_FILE, lines.join('\n'), 'utf8');
}

createJwtSecrets();