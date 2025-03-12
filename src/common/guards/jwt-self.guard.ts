import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class JwtSelfGuard implements CanActivate {
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();

    const userId = +req.user.id;
    const roleId = req.user.roleId ? +req.user.roleId : null;
    const paramId = +req.params.id;
    const userRole = req.user.role;

    // Agar ADMIN bo‘lsa, hech qanday tekshiruv qilinmaydi
    if (userRole === "ADMIN") {
      return true;
    }

    // Agar roleId mavjud bo‘lsa, roleId va params.id solishtiriladi
    // Agar roleId mavjud bo‘lmasa, userId va params.id solishtiriladi
    if ((roleId && roleId !== paramId) || (!roleId && userId !== paramId)) {
      throw new ForbiddenException({
        message: "Oka, sizda dostup yo‘q",
      });
    }

    return true;
  }
}
