import { IUserContext } from "./iuser-context";
import { IPermissionWaiver } from '@common/security/permissions/ipermission-waiver';

export interface IRequestContext extends IUserContext {
  waivePermissions?: IPermissionWaiver;
}
