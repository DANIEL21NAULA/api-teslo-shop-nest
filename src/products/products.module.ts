import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product, ProductImage } from './entities';
import { AuthModule } from './../auth/auth.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    TypeOrmModule.forFeature([Product, ProductImage]), //! Esto crea nuestra entity en la base de datos
    AuthModule,
  ],
  exports: [ProductsService, TypeOrmModule], //! importacion para que la entity pueda ser utilizado en otros modulos
})
export class ProductsModule {}
