import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileFilter, fileName } from './helpers';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@ApiTags('Files - Get and Upload')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response, //! respuesta con control manual
    @Param('imageName') imageName: string,
  ) {
    const path = this.filesService.getStaticProductImage(imageName);
    /*res.status(403).json({
      ok: false,
      path: path,
    });*/
    res.sendFile(path);
  }

  @Post('product')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter, //! estoy enviando como referencia no le estoy ejecutando, este se ejecuta antes de todo y realiza validaciones
      // limits: { fieldSize: 1000 },
      storage: diskStorage({
        destination: './static/products',
        filename: fileName,
      }),
    }),
  ) //* aqui se ubica el nombre como se puso en el form-data
  uploadProductFiel(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Make sure that the file is an image');
    }
    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`;
    //* claudinary un servicio externo para subir archivos
    return { secureUrl };
  }
}
