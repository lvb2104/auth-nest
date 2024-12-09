import { repl } from '@nestjs/core';
import { AppModule } from './app.module';
import { DatabaseService } from './database/database.service';

async function bootstrap() {
    const replServer = await repl(AppModule);

    const prisma = replServer.context.get(DatabaseService);

    replServer.context.prisma = prisma;

    console.log('Prisma is available as `prisma` in the REPL context.');
}
bootstrap();
