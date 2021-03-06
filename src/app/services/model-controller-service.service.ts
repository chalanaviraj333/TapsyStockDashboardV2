import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddNewGarageRemoteComponentPage } from '../all-modals/add-new-garage-remote-component/add-new-garage-remote-component.page';
import { AddnewcomponentPage } from '../modalcontrollers/addnewcomponent/addnewcomponent.page';

@Injectable({
  providedIn: 'root'
})
export class ModelControllerServiceService {

  constructor(public modalController: ModalController) { }

  async onClickAddNewRemoteComponent(addnewCategory: string) {
    const modal = await this.modalController.create({
      component: AddnewcomponentPage,
      componentProps: {
        "addnewCategory": addnewCategory
      },
      cssClass: 'add-new-remote-component-class',
      swipeToClose: true,
    });
    return await modal.present();
  }

  async onClickAddNewGarageRemoteComponent(addnewCategory: string) {
    const modal = await this.modalController.create({
      component: AddNewGarageRemoteComponentPage,
      componentProps: {
        "addnewCategory": addnewCategory
      },
      cssClass: 'add-new-remote-component-class',
      swipeToClose: true,
    });
    return await modal.present();
  }
}
