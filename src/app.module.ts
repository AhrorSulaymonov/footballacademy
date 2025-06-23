import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AdminModule } from "./admin/admin.module";
import { PrismaModule } from "./prisma/prisma.module";
import { JwtModule } from "@nestjs/jwt";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { PlayerModule } from "./player/player.module";
import { ParentModule } from "./parent/parent.module";
import { CoachModule } from "./coach/coach.module";
import { TeamModule } from "./team/team.module";
import { FileAmazonModule } from "./file-amazon/file-amazon.module";
import { PlayerParentModule } from "./player-parent/player-parent.module";
import { CoachTeamModule } from "./coach-team/coach-team.module";
import { MedicalRecordModule } from "./medical-record/medical-record.module";
import { SkillCategoryModule } from "./skill-category/skill-category.module";
import { SkillModule } from "./skill/skill.module";
import { SkillEvaluationModule } from "./skill-evaluation/skill-evaluation.module";
import { FeedbackModule } from "./feedback/feedback.module";
import { BadgeModule } from "./badge/badge.module";
import { TrainingSessionModule } from "./training-session/training-session.module";
import { TrainingVideoModule } from "./training-video/training-video.module";
import { AttendanceModule } from "./attendance/attendance.module";
import { EquipmentModule } from "./equipment/equipment.module";
import { TeamEquipmentModule } from "./team-equipment/team-equipment.module";
import { PlayerEquipmentModule } from "./player-equipment/player-equipment.module";
import { MatchModule } from "./match/match.module";
import { PositionModule } from "./position/position.module";
import { PlayerStatModule } from "./player-stat/player-stat.module";
import { EventModule } from "./event/event.module";
import { EventRegistrationModule } from "./event-registration/event-registration.module";

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ".env", isGlobal: true }),
    JwtModule.register({ global: true }),
    AdminModule,
    PrismaModule,
    AuthModule,
    UserModule,
    PlayerModule,
    ParentModule,
    CoachModule,
    TeamModule,
    FileAmazonModule,
    PlayerParentModule,
    CoachTeamModule,
    MedicalRecordModule,
    SkillCategoryModule,
    SkillModule,
    SkillEvaluationModule,
    FeedbackModule,
    BadgeModule,
    TrainingSessionModule,
    TrainingVideoModule,
    AttendanceModule,
    EquipmentModule,
    TeamEquipmentModule,
    PlayerEquipmentModule,
    MatchModule,
    PositionModule,
    PlayerStatModule,
    EventModule,
    EventRegistrationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
