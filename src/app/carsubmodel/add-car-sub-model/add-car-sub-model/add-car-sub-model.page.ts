import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActionSheetController, ToastController } from '@ionic/angular';
import { from } from 'rxjs';
import { CarBrand } from 'src/app/car-brand';
import { CarModel } from 'src/app/car-model';
import { CarSubModel } from 'src/app/interfaces/car-sub-model';
import { CarSubModelService } from 'src/app/services/car-sub-model.service';
import { UserPhoto } from 'src/app/user-photo';

@Component({
  selector: 'app-add-car-sub-model',
  templateUrl: './add-car-sub-model.page.html',
  styleUrls: ['./add-car-sub-model.page.scss'],
})
export class AddCarSubModelPage implements OnInit {

  public allcarbrands: Array<string> = [];
  private allcarmodels: Array<CarModel> = [];
  public selectedcarmodels: Array<CarModel> = [];


  constructor(private http: HttpClient, public carSubModelService: CarSubModelService, public actionSheetController: ActionSheetController, private toastController: ToastController) { }

  ngOnInit() {
    this.http.get<{ [key: string]: CarBrand}>('https://tapsy-stock-app-v3-database-default-rtdb.firebaseio.com/all-car-brands.json')
    .subscribe(resData => {
      for (const key in resData) {
        this.allcarbrands.push(resData[key].name)
        this.allcarbrands.sort((a, b) => (a > b) ? 1 : -1)
      }
      }
    );

    // get all car models
    this.http.get<{ [key: string]: CarModel}>('https://tapsy-stock-app-v3-database-default-rtdb.firebaseio.com/all-car-models.json')
    .subscribe(resData => {
      for (const key in resData) {
        this.allcarmodels.push({
          brand: resData[key].brand,
          model: resData[key].model,
          icon: resData[key].icon,
          startyear: resData[key].startyear,
          endyear: resData[key].endyear
        })
        this.allcarmodels.sort((a, b) => (a > b) ? 1 : -1)
      }
      }
    );
  }

  onSubmitNext(form: NgForm) {

    if (this.carSubModelService.validentry == true) {
      this.presentToastAddUpload('Please add a photo first.');
      return;
    }

      const enteredCarSubModelDetails: CarSubModel = {
        key: null,
        brand: form.value.selectedCarBrand,
        model: form.value.selectedCarModel.model,
        submodel: form.value.enteredCarSubModel,
        typeofignition: form.value.typeofignition,
        profile: form.value.profile,
        chipID: form.value.chipID,
        freq: form.value.freq,
        updatedat: null,
        icon: form.value.selectedCarBrand + form.value.selectedCarModel.model + form.value.enteredCarSubModel,
        startyear: form.value.selectedSubModelStartYear,
        endyear: form.value.selectedSubModelEndYear,
        compatibleremotes: null,
        compatibleremoteshells: null,
         }

      if (enteredCarSubModelDetails.startyear < form.value.selectedCarModel.startyear)
      {
        this.presentToastAddUpload('Start Year is below model start year.');
        return;
      }
      else if (enteredCarSubModelDetails.endyear > form.value.selectedCarModel.endyear)
      {
        this.presentToastAddUpload('End Year is above model end year.');
        return;
      }

      this.carSubModelService.uploadSubCarModel(enteredCarSubModelDetails);

  }

  public async showActionSheet(photo: UserPhoto, position: number) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Photos',
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.carSubModelService.deletePicture(photo, position);
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          // Nothing to do, action sheet is automatically closed
         }
      }]
    });
    await actionSheet.present();
  }

  async presentToastAddUpload(messagesend: string) {
    const toast = await this.toastController.create({
      message: messagesend,
      duration: 4000,
      position: "top",
      color: "dark",
    });
    toast.present();
  }

  _ionChange(event) {
    const selectedBrand: string = event.target.value;

    this.selectedcarmodels = [];

    this.allcarmodels.forEach(carmodel => {
      if (carmodel.brand == selectedBrand) {
        this.selectedcarmodels.push(carmodel);
      }
    });

  }

}
