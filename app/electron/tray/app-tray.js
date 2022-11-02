import { Menu, Tray, nativeTheme, nativeImage } from 'electron';
import { trayMenus } from '../menus';
const { APP_NAME, TRAY_ICON_DARK, TRAY_ICON_LIGHT } = $tools;
export function creatAppTray({ menus = trayMenus, title = APP_NAME, icon, } = {}) {
    const iconPath = icon !== null && icon !== void 0 ? icon : (process.platform === 'darwin'
        ? nativeTheme.shouldUseDarkColors
            ? TRAY_ICON_LIGHT
            : TRAY_ICON_DARK
        : TRAY_ICON_LIGHT);
    const image = nativeImage.createFromPath(iconPath);
    image.isMacTemplateImage = true;
    const tray = new Tray(image);
    tray.setToolTip(title);
    tray.setContextMenu(Menu.buildFromTemplate(menus));
    tray.on('double-click', () => {
        $tools.createWindow('Home');
    });
    return tray;
}
