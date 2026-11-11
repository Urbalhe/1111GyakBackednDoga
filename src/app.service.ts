import { Injectable } from '@nestjs/common';
import mysql from 'mysql2/promise';
import { Szabaly } from './szabaly.js';

const mysqlConnection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'blocklist',
});

@Injectable()
export class AppService {
  async szabalyLista() {
    const [results] = await mysqlConnection.execute(
      'SELECT id, priority, mac, enabled FROM blocklist ORDER BY priority',
    );
    return results as Szabaly[];
  }

  async ujSzabaly(priority: number, mac: string, enabled: boolean) {
    const [results] = await mysqlConnection.execute(
      'INSERT INTO blocklist (priority, mac, enabled) VALUES (?, ?, ?)',
      [priority, mac, enabled],
    );
    const rows = results as { insertId: number };
    return {
      id: rows.insertId,
      priority,
      mac,
      enabled,
    } as Szabaly;
  }
}
