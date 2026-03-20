import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { ProductsModule } from './../products/products.module';
import { AuthModule } from './../auth/auth.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [ProductsModule, AuthModule], //* Importamos todo lo que PRODUCTMODULE este EXPORTANDO
})
export class SeedModule {}
