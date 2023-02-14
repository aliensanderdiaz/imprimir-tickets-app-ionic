import { Component } from '@angular/core';
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';
// import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';

import EscPosEncoder from 'esc-pos-encoder-ionic';
import { commands } from '../printer/printer-command';

// @ts-ignore
import QRCode from 'qrcode';

const MAC = 'DC:0D:30:8A:B9:41';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  MAC = 'DC:0D:30:8A:B9:41';
  messages: string[] = ['Mensaje de Inicio'];

  resultByte: any

  constructor(private bluetoothSerial: BluetoothSerial) {
    console.log({
      bluetoothSerial: this.bluetoothSerial,
    });
  }

  imprimir() {
    this.bluetoothSerial.connect(MAC).subscribe({
      next: async (data: any) => {
        console.log({ data });
        let estaConectado = await this.bluetoothSerial.isConnected();
      },
      error: (err: any) => {
        console.error({
          err,
        });
      },
    });
  }

  async testFont() {
    this.messages.unshift('Función testFont');

    // let img = new Image();
    // img.src = 'assets/header.bmp';

    const encoder = new EscPosEncoder();
    const result = encoder.initialize();
    this.messages.unshift('Encoder y Result');

    // result
    //   // .image(img, 300, 300, 'atkinson', 128)
    //   .align('center')
    //   .raw(commands.TEXT_FORMAT.TXT_4SQUARE)
    //   .raw(commands.TEXT_FORMAT.TXT_FONT_A)
    //   .line('4SQUARE FONT A')
    //   .raw(commands.TEXT_FORMAT.TXT_4SQUARE)
    //   .raw(commands.TEXT_FORMAT.TXT_FONT_B)
    //   .line('4SQUARE FONT B')
    //   .raw(commands.TEXT_FORMAT.TXT_4SQUARE)
    //   .raw(commands.TEXT_FORMAT.TXT_FONT_C)
    //   .line('4SQUARE FONT C')
    //   .raw(commands.TEXT_FORMAT.TXT_NORMAL)
    //   .raw(commands.TEXT_FORMAT.TXT_FONT_A)
    //   .line('NORMAL FONT A')
    //   .raw(commands.TEXT_FORMAT.TXT_NORMAL)
    //   .raw(commands.TEXT_FORMAT.TXT_FONT_B)
    //   .line('NORMAL FONT B')
    //   .raw(commands.TEXT_FORMAT.TXT_NORMAL)
    //   .raw(commands.TEXT_FORMAT.TXT_FONT_C)
    //   .line('NORMAL FONT C')
    //   .raw(commands.TEXT_FORMAT.TXT_CUSTOM_SIZE(33, 25))
    //   .line('CUSTOM SIZE TEST')
    //   .raw(commands.TEXT_FORMAT.TXT_CUSTOM_SIZE(21, 18))
    //   .line('CUSTOM SIZE TEST')
    //   .raw(commands.TEXT_FORMAT.TXT_CUSTOM_SIZE(11, 18))
    //   .line('CUSTOM SIZE TEST')
    //   .raw(commands.TEXT_FORMAT.TXT_HEIGHT[1])
    //   .line('HEIGHT TEST')
    //   .raw(commands.TEXT_FORMAT.TXT_HEIGHT[2])
    //   .line('HEIGHT TEST')
    //   .raw(commands.TEXT_FORMAT.TXT_HEIGHT[3])
    //   .line('HEIGHT TEST')
    //   .raw(commands.TEXT_FORMAT.TXT_HEIGHT[4])
    //   .line('HEIGHT TEST')
    //   .raw(commands.TEXT_FORMAT.TXT_HEIGHT[5])
    //   .line('HEIGHT TEST')
    //   .raw(commands.TEXT_FORMAT.TXT_WIDTH[1])
    //   .line('WIDTH TEST')
    //   .raw(commands.TEXT_FORMAT.TXT_WIDTH[2])
    //   .line('WIDTH TEST')
    //   .raw(commands.TEXT_FORMAT.TXT_WIDTH[3])
    //   .line('WIDTH TEST')
    //   .raw(commands.TEXT_FORMAT.TXT_WIDTH[4])
    //   .line('WIDTH TEST')
    //   .raw(commands.TEXT_FORMAT.TXT_WIDTH[5])
    //   .line('WIDTH TEST')
    //   .raw(commands.TEXT_FORMAT.TXT_2WIDTH)
    //   .line('2WIDTH TEST')
    //   .size('small')
    //   .line('small text')
    //   .size('normal')
    //   .line('A line of normal text');

    let qrdata = await QRCode.toDataURL(`ABC123`);

    let imgQR = new Image();
    imgQR.src = qrdata;

    imgQR.onload = async () => {
      this.messages.unshift('IMAGEN CARGADA')
      this.messages.unshift('IMAGEN CARGADA')
      this.messages.unshift('IMAGEN CARGADA')
      // result
      //   .codepage('cp437')
      //   .align('center')
      //   .image(imgQR, 280, 280, 'atkinson', 128)
      //   // .raw(commands.TEXT_FORMAT.TXT_4SQUARE)
      //   .line('ABC-123')
      //   // .raw(commands.TEXT_FORMAT.TXT_NORMAL)
      //   .line('ALEXANDER DIAZ')
      //   // .line('1075235031')
      //   .bold(true)
      //   .line('3138984679')
      //   .bold(false)
      //   .newline()
      //   .newline()
      //   .newline()
      //   .newline()
      //   .cut();

      result
          .codepage('cp437')
          // .image(img, 560, 400, 'atkinson', 128)
          // .newline()
          .align('center')
          .bold(true)
          .line('ALMACENES UNIVERSAL S.A.S.')
          .bold(false)
          .image(imgQR, 280, 280, 'atkinson', 128)
          .newline()
          .size('small')
          .line('GENERADO POR: SOFTWARE PROPIO')
          .line('ALMACENES UNIVESAL S.A.S. NIT 901260162-8')
          .newline()
          .newline()
          .newline()
          .newline()
          .newline()
          .cut()

        this.resultByte = result.encode()
    };

    const resultByte = result.encode();

    this.messages.unshift('resultbyte: ' + JSON.stringify(resultByte));
    this.messages.unshift(this.MAC);
    // this.bluetoothSerial.list().then(function (devices) {
    //   console.log({ devices})
    //   devices.forEach(function (device: any) {
    //     console.log(device.id);
    //   });
    // }).catch(err => console.error({ err }));
    // return;

    this.messages.unshift(
      'this.bluetoothSerial: ' + JSON.stringify(this.bluetoothSerial)
    );

    try {
      let conectado = await this.bluetoothSerial.isConnected();

      this.messages.unshift(`Conectado: ${conectado}`);

      this.bluetoothSerial
        .write(this.resultByte)
        .then(() => {
          this.printNotif();
          this.bluetoothSerial.disconnect();
        })
        .catch((err) => {
          this.printError(err);
          this.bluetoothSerial.disconnect();
        });
    } catch (error) {
      this.messages.unshift(
        'Error verificando la conexión ' + JSON.stringify(error)
      );
      this.messages.unshift('RECONECTANDO');
      this.bluetoothSerial.connect(this.MAC).subscribe({
        next: (data: any) => {
          this.messages.unshift('connectData: ' + JSON.stringify(data));
          // this.messages.unshift(JSON.stringify(data));
          // this.conectado = true;

          // this.bluetoothSerial
          //   .write(resultByte)
          //   .then(() => {
          //     this.printNotif();
          //     this.bluetoothSerial.disconnect();
          //   })
          //   .catch((err) => {
          //     this.printError(err);
          //     this.bluetoothSerial.disconnect();
          //   });
        },
        error: (error: any) => {
          this.messages.unshift('connectError: ' + JSON.stringify(error));
          // this.messages.unshift(JSON.stringify(error));
          // this.conectado = false;
        },
        complete: () => {
          this.messages.unshift('complete');
        },
      });
    }

    // try {
    //   let isEnabled = await this.bluetoothSerial.isEnabled()

    //   this.messages.unshift(`isEnabled: ${ isEnabled }`)

    // } catch (error) {
    //   this.messages.unshift('Error verificando la habilitación ' + JSON.stringify(error))
    // }

    return;

    this.bluetoothSerial.connect(this.MAC).subscribe({
      next: () => {
        this.messages.unshift('Connect OK');
        // this.bluetoothSerial
        //   .write(resultByte)
        //   .then(() => {
        //     this.printNotif();
        //     this.bluetoothSerial.disconnect();
        //   })
        //   .catch((err) => {
        //     this.printError(err);
        //     this.bluetoothSerial.disconnect();
        //   });
      },
      error: (err) => {
        this.messages.unshift(JSON.stringify(err));
      },
    });
  }

  printNotif() {}

  printError(err: any) {}
}
