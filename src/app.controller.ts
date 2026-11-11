import { Body, Controller, Get, Post, Redirect, Render } from '@nestjs/common';
import { AppService } from './app.service.js';
import { UjSzabalyDto } from './uj-szabaly.dto.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  async getSzabalyok() {
    return {
      title: 'Tűzfal tiltólista',
      szabalyok: await this.appService.szabalyLista(),
    };
  }

  @Get('uj-szabaly')
  @Render('szabalyform')
  ujSzabalyForm() {
    return {
      title: 'Új szabály',
    };
  }

  @Post('uj-szabaly')
  @Redirect('/')
  async ujSzabaly(@Body() body: UjSzabalyDto) {
    await this.appService.ujSzabaly(
      parseInt(body.priority),
      body.mac,
      body.enabled === 'on',
    );
  }
}
