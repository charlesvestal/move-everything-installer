const { notarize } = require('@electron/notarize');

exports.default = async function notarizing(context) {
    const { electronPlatformName, appOutDir } = context;
    if (electronPlatformName !== 'darwin') {
        return;
    }

    const appName = context.packager.appInfo.productFilename;
    const appPath = `${appOutDir}/${appName}.app`;

    console.log(`Notarizing ${appPath}...`);

    const useCI = process.env.APPLE_ID && process.env.APPLE_APP_SPECIFIC_PASSWORD && process.env.APPLE_TEAM_ID;

    if (useCI) {
        console.log('Using CI credentials for notarization...');
        await notarize({
            appPath,
            tool: 'notarytool',
            appleId: process.env.APPLE_ID,
            appleIdPassword: process.env.APPLE_APP_SPECIFIC_PASSWORD,
            teamId: process.env.APPLE_TEAM_ID,
        });
    } else {
        console.log('Using local keychain profile for notarization...');
        await notarize({
            appPath,
            tool: 'notarytool',
            keychainProfile: 'AC_PASSWORD',
        });
    }

    console.log('Notarization complete.');
};
