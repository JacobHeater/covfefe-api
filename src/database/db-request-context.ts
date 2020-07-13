import { User } from "@common/models/entities/user/user";
import { IMongoConnection } from "./mongo/imongo-connection";
import { IRequestContext } from "@app/request/irequest-context";
import { IPermissionWaiver } from "@common/security/permissions/ipermission-waiver";

export class DbRequestContext implements IRequestContext {
  connection: IMongoConnection;
  user: User;
  waivePermissions?: IPermissionWaiver = null;
}
