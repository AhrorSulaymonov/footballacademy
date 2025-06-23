import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { WinstonModule } from "nest-winston";
import { winstonConfig } from "./logger/winston-logger";
import { AllExceptionsFilter } from "./logger/error.handling";

async function bootstrap() {
  try {
    const PORT = process.env.PORT ?? 3003;
    const app = await NestFactory.create(AppModule, {
      logger: WinstonModule.createLogger(winstonConfig),
    });

    // Swagger konfiguratsiyasi
    const config = new DocumentBuilder()
      .setTitle("Football academy API")
      .setDescription("Football academy API documentation")
      .setVersion("1.0")
      .addBearerAuth(
        // <-- O'ZGARTIRILGAN QISM BOSHLANISHI
        {
          type: "http", // Autentifikatsiya turi
          scheme: "bearer", // Sxema nomi (Bearer token uchun)
          bearerFormat: "JWT", // Token formati
          name: "JWT Authorization", // Swagger UI da ko'rinadigan nom
          description: "Iltimos, JWT tokeningizni kiriting", // Tavsif
          in: "header", // Token qayerda joylashishi (headerda)
        },
        "access-token" // Bu KEY @ApiBearerAuth('access-token') dekoratorida ishlatiladi
      ) // <-- O'ZGARTIRILGAN QISM TUGASHI
      .addServer("/api") // API prefiksini qo‘shish
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api/docs", app, document); // Swagger dokumentatsiyasini "api/docs" URL ga joylash

    app.use(cookieParser()); // Cookie'larni o'qish uchun middleware
    app.useGlobalPipes(new ValidationPipe()); // Global DTO validatsiya uchun pipe qo'shish
    app.useGlobalFilters(new AllExceptionsFilter());
    app.setGlobalPrefix("api"); // Barcha endpointlarga "api" prefiksini qo'shish

    await app.listen(PORT, () => {
      console.log(`Server started at: http://localhost:${PORT}`);
      console.log(`Swagger docs: http://localhost:${PORT}/api/docs`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
  }
}

bootstrap();
