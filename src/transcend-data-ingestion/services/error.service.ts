import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TdDialogService, IAlertConfig } from '@covalent/core/dialogs';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

export class LIError {
  body: string;
  code: number;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  public _openedSnackBarRef: MatSnackBarRef<any>;

  constructor(private _dialogService: TdDialogService,
    private _router: Router,
    public snackBar: MatSnackBar,
    public _translate: TranslateService,
  ) { }

  open(error: LIError): void {
    if (error) {
      let config: IAlertConfig = {
        title: this._translate.instant('PROBLEM'),
        message: error.body,
        disableClose: true,
      };
      if (error.code) {
        config.message += ` (${error.code.toString()})`;
      }
      if (config.message || config.title) {
        if (error.code === 500 || error.code === 503) {
          if (!this.snackBar._openedSnackBarRef) {
            this.snackBar.open(config.message, this._translate.instant('DISMISS'));
          }
        } else {
          this._dialogService.openAlert(config).afterClosed().subscribe(() => {
            this._checkLIError(error.code);
          });
        }
      }
    }
  }

  private _checkLIError(error: number): void {
    if (error === 403) {
      this._router.navigateByUrl('/');
    }
  }
}
