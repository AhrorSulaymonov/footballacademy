import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { ROLES_KEY } from "../decorators/roles-auth.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector
  ) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    );

    if (!requiredRoles) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException({
        message: "Headerda token berilmagan",
      });
    }

    const bearer = authHeader.split(" ")[0];
    const token = authHeader.split(" ")[1];

    if (bearer !== "Bearer" || !token) {
      throw new UnauthorizedException({
        message: "Bearer token berilmagan",
      });
    }

    let user: any;
    try {
      // 🛠 Tokenni tekshirish uchun secret keyni tanlash
      const tempUser = this.jwtService.decode(token) as { role: string };

      const secretKey =
        tempUser.role === "ADMIN"
          ? process.env.ACCESS_TOKEN_KEY_ADMIN
          : process.env.ACCESS_TOKEN_KEY;

      user = this.jwtService.verify(token, { secret: secretKey });
    } catch (error) {
      throw new UnauthorizedException({
        message: "Token verification failed",
      });
    }

    req.user = user;

    // 🛠 `user.role` formatini tuzatish
    const roles = Array.isArray(user.role)
      ? user.role.map((r) => (typeof r === "string" ? { value: r } : r))
      : [{ value: user.role }];

    const permission = roles.some((role) => requiredRoles.includes(role.value));
    if (!permission) {
      throw new ForbiddenException({
        message: "Sizga ruxsat berilmagan",
      });
    }
    return true;
  }
}
