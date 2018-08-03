import ServiceNames from './serviceNames.mjs';
import UserService from './userService.mjs';
import MenuService from './menuService.mjs';

export default {
    [ServiceNames.USER]:UserService,
    [ServiceNames.MENU]:MenuService
}